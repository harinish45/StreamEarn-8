'use client';

import React, { useState, useEffect } from 'react';
import { TaskManager } from './components/TaskManager';
import type { Task, TaskStatus } from '@/types/blitzit';
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
import { useFocus } from './context/FocusProvider';

const sampleTasks: Task[] = [
    { id: 'task-1', title: 'Marketing brief', description: 'Create a modern design in Figma.', priority: 'important', status: 'do-now', listId: 'work', estimatedTime: 90 },
    { id: 'task-2', title: 'Insta post', description: 'Coordinate with the team for a sync-up.', priority: 'urgent', status: 'tomorrow', listId: 'personal', estimatedTime: 120, recurring: 'weekly' },
    { id: 'task-3', title: 'Call mum', description: 'A critical bug reported by users.', priority: 'urgent', status: 'tomorrow', listId: 'personal', estimatedTime: 30 },
    { id: 'task-4', title: 'Fire Jeffry', description: 'Implement JWT-based authentication.', priority: 'important', status: 'tomorrow', listId: 'work', estimatedTime: 5 },
    { id: 'task-5', title: 'Website update', description: 'Summarize the progress of the week.', priority: 'important', status: 'tomorrow', listId: 'work', estimatedTime: 90 },
    { id: 'task-6', title: 'Product feedback', description: 'Milk, Bread, Eggs.', priority: 'important', status: 'tomorrow', listId: 'personal', estimatedTime: 60 },
    { id: 'task-7', title: 'Core ux brief', description: 'Leg day.', priority: 'neither', status: 'do-later', listId: 'personal', estimatedTime: 80 },
    { id: 'task-8', title: 'Blitzit documentation p1', description: 'Leg day.', priority: 'neither', status: 'do-later', listId: 'personal', estimatedTime: 90 },
    { id: 'task-9', title: 'Vertical banners', description: 'Leg day.', priority: 'neither', status: 'do-later', listId: 'personal', estimatedTime: 90 },
    { id: 'task-10', title: 'Sprint 1 handoff doc', description: 'Leg day.', priority: 'neither', status: 'soon', listId: 'personal', estimatedTime: 180, scheduledAt: new Date().getTime() },
    { id: 'task-11', title: 'Insta post', description: 'Weekly recurring post', priority: 'urgent', status: 'soon', listId: 'personal', estimatedTime: 120, recurring: 'weekly' }
];

export default function BlitzitPage() {
    const [tasks, setTasks] = useState<Task[]>(sampleTasks);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const { startFocus } = useFocus();

    useEffect(() => {
        setIsClient(true);
        // This is where you would fetch tasks from a database
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

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
            else if (over.id === 'this-week') newStatus = 'tomorrow';
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
        setSelectedTask(task);
        setIsDetailsOpen(true);
    };
    
    const handleSaveTask = (updatedTask: Task) => {
        setTasks(produce(draft => {
            const index = draft.findIndex(t => t.id === updatedTask.id);
            if (index !== -1) {
                draft[index] = updatedTask;
            } else {
                // This is a new task
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
    
    const handleStartFocus = (task: Task) => {
        startFocus(task, tasks);
    }

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
            </div>
        </div>
      );
    }

    return (
        <>
           <div className="p-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Alerts />
                    <PomodoroSettings />
                </div>
            </div>
            <DndContext 
                sensors={sensors}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                collisionDetection={closestCenter}
            >
                <TaskManager 
                  tasks={tasks} 
                  onTaskClick={handleTaskClick} 
                  onStartFocus={handleStartFocus}
                />
            </DndContext>
            </div>
            
            <TaskDetails
                task={selectedTask}
                isOpen={isDetailsOpen}
                setIsOpen={setIsDetailsOpen}
                onStartFocus={handleStartFocus}
                onSave={handleSaveTask}
                onDelete={handleDeleteTask}
            />
        </>
    );
}
