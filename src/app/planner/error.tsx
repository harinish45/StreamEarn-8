'use client';

import { useEffect, useRef } from 'react';

export default function PlannerError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const retried = useRef(false);

  useEffect(() => {
    if (retried.current) return;
    retried.current = true;
    const alreadyRetried = window.sessionStorage.getItem('streamearn-planner-retried') === '1';
    if (!alreadyRetried) {
      window.sessionStorage.setItem('streamearn-planner-retried', '1');
      reset();
      window.setTimeout(() => window.location.replace('/planner'), 50);
    }
  }, [reset]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Planner could not load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Planner is restarting without deleting any saved browser data. Refresh once if the problem remains.
        </p>
      </div>
    </main>
  );
}
