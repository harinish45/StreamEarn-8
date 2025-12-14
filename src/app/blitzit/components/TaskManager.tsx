
'use client';

import React from 'react';
import type { Task, TaskStatus, TaskPriority } from '@/types/blitzit';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  FireExtinguisher,
  Users,
  Plus,
  Mic,
} from 'lucide-react';
import { useSortable, SortableContext } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { PrioritySelector } from './PrioritySelector';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  onPriorityChange: (taskId: string, newPriority: TaskPriority) => void;
}


function TaskCard({ task, onClick, onPriorityChange }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id, data: { type: 'Task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatTime = (minutes: number | undefined) => {
    if (!minutes) return '0hr 0min';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}hr ` : ''}${mins}min`;
  };

  const isFireJeffry = task.title === 'Fire Jeffry';
  
  const getRecurrenceDay = (status: TaskStatus) => {
    switch (status) {
        case 'do-now': return "Tuesdays";
        case 'do-later': return "Wednesdays";
        default: return "Fridays";
    }
  }

  const handleCardClick = () => {
    onClick(task);
  }

  const handlePillClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  }
  
  const handlePriorityChange = (newPriority: TaskPriority) => {
    onPriorityChange(task.id, newPriority);
  };
  
  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.audioBlob) {
        const audioUrl = URL.createObjectURL(task.audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      ref={setNodeRef}
      style={style}
    >
      <div
        className={`mb-2 cursor-grab rounded-lg p-3 shadow-none transition-all active:cursor-grabbing bg-card/50 hover:bg-card/70`}
        onClick={handleCardClick}
        {...attributes} 
        {...listeners}
      >
        <div className="flex items-start">
            <CardContent className="p-0 flex-1">
                <>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                        {isFireJeffry && (
                            <FireExtinguisher className="h-4 w-4 text-red-500" />
                        )}
                        <p className="font-medium">{task.title}</p>
                        </div>
                        <div onClick={handlePillClick}>
                          {task.id === 'task-1' ? <Users className="h-5 w-5 text-muted-foreground" /> : <PrioritySelector currentPriority={task.priority} onPriorityChange={handlePriorityChange} />}
                        </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            {task.audioBlob && (
                                <button onClick={handlePlayAudio} className="hover:text-primary">
                                    <Mic className="h-3 w-3" />
                                </button>
                            )}
                            <span>{formatTime(task.estimatedTime)}</span>
                        </div>
                        {task.recurring && <span>{getRecurrenceDay(task.status)}</span>}
                        {task.scheduledAt && <span>May 27th</span>}
                    </div>
                </>
            </CardContent>
        </div>
      </div>
    </motion.div>
  );
}

export interface TaskColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
  onPriorityChange: (taskId: string, newPriority: TaskPriority) => void;
  status: TaskStatus;
  est: string;
  done?: number;
  total?: number;
}

export function TaskColumn({
  id,
  title,
  tasks,
  onTaskClick,
  onAddTask,
  onPriorityChange,
  status,
  est,
  done,
  total,
}: TaskColumnProps) {
  const { setNodeRef } = useDroppable({ id, data: { type: 'Column', id } });

  const scheduledTasks = tasks.filter(t => t.scheduledAt);
  const recurringTasks = tasks.filter(t => t.recurring);
  const regularTasks = tasks.filter(t => !t.scheduledAt && !t.recurring);

  return (
    <div
      className={`flex-1 rounded-xl bg-card p-4`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <span className="text-sm text-muted-foreground">{est}</span>
      </div>
      {(done !== undefined && total !== undefined) && (
        <div className="mb-4">
          <Progress value={(done / total) * 100} className="h-1 bg-muted" indicatorClassName="bg-foreground" />
          <p className="mt-1 text-right text-xs text-muted-foreground">{done}/{total} DONE</p>
        </div>
      )}
      
      <div ref={setNodeRef} className="min-h-[50vh] space-y-2">
        <SortableContext items={tasks.map(t => t.id)}>
          {id === 'backlog' ? (
            <>
              {regularTasks.map(task => (
                <TaskCard key={task.id} task={task} onClick={onTaskClick} onPriorityChange={onPriorityChange} />
              ))}
              <Button onClick={() => onAddTask(status)} variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
                <Plus className="h-4 w-4" /> Add Task
              </Button>
              {scheduledTasks.length > 0 && (
                <div className="mt-6">
                  <h4 className="mb-2 text-sm font-semibold text-muted-foreground">{scheduledTasks.length} Scheduled tasks</h4>
                  {scheduledTasks.map(task => (
                     <TaskCard key={task.id} task={task} onClick={onTaskClick} onPriorityChange={onPriorityChange} />
                  ))}
                </div>
              )}
               {recurringTasks.length > 0 && (
                <div className="mt-6">
                  <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Recurring tasks</h4>
                  {recurringTasks.map(task => (
                     <TaskCard key={task.id} task={task} onClick={onTaskClick} onPriorityChange={onPriorityChange} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
             {tasks.map(task => (
                <TaskCard key={task.id} task={task} onClick={onTaskClick} onPriorityChange={onPriorityChange} />
             ))}
             <Button onClick={() => onAddTask(status)} variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
                <Plus className="h-4 w-4" /> Add Task
              </Button>
            </>
          )}
        </SortableContext>
      </div>
    </div>
  );
}

interface TaskManagerProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
  onPriorityChange: (taskId: string, newPriority: TaskPriority) => void;
}

export function TaskManager({ tasks, onTaskClick, onAddTask, onPriorityChange }: TaskManagerProps) {
  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter(t => t.status === status);

  const backlogTasks = tasks.filter(t => t.status === 'do-later' || t.status === 'soon');
  const thisWeekTasks = getTasksByStatus('soon');
  const tomorrowTasks = getTasksByStatus('tomorrow');

  return (
    <div className="flex gap-6">
      <TaskColumn
        id="backlog"
        title="Backlog"
        tasks={backlogTasks}
        onTaskClick={onTaskClick}
        onAddTask={onAddTask}
        onPriorityChange={onPriorityChange}
        status='do-later'
        est="Est: 9hrs 20min"
      />
      <TaskColumn
        id="this-week"
        title="This week"
        tasks={thisWeekTasks}
        onTaskClick={onTaskClick}
        onAddTask={onAddTask}
        onPriorityChange={onPriorityChange}
        status='soon'
        est="Est: 5hrs 5min"
        done={2}
        total={8}
      />
      <TaskColumn
        id="tomorrow"
        title="Tomorrow"
        tasks={tomorrowTasks}
        onTaskClick={onTaskClick}
        onAddTask={onAddTask}
        onPriorityChange={onPriorityChange}
        status='tomorrow'
        est="Est: 2hrs 30min"
      />
    </div>
  );
}
