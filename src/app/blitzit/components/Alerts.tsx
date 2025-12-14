'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Task } from '@/types/blitzit';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

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
      className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white ${color}`}
    >
      {letter}
    </div>
  );
}

interface AlertsProps {
    tasks: Task[];
    onUpdateTasks: (newStatus: 'do-now' | 'do-later') => void;
}

export function Alerts({ tasks, onUpdateTasks }: AlertsProps) {
    
    const formatTime = (minutes: number | undefined) => {
        if (!minutes) return '';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours > 0 ? `${hours}hr ` : ''}${mins}min`;
    };

    const formatDate = (timestamp: number | undefined) => {
        if (!timestamp) return '';
        return format(new Date(timestamp), 'E p');
    }

    return (
        <AnimatePresence>
        {tasks.length > 0 && (
            <motion.div
                initial={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-foreground">Tasks due now</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">You have {tasks.length} scheduled tasks due now</p>
                        <div className="space-y-3">
                            {tasks.map(task => (
                                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                    <div>
                                        <p className="font-semibold">{task.title}</p>
                                        <p className="text-xs text-muted-foreground">{formatTime(task.estimatedTime)}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <p className="text-sm font-mono text-muted-foreground">{formatDate(task.scheduledAt)}</p>
                                        <TaskPill priority={task.priority} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex gap-4">
                            <Button className="flex-1" variant="default" onClick={() => onUpdateTasks('do-now')}>Do now</Button>
                            <Button className="flex-1" variant="secondary" onClick={() => onUpdateTasks('do-later')}>Do later</Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        )}
        </AnimatePresence>
    )
}
