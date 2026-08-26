'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEYS = ['streamearn-planner-v4', 'streamearn-planner-v3', 'streamearn-planner-v2', 'streamearn-planner-sticky-wall-v2'];

export default function PlannerError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [recovering, setRecovering] = useState(true);

  useEffect(() => {
    try {
      STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    } finally {
      setRecovering(false);
    }
  }, []);

  const recover = () => {
    try {
      STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
      sessionStorage.removeItem('streamearn-planner-recovery');
    } finally {
      reset();
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <section className="w-full max-w-md rounded-2xl border bg-card p-7 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Planner recovery</p>
        <h1 className="mt-2 text-xl font-semibold">Planner state was reset safely</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The Planner encountered invalid browser data. Local Planner storage has been cleared so the workspace can start cleanly.
        </p>
        <div className="mt-5 flex justify-center gap-2">
          <Button onClick={recover} disabled={recovering}>
            <RotateCcw className="mr-2 h-4 w-4" />
            {recovering ? 'Recovering…' : 'Reload Planner'}
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            <Trash2 className="mr-2 h-4 w-4" />
            Exit
          </Button>
        </div>
      </section>
    </main>
  );
}
