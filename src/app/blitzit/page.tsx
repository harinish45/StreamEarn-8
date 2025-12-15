
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

// Mock data, as we removed the database
const initialTasks: TaskType[] = [
    {
      id: 'task-1',
      title: 'Finalize Q3 budget report',
      description: 'Review all department submissions and consolidate into the final report for the board meeting.',
      priority: 'urgent',
      status: 'soon',
      listId: 'work',
      estimatedTime: 120, // 2 hours
      recurring: 'monthly',
    },
    {
      id: 'task-2',
      title: 'Draft marketing email for new feature',
      description: 'Write copy for the upcoming email campaign announcing the new AI-powered analytics dashboard.',
      priority: 'important',
      status: 'do-now',
      listId: 'work',
      estimatedTime: 45,
    },
    {
      id: 'task-3',
      title: 'Schedule dentist appointment',
      description: 'Call Dr. Smith\'s office to schedule a routine check-up and cleaning.',
      priority: 'neither',
      status: 'do-later',
      listId: 'personal',
    },
    {
      id: 'task-4',
      title: 'Buy groceries for the week',
      description: 'Milk, eggs, bread, chicken, and vegetables.',
      priority: 'important',
      status: 'do-later',
      listId: 'personal',
      estimatedTime: 60,
    },
     {
      id: 'task-5',
      title: 'Prepare presentation for client meeting',
      description: 'Create slides for the project kickoff with Acme Corp.',
      priority: 'urgent',
      status: 'tomorrow',
      listId: 'work',
      estimatedTime: 90,
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).getTime(), // Tomorrow
    },
    {
      id: 'task-6',
      title: 'Pay monthly bills',
      description: 'Rent, utilities, and credit card.',
      priority: 'urgent',
      status: 'do-later',
      listId: 'personal',
      recurring: 'monthly'
    },
    {
      id: 'task-7',
      title: 'Research summer vacation destinations',
      description: 'Look into options for a one-week trip in July. Focus on beach locations.',
      priority: 'neither',
      status: 'soon',
      listId: 'personal',
      estimatedTime: 75,
    },
];


export default function BlitzitPage() {
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        setIsLoading(true);
        // Simulate fetching data
        setTimeout(() => {
            setTasks(initialTasks);
            setIsLoading(false);
        }, 500);
    }, []);

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
                
                return arrayMove(currentTasks, oldIndex, newIndex);
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
        setTasks(produce(draft => {
            const task = draft.find(t => t.id === taskId);
            if (task) {
                Object.assign(task, updates);
            }
        }));
        toast({ title: "Task updated (local only)" });
    }
    
    const handleSaveTask = async (taskToSave: TaskType) => {
        const isNew = taskToSave.id.startsWith('new-');
        
        if (isNew) {
            const { id, ...taskData } = taskToSave;
            const newTask: TaskType = {
                id: `task-${Date.now()}`, // permanent ID
                title: taskData.title || 'New Task',
                status: taskData.status || 'do-later',
                priority: taskData.priority || 'neither',
                description: taskData.description,
                estimatedTime: taskData.estimatedTime,
                listId: 'personal',
            };
                
            setTasks(produce(draft => {
                const tempIndex = draft.findIndex(t => t.id === taskToSave.id);
                if (tempIndex > -1) {
                    draft[tempIndex] = newTask;
                } else {
                    draft.push(newTask);
                }
            }));
            toast({ title: "Task created (local only)" });
        } else {
            handleUpdateTask(taskToSave.id, taskToSave);
        }

        setIsDetailsOpen(false);
        setSelectedTask(null);
    }

    const handleDeleteTask = async (taskId: string) => {
        setTasks(tasks.filter(t => t.id !== taskId));
        
        if (selectedTask?.id === taskId) {
          setIsDetailsOpen(false);
          setSelectedTask(null);
        }
        toast({ title: "Task deleted (local only)" });
    }

    const handleUpdateDueTasks = (newStatus: 'do-now' | 'do-later') => {
        tasksDueNow.forEach(dueTask => {
            handleUpdateTask(dueTask.id, { status: newStatus });
        });
    };

    const handleAddTask = (status: TaskStatus) => {
        const tempTask: TaskType = {
            id: `new-${Date.now()}`,
            title: '',
            status: status,
            priority: 'neither',
            listId: 'personal',
        };
        setTasks(produce(draft => {
            draft.push(tempTask);
        }));
        setSelectedTask(tempTask);
        setIsDetailsOpen(true);
    };

    const handlePriorityChange = (taskId: string, newPriority: TaskPriority) => {
        handleUpdateTask(taskId, { priority: newPriority });
    };
    
    const todayTasks = tasks.filter(t => t.status === 'do-now');
    const doneTodayCount = tasks.filter(t => t.status === 'done' && t.updatedAt && isToday(new Date(t.updatedAt))).length;

    if (isLoading) {
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
