
'use client';

import React, { useState } from 'react';
import { TaskManager } from './components/TaskManager';
import { FocusTimer } from './components/FocusTimer';
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
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { produce } from 'immer';
import { TaskDetails } from './components/TaskDetails';
import { ReportsOverview } from './components/ReportsOverview';
import { GamificationPanel } from './components/GamificationPanel';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    const [isFocusing, setIsFocusing] = useState(false);
    const [focusedTask, setFocusedTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
          coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;
    
        const activeId = active.id;
        const overId = over.id;
    
        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === 'Task';
        const isOverAColumn = over.data.current?.type === 'Column';

        if (isActiveATask && isOverAColumn) {
            setTasks(produce(draft => {
                const activeTask = draft.find(t => t.id === activeId);
                if (activeTask && activeTask.status !== overId) {
                    activeTask.status = overId as TaskStatus;
                }
            }));
        }
    };


    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;
        
        const isActiveATask = active.data.current?.type === 'Task';
        const isOverATask = over.data.current?.type === 'Task';

        if (isActiveATask && isOverATask && active.id !== over.id) {
             setTasks((currentTasks) => {
                const oldIndex = currentTasks.findIndex((t) => t.id === active.id);
                const newIndex = currentTasks.findIndex((t) => t.id === over.id);
                return arrayMove(currentTasks, oldIndex, newIndex);
            });
        }
    };

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setIsDetailsOpen(true);
    };

    const handleStartFocus = (task: Task) => {
        setFocusedTask(task);
        setIsFocusing(true);
        setIsDetailsOpen(false);
    }
    
    const handleStopFocus = () => {
        setIsFocusing(false);
        setFocusedTask(null);
    }

    const handleAddTask = () => {
        const newTaskTemplate: Task = {
            id: `task-${Date.now()}`,
            title: 'New Task',
            description: '',
            priority: 'neither',
            status: 'do-now',
            listId: 'work',
        };
        setSelectedTask(newTaskTemplate);
        setIsDetailsOpen(true);
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


    return (
        <DndContext 
            sensors={sensors}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            collisionDetection={closestCenter}
        >
            <div className="grid grid-cols-1 xl:grid-cols-[1fr,400px] gap-8 items-start">
                {/* Main Content */}
                <div className="w-full">
                    <TaskManager tasks={tasks} onTaskClick={handleTaskClick} />
                </div>
                {/* Right Sidebar */}
                <div className="hidden xl:flex flex-col gap-8 sticky top-24">
                    <ReportsOverview />
                    <GamificationPanel />
                </div>
            </div>

            {isFocusing && focusedTask && (
                <FocusTimer 
                    task={focusedTask}
                    onStop={handleStopFocus}
                />
            )}
            
            <TaskDetails
                task={selectedTask}
                isOpen={isDetailsOpen}
                setIsOpen={setIsDetailsOpen}
                onStartFocus={handleStartFocus}
                onSave={handleSaveTask}
                onDelete={handleDeleteTask}
            />
            
            <Button 
                onClick={handleAddTask}
                className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-lg hover:scale-110 transition-transform z-40">
                <Plus className="h-8 w-8" />
            </Button>
        </DndContext>
    );
}
