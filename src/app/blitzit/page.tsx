'use client';

import React, { useState } from 'react';
import { TaskManager } from './components/TaskManager';
import { FocusTimer } from './components/FocusTimer';
import { ReportsOverview } from './components/ReportsOverview';
import { Calendar } from './components/Calendar';
import { GamificationPanel } from './components/GamificationPanel';
import { Settings } from './components/Settings';
import { Integrations } from './components/Integrations';
import { TaskDetails } from './components/TaskDetails';
import type { Task } from '@/types/blitzit';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { produce } from 'immer';

// Sample Data
const sampleTasks: Task[] = [
    { id: 'task-1', title: 'Design the new landing page', description: 'Create a modern design in Figma.', priority: 'urgent', status: 'do-now', listId: 'work', estimatedTime: 120 },
    { id: 'task-2', title: 'Develop the authentication flow', description: 'Implement JWT-based authentication.', priority: 'important', status: 'do-now', listId: 'work', estimatedTime: 180 },
    { id: 'task-3', title: 'Schedule a team meeting', description: 'Coordinate with the team for a sync-up.', priority: 'neither', status: 'do-later', listId: 'work', estimatedTime: 30 },
    { id: 'task-4', title: 'Fix the bug in the payment gateway', description: 'A critical bug reported by users.', priority: 'urgent', status: 'do-later', listId: 'work', estimatedTime: 90 },
    { id: 'task-5', title: 'Write the weekly report', description: 'Summarize the progress of the week.', priority: 'important', status: 'tomorrow', listId: 'work', estimatedTime: 60 },
    { id: 'task-6', title: 'Buy groceries', description: 'Milk, Bread, Eggs.', priority: 'neither', status: 'soon', listId: 'personal', estimatedTime: 45 },
    { id: 'task-7', title: 'Go to the gym', description: 'Leg day.', priority: 'neither', status: 'soon', listId: 'personal', estimatedTime: 60 },
];

export default function BlitzitPage() {
    const [tasks, setTasks] = useState<Task[]>(sampleTasks);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const activeId = active.id;
            const overId = over.id;
            
            // This is a simplified drag-and-drop logic for UI demonstration.
            // A full implementation would need to know which column it was dropped into.
            // For now, we'll just re-order based on an assumption.
            setTasks((currentTasks) => {
                 const oldIndex = currentTasks.findIndex((t) => t.id === activeId);
                 const newIndex = currentTasks.findIndex((t) => t.id === overId);
                 
                 // A simple re-ordering for demonstration purposes
                 if (oldIndex !== -1 && newIndex !== -1) {
                    return produce(currentTasks, draft => {
                        const [movedTask] = draft.splice(oldIndex, 1);
                        draft.splice(newIndex, 0, movedTask);
                        // In a real app, you'd also update the status based on `over.data.current.droppableId`
                    });
                 }
                 return currentTasks;
            });
        }
    };

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setIsDetailsOpen(true);
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex flex-col min-h-screen bg-background text-foreground">
                <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container flex h-14 items-center">
                        <div className="flex flex-1 items-center justify-between">
                            <a href="/" className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="m8 3 4 8 5-5 5 15H2L8 3z"></path></svg>
                                <span className="font-bold text-lg">Blitzit</span>
                            </a>
                            <nav className="flex items-center space-x-2 text-sm font-medium">
                                <GamificationPanel />
                                <Settings />
                                <Integrations />
                            </nav>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                             <TaskManager tasks={tasks} onTaskClick={handleTaskClick} />
                        </div>
                        <div className="space-y-8">
                            <ReportsOverview />
                            <Calendar />
                        </div>
                    </div>
                </main>

                <FocusTimer />

                {selectedTask && (
                    <TaskDetails
                        task={selectedTask}
                        isOpen={isDetailsOpen}
                        setIsOpen={setIsDetailsOpen}
                    />
                )}
            </div>
        </DndContext>
    );
}