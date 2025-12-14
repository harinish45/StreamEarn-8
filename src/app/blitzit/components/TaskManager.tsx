'use client';

import React from 'react';
import type { Task, TaskStatus } from '@/types/blitzit';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  FireExtinguisher,
  Users,
  Calendar,
  Repeat,
  Plus,
  PlayCircle,
} from 'lucide-react';
import { useSortable, SortableContext } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  onStartFocus: (task: Task) => void;
}

function TaskPill({ priority }: { priority: Task['priority'] }) {
  const priorityMap: Record<
    Task['priority'],
    { letter: string; color: string }
  > = {
    urgent: { letter: 'P', color: 'bg-pink-500' },
    important: { letter: 'G', color: 'bg-blue-500' },
    neither: { letter: 'B', color: 'bg-green-500' },
  };

  const { letter, color } = priorityMap[priority];

  return (
    <div
      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${color}`}
    >
      {letter}
    </div>
  );
}

function TaskCard({ task, onClick, onStartFocus }: TaskCardProps) {
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
      <Card
        className={`mb-2 cursor-grab rounded-lg p-3 shadow-none transition-all active:cursor-grabbing bg-card/50 hover:bg-card/70`}
        onClick={handleCardClick}
        {...attributes}
        {...listeners}
      >
        <CardContent className="p-0">
            <>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    {isFireJeffry && (
                        <FireExtinguisher className="h-4 w-4 text-red-500" />
                    )}
                    <p className="font-medium">{task.title}</p>
                    </div>
                    {task.id === 'task-1' ? <Users className="h-5 w-5 text-muted-foreground" /> : <TaskPill priority={task.priority} />}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatTime(task.estimatedTime)}</span>
                    {task.recurring && <span>{getRecurrenceDay(task.status)}</span>}
                    {task.scheduledAt && <span>May 27th</span>}
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onStartFocus(task); }}>
                        <PlayCircle className="h-5 w-5 text-primary" />
                    </Button>
                </div>
            </>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onStartFocus: (task: Task) => void;
  est: string;
  done?: number;
  total?: number;
  isToday?: boolean;
}

function TaskColumn({
  id,
  title,
  tasks,
  onTaskClick,
  onStartFocus,
  est,
  done,
  total,
  isToday = false,
}: TaskColumnProps) {
  const { setNodeRef } = useDroppable({ id, data: { type: 'Column', id } });

  const scheduledTasks = tasks.filter(t => t.scheduledAt);
  const recurringTasks = tasks.filter(t => t.recurring);
  const regularTasks = tasks.filter(t => !t.scheduledAt && !t.recurring);

  const handleBlitzNow = () => {
    if (tasks.length > 0) {
      onStartFocus(tasks[0]);
    }
  };

  return (
    <div
      className={`flex-1 rounded-xl bg-card p-4 ${
        isToday ? 'border-2 border-purple-500/50 shadow-lg shadow-purple-500/10' : ''
      }`}
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
                <TaskCard key={task.id} task={task} onClick={onTaskClick} onStartFocus={onStartFocus}/>
              ))}
              <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
                <Plus className="h-4 w-4" /> Add Task
              </Button>
              {scheduledTasks.length > 0 && (
                <div className="mt-6">
                  <h4 className="mb-2 text-sm font-semibold text-muted-foreground">{scheduledTasks.length} Scheduled tasks</h4>
                  {scheduledTasks.map(task => (
                     <TaskCard key={task.id} task={task} onClick={onTaskClick} onStartFocus={onStartFocus} />
                  ))}
                </div>
              )}
               {recurringTasks.length > 0 && (
                <div className="mt-6">
                  <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Recurring tasks</h4>
                  {recurringTasks.map(task => (
                     <TaskCard key={task.id} task={task} onClick={onTaskClick} onStartFocus={onStartFocus}/>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
             {tasks.map(task => (
                <TaskCard key={task.id} task={task} onClick={onTaskClick} onStartFocus={onStartFocus} />
             ))}
             <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
                <Plus className="h-4 w-4" /> Add Task
              </Button>
            </>
          )}
        </SortableContext>
      </div>

       {isToday && (
         <div className="mt-6">
           <Button onClick={handleBlitzNow} className="h-12 w-full rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-lg font-bold text-white transition-all hover:shadow-lg hover:shadow-purple-500/30">
             ⚡ Blitz now
           </Button>
         </div>
       )}
    </div>
  );
}

interface TaskManagerProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onStartFocus: (task: Task) => void;
}

export function TaskManager({ tasks, onTaskClick, onStartFocus }: TaskManagerProps) {
  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter(t => t.status === status);

  const backlogTasks = tasks.filter(t => t.status === 'do-later' || t.status === 'soon');
  const thisWeekTasks = tasks.filter(t => t.status === 'tomorrow' || t.title === 'Fire Jeffry');
  const todayTasks = tasks.filter(t => t.status === 'do-now');


  return (
    <div className="flex gap-6">
      <TaskColumn
        id="backlog"
        title="Backlog"
        tasks={backlogTasks}
        onTaskClick={onTaskClick}
        onStartFocus={onStartFocus}
        est="Est: 9hrs 20min"
      />
      <TaskColumn
        id="this-week"
        title="This week"
        tasks={thisWeekTasks}
        onTaskClick={onTaskClick}
        onStartFocus={onStartFocus}
        est="Est: 5hrs 5min"
        done={2}
        total={8}
      />
      <TaskColumn
        id="today"
        title="Today"
        tasks={todayTasks}
        onTaskClick={onTaskClick}
        onStartFocus={onStartFocus}
        est="Est: 1hrs 30min"
        done={0}
        total={1}
        isToday={true}
      />
    </div>
  );
}
