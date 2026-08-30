'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, RefreshCw, WalletCards } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type ApiItem = { id: string; category: string; title: string; description: string; source: string; url: string; published_at: string | null; created_at: string };

export function ScheduledEarningsFeed() {
  const [items, setItems] = useState<ApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch('/api/scheduler?category=earnings', { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to load');
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError(true);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  return <section className="rounded-2xl border bg-card p-4 sm:p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.16em] text-primary"><WalletCards className="h-3.5 w-3.5" />Active earning opportunities<Badge variant="outline" className="text-[8px]">Verified feed</Badge></div>
        <h2 className="mt-1 text-lg font-semibold">Current earning opportunities</h2>
        <p className="mt-1 max-w-2xl text-xs text-muted-foreground">Only non-archived records from the verified scheduler are shown.</p>
      </div>
      <Button type="button" variant="ghost" size="sm" onClick={() => void load()} disabled={loading} className="text-[10px]"><RefreshCw className={`mr-1.5 h-3 w-3 ${loading ? 'animate-spin' : ''}`} /> Refresh</Button>
    </div>

    {loading ? <div className="mt-4 rounded-xl border border-dashed p-7 text-center text-xs text-muted-foreground">Loading verified opportunities…</div>
      : error ? <div className="mt-4 rounded-xl border border-dashed p-7 text-center text-xs text-muted-foreground">Unable to load the verified feed. Try refresh.</div>
      : !items.length ? <div className="mt-4 rounded-xl border border-dashed p-7 text-center text-xs text-muted-foreground">No active earning opportunities are currently verified.</div>
      : <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{items.map(item => <article key={item.id} className="rounded-xl border bg-background p-4 transition hover:border-primary/40">
        <Badge variant="secondary" className="text-[9px]">Earning opportunity</Badge>
        <h3 className="mt-2 text-sm font-semibold leading-5">{item.title}</h3>
        <p className="mt-2 line-clamp-3 text-xs leading-4 text-muted-foreground">{item.description}</p>
        <div className="mt-3 flex items-center justify-between gap-2"><span className="text-[9px] text-muted-foreground">{item.source}</span><a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline">Open <ExternalLink className="h-3 w-3" /></a></div>
      </article>)}</div>}
  </section>;
}
