'use client';

import { useEffect } from 'react';

const PLANNER_KEYS = [
  'streamearn-planner-v5',
  'streamearn-planner-v4',
  'streamearn-planner-v3',
  'streamearn-planner-v2',
  'streamearn-planner-sticky-wall-v2',
  'streamearn-planner-recovery',
];

/**
 * Last-resort recovery only. Normal Planner operation never reaches this
 * component. If a browser-only exception escapes the Planner, clear every
 * known Planner generation (including v5) and retry once instead of trapping
 * the user on the old "Planner recovery" screen.
 */
export default function PlannerError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    try {
      PLANNER_KEYS.forEach((key) => {
        try { window.localStorage.removeItem(key); } catch {}
        try { window.sessionStorage.removeItem(key); } catch {}
      });
    } finally {
      const alreadyRetried = window.sessionStorage.getItem('streamearn-planner-retried') === '1';
      if (!alreadyRetried) {
        window.sessionStorage.setItem('streamearn-planner-retried', '1');
        reset();
        window.setTimeout(() => window.location.replace('/planner'), 50);
      }
    }
  }, [reset]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Planner could not load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Planner data was cleared and the workspace is being restarted. Please refresh once if this message remains.
        </p>
      </div>
    </main>
  );
}
