
'use client';

import React, { useState, useEffect } from 'react';
import { TaskManager, TaskColumn } from './components/TaskManager';
import type { Task, TaskStatus, TaskPriority } from '@/types/blitzit';
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

const sampleTasks: Task[] = [
    { id: 'task-1', title: 'Marketing brief', description: 'Create a modern design in Figma.', priority: 'important', status: 'do-now', listId: 'work', estimatedTime: 90 },
    { id: 'task-2', title: 'Insta post', description: 'Coordinate with the team for a sync-up.', priority: 'urgent', status: 'tomorrow', listId: 'personal', estimatedTime: 120, recurring: 'weekly' },
    { id: 'task-3', title: 'Call mum', description: 'A critical bug reported by users.', priority: 'urgent', status: 'tomorrow', listId: 'personal', estimatedTime: 30 },
    { id: 'task-4', title: 'Fire Jeffry', description: 'Implement JWT-based authentication.', priority: 'important', status: 'do-later', listId: 'work', estimatedTime: 5 },
    { id: 'task-5', title: 'Website update', description: 'Summarize the progress of the week.', priority: 'important', status: 'do-later', listId: 'work', estimatedTime: 90 },
    { id: 'task-6', title: 'Product feedback', description: 'Milk, Bread, Eggs.', priority: 'important', status: 'do-later', listId: 'personal', estimatedTime: 60 },
    { id: 'task-7', title: 'Core ux brief', description: 'Leg day.', priority: 'neither', status: 'do-later', listId: 'personal', estimatedTime: 80 },
    { id: 'task-8', title: 'Blitzit documentation p1', description: 'Leg day.', priority: 'neither', status: 'do-later', listId: 'personal', estimatedTime: 90 },
    { id: 'task-9', title: 'Vertical banners', description: 'Leg day.', priority: 'neither', status: 'do-later', listId: 'personal', estimatedTime: 90 },
    { id: 'task-10', title: 'Sprint 1 handoff doc', description: 'Leg day.', priority: 'neither', status: 'soon', listId: 'personal', estimatedTime: 180, scheduledAt: new Date().getTime() },
    { id: 'task-11', title: 'Insta post', description: 'Weekly recurring post', priority: 'urgent', status: 'soon', listId: 'personal', estimatedTime: 120, recurring: 'weekly' },
    { id: 'task-12', title: 'Accounts', description: 'Accounts task', priority: 'urgent', status: 'soon', listId: 'work', estimatedTime: 90, scheduledAt: new Date().getTime() }
];

export default function BlitzitPage() {
    const [tasks, setTasks] = useState<Task[]>(sampleTasks);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );
    
    const tasksDueNow = tasks.filter(task => task.scheduledAt && isToday(new Date(task.scheduledAt)) && task.status !== 'do-now' && task.status !== 'done');


    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;
    
        const activeId = active.id;
        const overId = over.id;
    
        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === 'Task';
        const isOverAColumn = over.data.current?.type === 'Column';

        let newStatus: TaskStatus | undefined;
        if (isOverAColumn) {
            if (over.id === 'today') newStatus = 'do-now';
            else if (over.id === 'tomorrow') newStatus = 'tomorrow';
            else if (over.id === 'this-week') newStatus = 'soon';
            else if (over.id === 'backlog') newStatus = 'do-later';
        }

        if (isActiveATask && newStatus) {
            setTasks(produce(draft => {
                const activeTask = draft.find(t => t.id === activeId);
                if (activeTask && activeTask.status !== newStatus) {
                    activeTask.status = newStatus;
                }
            }));
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

    const handleTaskClick = (task: Task) => {
        if (task.audioBlob) {
            const audioUrl = URL.createObjectURL(task.audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
        } else {
            setSelectedTask(task);
            setIsDetailsOpen(true);
        }
    };
    
    const handleSaveTask = (updatedTask: Task) => {
        setTasks(produce(draft => {
            const index = draft.findIndex(t => t.id === updatedTask.id);
            if (index !== -1) {
                draft[index] = updatedTask;
            } else {
                draft.unshift(updatedTask);
            }
        }));
        setIsDetailsOpen(false);
        setSelectedTask(null);
    }

    const handleDeleteTask = (taskId: string) => {
        setTasks(tasks.filter(t => t.id !== taskId));
        setIsDetailsOpen(false);
        setSelectedTask(null);
    }

    const handleUpdateDueTasks = (newStatus: 'do-now' | 'do-later') => {
        setTasks(produce(draft => {
            tasksDueNow.forEach(dueTask => {
                const taskInDraft = draft.find(t => t.id === dueTask.id);
                if (taskInDraft) {
                    taskInDraft.status = newStatus;
                }
            });
        }));
    };

    const handleAddTask = (status: TaskStatus) => {
        setSelectedTask({
            id: `task-${Date.now()}`,
            title: '',
            status: status,
            priority: 'neither',
            listId: 'personal'
        });
        setIsDetailsOpen(true);
    };

    const handlePriorityChange = (taskId: string, newPriority: TaskPriority) => {
        setTasks(produce(draft => {
            const task = draft.find(t => t.id === taskId);
            if (task) {
                task.priority = newPriority;
            }
        }));
    };
    
    const todayTasks = tasks.filter(t => t.status === 'do-now');

    if (!isClient) {
      return (
        <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                    <div className="h-48 bg-card rounded-xl animate-pulse"></div>
                </div>
                <div className="h-48 bg-card rounded-xl animate-pulse"></div>
            </div>
            <div className="flex gap-6">
                <div className="flex-1 rounded-xl bg-card p-4 h-[70vh] animate-pulse"></div>
                <div className="flex-1 rounded-xl bg-card p-4 h-[70vh] animate-pulse"></div>
                <div className="flex-1 rounded-xl bg-card p-4 h-[70vh] animate-pulse"></div>
                 <div className="flex-1 rounded-xl bg-card p-4 h-[70vh] animate-pulse"></div>
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
                                done={0}
                                total={1}
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
