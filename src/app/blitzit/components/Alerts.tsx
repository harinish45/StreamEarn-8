'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Task } from '@/types/blitzit';

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


export function Alerts() {
    return (
        <Card className="bg-card">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Tasks due now</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">You have 2 scheduled tasks due now</p>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                            <p className="font-semibold">Accounts</p>
                            <p className="text-xs text-muted-foreground">1hr 30min</p>
                        </div>
                        <div className="flex items-center gap-3">
                             <p className="text-sm font-mono text-muted-foreground">Mon 3PM</p>
                             <TaskPill priority="urgent" />
                        </div>
                    </div>
                     <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                            <p className="font-semibold">Insta Post</p>
                            <p className="text-xs text-muted-foreground">1hr 30min</p>
                        </div>
                        <div className="flex items-center gap-3">
                             <p className="text-sm font-mono text-muted-foreground">Mon 3PM</p>
                             <TaskPill priority="important" />
                        </div>
                    </div>
                </div>
                 <div className="mt-6 flex gap-4">
                    <Button className="flex-1" variant="default">Do now</Button>
                    <Button className="flex-1" variant="secondary">Do later</Button>
                </div>
            </CardContent>
        </Card>
    )
}
