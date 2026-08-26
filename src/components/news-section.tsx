'use client';

import { useMemo, useState } from 'react';
import { ExternalLink, Newspaper, Search } from 'lucide-react';
import { aiNews } from '@/lib/ai-news';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export function NewsSection({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState('');
  const items = useMemo(() => { const q = query.trim().toLowerCase(); return aiNews.filter(item => !q || [item.title, item.summary, item.category, item.source].join(' ').toLowerCase().includes(q)); }, [query]);
  const visible = compact ? items.slice(0, 4) : items;
  return <section className="space-y-6">
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div><div className="flex flex-wrap items-center gap-2 text-primary"><Newspaper className="h-5 w-5" /><span className="text-xs font-semibold uppercase tracking-[0.2em]">AI Tech News</span><Badge variant="outline" className="text-[10px]">Daily refresh</Badge></div><h2 className="mt-2 text-3xl font-semibold tracking-tight">What’s changing in AI right now</h2><p className="mt-2 max-w-3xl text-sm text-muted-foreground">Curated updates focused on agents, developer tools, infrastructure, security, AI products and the business impact of the ecosystem.</p></div>
      {!compact && <div className="relative w-full md:w-80"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search AI news..." className="pl-9" /></div>}
    </div>
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {visible.map(item => <Card key={item.id} className="group overflow-hidden transition hover:-translate-y-1 hover:shadow-lg"><div className="relative aspect-[16/9] overflow-hidden bg-muted"><img src={item.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" /></div><CardContent className="space-y-3 p-5"><div className="flex items-center justify-between gap-2"><Badge variant="secondary">{item.category}</Badge><span className="text-xs text-muted-foreground">{item.published}</span></div><h3 className="font-semibold leading-6">{item.title}</h3><p className="text-sm leading-6 text-muted-foreground">{item.summary}</p><div className="flex items-center justify-between pt-1 text-xs text-muted-foreground"><span>{item.source}</span><a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">Read <ExternalLink className="h-3 w-3" /></a></div></CardContent></Card>)}
    </div>
    {!visible.length && <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">No news matches that search.</div>}
  </section>;
}
