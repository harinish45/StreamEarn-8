'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckSquare, ExternalLink, Grid2X2, List, Newspaper, RefreshCw, Search, Square, Trash2 } from 'lucide-react';
import { aiNews } from '@/lib/ai-news';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 50;
type ScheduledNews = { id:string; title:string; description:string; source:string; url:string; published_at:string|null; created_at:string };
type NewsItem = { id:string; title:string; summary:string; category:string; source:string; url:string; published:string; scheduled:boolean };

const imageForCategory = (category: string) => {
  if (category.includes('Policy')) return '/news/ai-policy.svg';
  if (category.includes('Products')) return '/news/ai-products.svg';
  if (category.includes('Physical')) return '/news/physical-ai.svg';
  if (category.includes('Security')) return '/news/ai-security.svg';
  return '/news/ai-industry.svg';
};

export function NewsSection({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'grid'|'list'>('grid');
  const [scheduled, setScheduled] = useState<NewsItem[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loadingScheduled, setLoadingScheduled] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [scheduleError, setScheduleError] = useState(false);

  const loadScheduled = async (nextOffset = 0) => {
    if (nextOffset === 0) setLoadingScheduled(true);
    else setLoadingMore(true);
    setScheduleError(false);
    try {
      const response = await fetch('/api/scheduler?category=ai_news&limit=' + PAGE_SIZE + '&offset=' + nextOffset, { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to load scheduled news');
      const data = await response.json();
      const rows: ScheduledNews[] = Array.isArray(data) ? data : [];
      const normalized: NewsItem[] = rows.map(item => ({
        id: item.id,
        title: item.title,
        summary: item.description || item.title,
        category: 'AI News',
        source: item.source,
        url: item.url,
        published: item.published_at ? new Date(item.published_at).toLocaleDateString() : new Date(item.created_at).toLocaleDateString(),
        scheduled: true
      }));
      setScheduled(prev => nextOffset === 0 ? normalized : [...prev, ...normalized]);
      setOffset(nextOffset + rows.length);
      setHasMore(response.headers.get('X-Scheduler-Has-More') === '1');
      if (nextOffset === 0) setSelected([]);
    } catch {
      setScheduleError(true);
      if (nextOffset === 0) setScheduled([]);
    } finally {
      if (nextOffset === 0) setLoadingScheduled(false);
      else setLoadingMore(false);
    }
  };

  useEffect(() => { if (!compact) void loadScheduled(0); }, [compact]);

  const toggle = (id:string) => setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id]);
  const toggleAll = (items:NewsItem[]) => {
    const ids=items.filter(x=>x.scheduled).map(x=>x.id);
    const all=ids.length>0&&ids.every(id=>selected.includes(id));
    setSelected(all ? [] : ids);
  };

  const deleteSelected = async () => {
    if (!selected.length) return;
    try {
      const response = await fetch('/api/scheduler/archive', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ids:selected})
      });
      if (!response.ok) throw new Error('Delete failed');
      const removed=new Set(selected);
      setScheduled(prev=>prev.filter(x=>!removed.has(x.id)));
      setSelected([]);
    } catch {
      setScheduleError(true);
    }
  };

  const items = useMemo(() => {
    const q=query.trim().toLowerCase();
    const base=aiNews.map(x=>({...x,scheduled:false as const}));
    return [...scheduled,...base].filter(item=>!q||[item.title,item.summary,item.category,item.source].join(' ').toLowerCase().includes(q));
  }, [query,scheduled]);

  const visible=compact?items.slice(0,4):items;
  const scheduledVisible=visible.filter(item=>item.scheduled);
  const allSelected=scheduledVisible.length>0&&scheduledVisible.every(item=>selected.includes(item.id));
  const list=view==='list'&&!compact;

  return <section className="space-y-3 overflow-x-hidden">
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-1.5 text-primary"><Newspaper className="h-3.5 w-3.5"/><span className="text-[10px] font-semibold uppercase tracking-[0.18em]">AI Tech News</span><Badge variant="outline" className="px-1.5 py-0 text-[8px]">Daily append</Badge></div>
        <h2 className="mt-1 text-xl font-semibold tracking-tight">What’s changing in AI</h2>
        <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">New scheduled stories are appended to the existing news history.</p>
      </div>
      {!compact&&<div className="flex flex-wrap gap-1.5">
        <div className="relative w-56"><Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground"/><Input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search news..." className="h-8 pl-8 text-[10px]"/></div>
        <div className="flex rounded-md border bg-card p-0.5"><Button size="sm" variant={view==='grid'?'default':'ghost'} onClick={()=>setView('grid')} className="h-7 px-2"><Grid2X2 className="h-3 w-3"/></Button><Button size="sm" variant={view==='list'?'default':'ghost'} onClick={()=>setView('list')} className="h-7 px-2"><List className="h-3 w-3"/></Button></div>
        <Button size="sm" variant="outline" onClick={()=>toggleAll(scheduledVisible)} disabled={!scheduledVisible.length} className="h-8 text-[10px]">{allSelected?<CheckSquare className="mr-1.5 h-3 w-3"/>:<Square className="mr-1.5 h-3 w-3" />}{allSelected?'Clear':'Select'} scheduled</Button>
        <Button size="sm" variant="destructive" onClick={()=>void deleteSelected()} disabled={!selected.length} className="h-8 text-[10px]"><Trash2 className="mr-1.5 h-3 w-3"/>Delete{selected.length ? ' ('+selected.length+')' : ''}</Button>
        <Button size="sm" variant="ghost" onClick={()=>void loadScheduled(0)} disabled={loadingScheduled||loadingMore} className="h-8 text-[10px]"><RefreshCw className="mr-1.5 h-3 w-3"/>Refresh</Button>
      </div>}
    </div>

    {loadingScheduled&&!compact&&<div className="rounded-xl border border-dashed p-5 text-center text-xs text-muted-foreground">Loading scheduled AI news…</div>}
    {scheduleError&&!loadingScheduled&&!compact&&<div className="rounded-xl border border-dashed p-5 text-center text-xs text-muted-foreground">Unable to load scheduled AI news. Existing built-in news remains available.</div>}

    {!loadingScheduled&&<div className={list?'space-y-1.5':'grid gap-2 sm:grid-cols-2 xl:grid-cols-4'}>{visible.map(item=><article key={item.id} className={'group overflow-hidden rounded-lg border bg-card transition hover:border-primary/40 '+(list?'flex min-h-[82px]':'')}>
      {item.scheduled&&!compact&&<button type="button" onClick={()=>toggle(item.id)} className="absolute z-10 m-1 rounded-md bg-background/90 p-1 text-muted-foreground hover:text-primary" aria-label="Select scheduled story">{selected.includes(item.id)?<CheckSquare className="h-3 w-3 text-primary"/>:<Square className="h-3 w-3"/>}</button>}
      <div className={'relative overflow-hidden bg-muted '+(list?'w-28 shrink-0':'aspect-[16/6]')}><img src={imageForCategory(item.category)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy"/></div>
      <div className="min-w-0 flex-1 p-2.5"><div className="flex items-center justify-between gap-2"><div className="flex items-center gap-1"><Badge variant="secondary" className="px-1.5 py-0 text-[8px]">{item.category}</Badge>{item.scheduled&&<Badge variant="outline" className="px-1.5 py-0 text-[8px]">New</Badge>}</div><span className="text-[8px] text-muted-foreground">{item.published}</span></div><h3 className="mt-1 line-clamp-2 text-xs font-semibold leading-4">{item.title}</h3><p className="mt-0.5 line-clamp-2 text-[10px] leading-3.5 text-muted-foreground">{item.summary}</p><div className="mt-1.5 flex items-center justify-between text-[8px] text-muted-foreground"><span>{item.source}</span><a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">Read <ExternalLink className="h-2.5 w-2.5"/></a></div></div>
    </article>)}</div>}

    {!compact&&!loadingScheduled&&!scheduleError&&hasMore&&<div className="flex justify-center"><Button type="button" variant="outline" size="sm" onClick={()=>void loadScheduled(offset)} disabled={loadingMore} className="text-[10px]">{loadingMore?'Loading…':'Load more scheduled'}</Button></div>}
    {!visible.length&&<div className="rounded-xl border border-dashed p-8 text-center text-xs text-muted-foreground">No news matches that search.</div>}
    <div className="flex items-center gap-1 text-[9px] text-muted-foreground"><RefreshCw className="h-3 w-3"/> Scheduler only appends; it never replaces existing stories.</div>
  </section>;
}
