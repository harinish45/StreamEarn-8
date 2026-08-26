import { Suspense } from 'react';

export default function OpportunitiesLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="min-h-screen p-6 text-sm text-muted-foreground">Loading opportunities…</div>}>{children}</Suspense>;
}
