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
  return <section className="space-y-3 overflow-x-hidden">
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"><div><div className="flex flex-wrap items-center gap-1.5 text-primary"><Newspaper className="h-3.5 w-3.5"/><span className="text-[10px] font-semibold uppercase tracking-[0.18em]">AI Tech News</span><Badge variant="outline" className="px-1.5 py-0 text-[8px]">Daily refresh</Badge></div><h2 className="mt-1 text-xl font-semibold tracking-tight">What’s changing in AI</h2><p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">Agents, developer tools, infrastructure, security, products and the AI economy.</p></div>{!compact && <div className="flex gap-1.5"><div className="relative w-56"><Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground"/><Input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search news..." className="h-8 pl-8 text-[10px]"/></div><div className="flex rounded-md border bg-card p-0.5"><Button size="sm" variant={view==='grid'?'default':'ghost'} onClick={()=>setView('grid')} className="h-7 px-2"><Grid2X2 className="h-3 w-3"/></Button><Button size="sm" variant={view==='list'?'default':'ghost'} onClick={()=>setView('list')} className="h-7 px-2"><List className="h-3 w-3"/></Button></div></div>}</div>
    <div className={list ? 'space-y-1.5' : 'grid gap-2 sm:grid-cols-2 xl:grid-cols-4'}>{visible.map(item => <article key={item.id} className={`group overflow-hidden rounded-lg border bg-card transition hover:border-primary/40 ${list?'flex min-h-[82px]':''}`}><div className={`relative overflow-hidden bg-muted ${list?'w-28 shrink-0':'aspect-[16/6]'}`}><img src={item.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy"/></div><div className="min-w-0 flex-1 p-2.5"><div className="flex items-center justify-between gap-2"><Badge variant="secondary" className="px-1.5 py-0 text-[8px]">{item.category}</Badge><span className="text-[8px] text-muted-foreground">{item.published}</span></div><h3 className="mt-1 line-clamp-2 text-xs font-semibold leading-4">{item.title}</h3><p className="mt-0.5 line-clamp-2 text-[10px] leading-3.5 text-muted-foreground">{item.summary}</p><div className="mt-1.5 flex items-center justify-between text-[8px] text-muted-foreground"><span>{item.source}</span><a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">Read <ExternalLink className="h-2.5 w-2.5"/></a></div></div></article>)}</div>
    {!visible.length && <div className="rounded-xl border border-dashed p-8 text-center text-xs text-muted-foreground">No news matches that search.</div>}
  </section>;
}
