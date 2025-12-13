'use client';

import React from 'react';
import type { Task, TaskStatus } from '@/types/blitzit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '@/components/ui/badge';

interface TaskCardProps {
    task: Task;
    onClick: (task: Task) => void;
}

function TaskCard({ task, onClick }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id, data: { type: 'Task', task } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };
    
    const priorityColor = {
        urgent: 'bg-red-500/20 text-red-400 border-red-500/30',
        important: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        neither: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="mb-4 bg-card/50 backdrop-blur-sm cursor-grab active:cursor-grabbing hover:border-primary/50 touch-none"
            onClick={() => onClick(task)}
        >
            <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <p className="font-semibold">{task.title}</p>
                    <Badge className={priorityColor[task.priority]}>{task.priority}</Badge>
                </div>
                {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                <div className="mt-4 flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                        {task.estimatedTime ? `${task.estimatedTime} min est.` : ''}
                    </div>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => {e.stopPropagation(); onClick(task);}}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

interface TaskColumnProps {
    id: TaskStatus;
    title: string;
    tasks: Task[];
    onTaskClick: (task: Task) => void;
}

function TaskColumn({ id, title, tasks, onTaskClick }: TaskColumnProps) {
    const { setNodeRef } = useDroppable({ id, data: { type: 'Column' } });

    return (
        <div ref={setNodeRef} className="bg-background/50 rounded-xl p-4 flex-1">
            <h3 className="font-bold text-lg mb-4 px-2">{title}</h3>
            <div className="space-y-4 h-[60vh] overflow-y-auto pr-2">
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map(task => (
                        <TaskCard key={task.id} task={task} onClick={onTaskClick} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}


interface TaskManagerProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
}

export function TaskManager({ tasks, onTaskClick }: TaskManagerProps) {
    const columns: { id: TaskStatus; title: string }[] = [
        { id: 'do-now', title: 'Do Now' },
        { id: 'do-later', title: 'Do Later' },
        { id: 'tomorrow', title: 'Tomorrow' },
        { id: 'soon', title: 'Soon' },
    ];

    const getTasksByStatus = (status: TaskStatus) => tasks.filter(t => t.status === status);

    return (
        <Card className="bg-transparent border-none shadow-none">
            <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
                <CardTitle className="text-2xl">Task Board</CardTitle>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row gap-6">
                    {columns.map(col => (
                        <TaskColumn
                            key={col.id}
                            id={col.id}
                            title={col.title}
                            tasks={getTasksByStatus(col.id)}
                            onTaskClick={onTaskClick}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
