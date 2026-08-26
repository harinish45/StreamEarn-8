'use client';

import { useMemo, useState } from 'react';
import { ExternalLink, Grid2X2, List, Newspaper, Search } from 'lucide-react';
import { aiNews } from '@/lib/ai-news';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function NewsSection({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState(''); const [view, setView] = useState<'grid'|'list'>('grid');
  const items = useMemo(() => { const q = query.trim().toLowerCase(); return aiNews.filter(item => !q || [item.title, item.summary, item.category, item.source].join(' ').toLowerCase().includes(q)); }, [query]);
  const visible = compact ? items.slice(0, 4) : items;
  const list = view === 'list' && !compact;
  return <section className="space-y-4 overflow-x-hidden">
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><div className="flex flex-wrap items-center gap-1.5 text-primary"><Newspaper className="h-4 w-4"/><span className="text-[11px] font-semibold uppercase tracking-[0.18em]">AI Tech News</span><Badge variant="outline" className="px-1.5 py-0 text-[9px]">Daily refresh</Badge></div><h2 className="mt-1.5 text-2xl font-semibold tracking-tight">What’s changing in AI right now</h2><p className="mt-1 max-w-3xl text-xs leading-5 text-muted-foreground">Current updates across agents, developer tools, infrastructure, security, products and the AI economy.</p></div>{!compact && <div className="flex gap-2"><div className="relative w-full md:w-72"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"/><Input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search news..." className="h-9 pl-9 text-xs"/></div><div className="flex rounded-md border bg-card p-0.5"><Button size="sm" variant={view==='grid'?'default':'ghost'} onClick={()=>setView('grid')} className="h-8"><Grid2X2 className="h-3.5 w-3.5"/></Button><Button size="sm" variant={view==='list'?'default':'ghost'} onClick={()=>setView('list')} className="h-8"><List className="h-3.5 w-3.5"/></Button></div></div>}</div>
    <div className={list ? 'space-y-2' : 'grid gap-3 sm:grid-cols-2 xl:grid-cols-4'}>{visible.map(item => <article key={item.id} className={`group overflow-hidden rounded-xl border bg-card transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md ${list?'flex min-h-[104px]':''}`}><div className={`relative overflow-hidden bg-muted ${list?'w-36 shrink-0':'aspect-[16/7]'}`}><img src={item.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy"/></div><div className="min-w-0 flex-1 p-3"><div className="flex items-center justify-between gap-2"><Badge variant="secondary" className="px-1.5 py-0 text-[9px]">{item.category}</Badge><span className="text-[9px] text-muted-foreground">{item.published}</span></div><h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-5">{item.title}</h3><p className="mt-1 line-clamp-2 text-[11px] leading-4 text-muted-foreground">{item.summary}</p><div className="mt-2 flex items-center justify-between text-[9px] text-muted-foreground"><span>{item.source}</span><a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">Read <ExternalLink className="h-2.5 w-2.5"/></a></div></div></article>)}</div>
    {!visible.length && <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">No news matches that search.</div>}
  </section>;
}
