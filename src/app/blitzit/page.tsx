
'use client';

import React, { useState, useEffect } from 'react';
import { TaskManager, TaskColumn } from './components/TaskManager';
import type { Task as TaskType, TaskStatus, TaskPriority } from '@/types/blitzit';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { produce } from 'immer';
import { TaskDetails } from './components/TaskDetails';
import { PomodoroSettings } from './components/PomodoroSettings';
import { Alerts } from './components/Alerts';
import { isToday } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { fromDb } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlitzitPage() {
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        setIsClient(true);
        fetch('/api/tasks')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch tasks');
                }
                return res.json();
            })
            .then(data => {
                // The API now returns data in the correct format, so we can use it directly
                if (Array.isArray(data)) {
                    setTasks(data);
                } else {
                    throw new Error('Fetched data is not an array');
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch tasks", err);
                toast({
                    variant: "destructive",
                    title: "Failed to load tasks",
                    description: "Could not fetch tasks from the database. Please try again later."
                })
                setIsLoading(false);
            });
    }, [toast]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );
    
    const tasksDueNow = tasks.filter(task => task.scheduledAt && isToday(new Date(task.scheduledAt)) && task.status !== 'do-now' && task.status !== 'done');

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;
    
        const activeId = active.id.toString();
        const overId = over.id.toString();
    
        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === 'Task';
        const isOverAColumn = over.data.current?.type === 'Column';

        let newStatus: TaskStatus | undefined;
        if (isOverAColumn) {
            const columnId = over.id;
            if (columnId === 'today') newStatus = 'do-now';
            else if (columnId === 'tomorrow') newStatus = 'tomorrow';
            else if (columnId === 'this-week') newStatus = 'soon';
            else if (columnId === 'backlog') newStatus = 'do-later';
        }

        if (isActiveATask && newStatus) {
            const activeTask = tasks.find(t => t.id === activeId);
            if (activeTask && activeTask.status !== newStatus) {
                handleUpdateTask(activeId, { status: newStatus });
            }
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        
        const isActiveATask = active.data.current?.type === 'Task';
        const isOverATask = over.data.current?.type === 'Task';

        if (isActiveATask && isOverATask) {
             setTasks((currentTasks) => {
                const oldIndex = currentTasks.findIndex((t) => t.id === active.id);
                const newIndex = currentTasks.findIndex((t) => t.id === over.id);
                if (oldIndex === -1 || newIndex === -1) return currentTasks;
                
                const newOrderedTasks = arrayMove(currentTasks, oldIndex, newIndex);
                // Here you might want to update the order in the database for all tasks
                // This can be an expensive operation. For now, we only update client-side for smooth UX.
                return newOrderedTasks;
            });
        }
    };

    const handleTaskClick = (task: TaskType) => {
        if (task.audioBlob) {
            const audioUrl = URL.createObjectURL(task.audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
        } else {
            setSelectedTask(task);
            setIsDetailsOpen(true);
        }
    };

    const handleUpdateTask = async (taskId: string, updates: Partial<TaskType>) => {
        // Optimistic update
        const originalTasks = tasks;
        setTasks(produce(draft => {
            const task = draft.find(t => t.id === taskId);
            if (task) {
                Object.assign(task, updates);
            }
        }));

        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error('Failed to update task');
            const updatedTask = await response.json();
            setTasks(produce(draft => {
                const taskIndex = draft.findIndex(t => t.id === taskId);
                if (taskIndex !== -1) {
                    draft[taskIndex] = fromDb(updatedTask);
                }
            }));
        } catch (error) {
            console.error(error);
            setTasks(originalTasks); // Rollback
            toast({
                variant: "destructive",
                title: "Update failed",
                description: `Could not update task.`,
            });
        }
    }
    
    const handleSaveTask = async (taskToSave: TaskType) => {
        const isNew = !taskToSave._id;
        
        if (isNew) {
            // Remove frontend-only ID before sending to backend
            const { id, _id, ...taskData } = taskToSave;
            const payload = {
                title: taskData.title || 'New Task',
                status: taskData.status || 'do-later',
                priority: taskData.priority || 'neither',
                listId: taskData.listId || 'personal',
                description: taskData.description,
                estimatedTime: taskData.estimatedTime,
            };
            
            try {
                const response = await fetch('/api/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Server error:", errorData.message || errorData);
                    throw new Error('Failed to create task');
                }
                const newTask = await response.json();
                
                // Add the newly created task (with a real ID from DB) to the state
                setTasks(produce(draft => {
                    // Remove temp task if it exists
                    const tempIndex = draft.findIndex(t => t.id.startsWith('new-'));
                    if (tempIndex > -1) draft.splice(tempIndex, 1);
                    draft.push(newTask);
                }));

            } catch (error) {
                console.error(error);
                toast({ variant: 'destructive', title: 'Error: Failed to create task.' });
            }

        } else {
            handleUpdateTask(taskToSave.id, taskToSave);
        }

        setIsDetailsOpen(false);
        setSelectedTask(null);
    }

    const handleDeleteTask = async (taskId: string) => {
        const originalTasks = tasks;
        // Optimistic update
        setTasks(tasks.filter(t => t.id !== taskId));
        
        if (selectedTask?.id === taskId) {
          setIsDetailsOpen(false);
          setSelectedTask(null);
        }

        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete task');
        } catch (error) {
            console.error(error);
            setTasks(originalTasks); // Rollback
            toast({ variant: 'destructive', title: 'Failed to delete task.' });
        }
    }

    const handleUpdateDueTasks = (newStatus: 'do-now' | 'do-later') => {
        tasksDueNow.forEach(dueTask => {
            handleUpdateTask(dueTask.id, { status: newStatus });
        });
    };

    const handleAddTask = (status: TaskStatus) => {
        // Create a minimal, valid task object for the modal
        setSelectedTask({
            id: `new-${Date.now()}`,
            title: '',
            status: status,
            priority: 'neither',
            listId: 'personal',
        });
        setIsDetailsOpen(true);
    };

    const handlePriorityChange = (taskId: string, newPriority: TaskPriority) => {
        handleUpdateTask(taskId, { priority: newPriority });
    };
    
    const todayTasks = tasks.filter(t => t.status === 'do-now');
    const doneTodayCount = tasks.filter(t => t.status === 'done' && t.updatedAt && isToday(new Date(t.updatedAt))).length;


    if (isLoading || !isClient) {
      return (
        <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-1">
                    <Skeleton className="h-48 bg-card rounded-xl" />
                </div>
                 <div className="lg:col-span-1">
                    <Skeleton className="h-48 bg-card rounded-xl" />
                </div>
                <div className="lg:col-span-1">
                     <Skeleton className="h-48 bg-card rounded-xl" />
                </div>
            </div>
            <div className="flex gap-6">
                <Skeleton className="flex-1 rounded-xl bg-card p-4 h-[70vh]" />
                <Skeleton className="flex-1 rounded-xl bg-card p-4 h-[70vh]" />
                <Skeleton className="flex-1 rounded-xl bg-card p-4 h-[70vh]" />
            </div>
        </div>
      );
    }

    return (
        <>
           <div className="p-8">
                <DndContext 
                    sensors={sensors}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    collisionDetection={closestCenter}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="lg:col-span-1">
                            <Alerts tasks={tasksDueNow} onUpdateTasks={handleUpdateDueTasks} />
                        </div>
                         <div className="lg:col-span-1">
                            <PomodoroSettings />
                        </div>
                        <div className="lg:col-span-1">
                             <TaskColumn
                                id="today"
                                title="Today"
                                tasks={todayTasks}
                                onTaskClick={handleTaskClick}
                                onAddTask={handleAddTask}
                                onPriorityChange={handlePriorityChange}
                                onDeleteTask={handleDeleteTask}
                                status='do-now'
                                est="Est: 1hrs 30min"
                                done={doneTodayCount}
                                total={todayTasks.length + doneTodayCount}
                            />
                        </div>
                    </div>
                    
                    <TaskManager 
                        tasks={tasks} 
                        onTaskClick={handleTaskClick} 
                        onAddTask={handleAddTask}
                        onPriorityChange={handlePriorityChange}
                        onDeleteTask={handleDeleteTask}
                    />
                </DndContext>
            </div>
            
            <TaskDetails
                task={selectedTask}
                isOpen={isDetailsOpen}
                setIsOpen={setIsDetailsOpen}
                onSave={handleSaveTask}
                onDelete={handleDeleteTask}
            />
        </>
    );
}
