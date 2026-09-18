'use client';

import { useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, CheckSquare, ExternalLink, GraduationCap, RefreshCw, Square, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Kind = 'Internship' | 'Scholarship';
type ApiItem = { id: string; category: string; title: string; description: string; source: string; url: string; published_at: string | null; created_at: string };

const PAGE_SIZE = 50;

export function ScheduledOpportunityFeed({ kind }: { kind: Kind }) {
  const category = kind === 'Internship' ? 'internships' : 'scholarships';
  const [items, setItems] = useState<ApiItem[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState(false);

  const load = async (nextOffset = 0) => {
    if (nextOffset === 0) setLoading(true);
    else setLoadingMore(true);
    setError(false);
    try {
      const response = await fetch(`/api/scheduler?category=${category}&limit=${PAGE_SIZE}&offset=${nextOffset}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to load');
      const data = await response.json();
      const rows = Array.isArray(data) ? data : [];
      setItems(prev => nextOffset === 0 ? rows : [...prev, ...rows]);
      setOffset(nextOffset + rows.length);
      setHasMore(response.headers.get('X-Scheduler-Has-More') === '1');
      if (nextOffset === 0) setSelected([]);
    } catch {
      setError(true);
      if (nextOffset === 0) setItems([]);
    } finally {
      if (nextOffset === 0) setLoading(false);
      else setLoadingMore(false);
    }
  };

  useEffect(() => { void load(0); }, [category]);

  const allSelected = items.length > 0 && selected.length === items.length;
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelected(allSelected ? [] : items.map(item => item.id));
  };

  const deleteSelected = async () => {
    if (!selected.length) return;
    try {
      const response = await fetch('/api/scheduler/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selected })
      });
      if (!response.ok) throw new Error('Delete failed');
      const removed = new Set(selected);
      setItems(prev => prev.filter(item => !removed.has(item.id)));
      setSelected([]);
    } catch {
      setError(true);
    }
  };

  return <section className="mb-5 rounded-2xl border bg-card p-4 sm:p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.16em] text-primary">
          {kind === 'Internship' ? <BriefcaseBusiness className="h-3.5 w-3.5" /> : <GraduationCap className="h-3.5 w-3.5" />}
          Active opportunities
          <Badge variant="outline" className="text-[8px]">Verified feed</Badge>
        </div>
        <h2 className="mt-1 text-lg font-semibold">Current {kind.toLowerCase()} opportunities</h2>
        <p className="mt-1 max-w-2xl text-xs text-muted-foreground">New scheduler runs append records. Existing records are never replaced.</p>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Button type="button" variant="ghost" size="sm" onClick={() => void load(0)} disabled={loading || loadingMore} className="text-[10px]">
          <RefreshCw className={`mr-1.5 h-3 w-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={toggleAll} disabled={!items.length || loading} className="text-[10px]">
          {allSelected ? <CheckSquare className="mr-1.5 h-3 w-3" /> : <Square className="mr-1.5 h-3 w-3" />}
          {allSelected ? 'Clear selection' : 'Select all'}
        </Button>
        <Button type="button" variant="destructive" size="sm" onClick={() => void deleteSelected()} disabled={!selected.length} className="text-[10px]">
          <Trash2 className="mr-1.5 h-3 w-3" /> Delete{selected.length ? ` (${selected.length})` : ''}
        </Button>
      </div>
    </div>

    {loading ? <div className="mt-4 rounded-xl border border-dashed p-7 text-center text-xs text-muted-foreground">Loading verified opportunities…</div>
      : error ? <div className="mt-4 rounded-xl border border-dashed p-7 text-center text-xs text-muted-foreground">Unable to load the verified feed. Try refresh.</div>
      : !items.length ? <div className="mt-4 rounded-xl border border-dashed p-7 text-center text-xs text-muted-foreground">No active opportunities are currently verified.</div>
      : <div className="mt-4 grid gap-3 lg:grid-cols-2">{items.map(item => <article key={item.id} className={`group rounded-xl border bg-background p-3.5 transition hover:border-primary/40 ${selectedSet.has(item.id) ? 'border-primary/60 ring-1 ring-primary/20' : ''}`}>
        <div className="flex items-start gap-3">
          <button type="button" onClick={() => toggle(item.id)} className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary" aria-label={selectedSet.has(item.id) ? 'Deselect item' : 'Select item'}>
            {selectedSet.has(item.id) ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4" />}
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Badge variant="secondary" className="text-[9px]">{kind}</Badge>
                <h3 className="mt-2 text-sm font-semibold leading-5">{item.title}</h3>
                <p className="mt-1 text-[10px] text-muted-foreground">{item.source}</p>
              </div>
            </div>
            <p className="mt-2 line-clamp-3 text-xs leading-4 text-muted-foreground">{item.description}</p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="text-[9px] text-muted-foreground">Verified {new Date(item.created_at).toLocaleDateString()}</span>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] font-medium text-primary hover:underline">Open source <ExternalLink className="h-3 w-3" /></a>
            </div>
          </div>
        </div>
      </article>)}</div>}

    {!loading && !error && hasMore && <div className="mt-4 flex justify-center">
      <Button type="button" variant="outline" size="sm" onClick={() => void load(offset)} disabled={loadingMore} className="text-[10px]">
        {loadingMore ? 'Loading…' : 'Load more'}
      </Button>
    </div>}
  </section>;
}
