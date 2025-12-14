'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Task } from '@/types/blitzit';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

function TaskPill({ priority }: { priority: Task['priority'] }) {
  const priorityMap: Record<
    Task['priority'],
    { label: string; className: string }
  > = {
    urgent: { label: 'Urgent', className: 'bg-pink-500/20 text-pink-400 border border-pink-500/30' },
    important: { label: 'Important', className: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
    neither: { label: 'Neither', className: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  };

  const { label, className } = priorityMap[priority];

  return (
    <div
      className={`flex h-6 items-center justify-center rounded-full px-2 text-xs font-semibold ${className}`}
    >
      {label}
    </div>
  );
}

interface AlertsProps {
    tasks: Task[];
    onUpdateTasks: (newStatus: 'do-now' | 'do-later') => void;
}

export function Alerts({ tasks, onUpdateTasks }: AlertsProps) {
    const [isLoading, setIsLoading] = useState<'do-now' | 'do-later' | null>(null);

    const handleUpdate = (newStatus: 'do-now' | 'do-later') => {
        setIsLoading(newStatus);
        onUpdateTasks(newStatus);
        // The loading state is mostly for show now, so we'll just reset it.
        // In a real app, this would be tied to the async operation's lifecycle.
        setTimeout(() => {
            setIsLoading(null);
        }, 300);
    };

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
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
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
                            <Button className="flex-1" variant="default" onClick={() => handleUpdate('do-now')} disabled={!!isLoading}>
                                {isLoading === 'do-now' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Do now'}
                            </Button>
                            <Button className="flex-1" variant="secondary" onClick={() => handleUpdate('do-later')} disabled={!!isLoading}>
                                {isLoading === 'do-later' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Do later'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        )}
        </AnimatePresence>
    )
}
