'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Grid2X2, List, Newspaper, Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { currentAIDirectory, type CurrentAICategory, type CurrentAITool } from '@/lib/current-ai-directory';
import { currentAIAdditions } from '@/lib/current-ai-additions';

const allDirectory = [...currentAIDirectory, ...currentAIAdditions];
const imageFor = (kind: string, id: string | number) => `https://picsum.photos/seed/streamearn-${encodeURIComponent(`${kind}-${id}`)}/1200/700`;
const logoFor = (url: string) => { try { return `${new URL(url).origin}/favicon.ico`; } catch { return ''; } };

function ToolCard({ tool, index, list }: { tool: CurrentAITool; index: number; list: boolean }) {
  const logo = logoFor(tool.url);
  return <article className={`group overflow-hidden rounded-2xl border bg-background transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg ${list ? 'flex' : ''}`}>
    <div className={`relative overflow-hidden bg-muted ${list ? 'w-40 shrink-0' : 'aspect-[16/8]'}`}><img src={imageFor('tool', `${tool.name}-${index}`)} alt="" className="h-full w-full object-cover" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />{tool.featured && <Badge className="absolute bottom-3 left-3">Featured</Badge>}</div>
    <div className="min-w-0 flex-1 p-4"><div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-card p-1.5"><img src={logo} alt="" className="h-full w-full object-contain" onError={e => { e.currentTarget.style.display='none'; }} /></div><div className="min-w-0 flex-1"><h3 className="font-semibold group-hover:text-primary">{tool.name}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{tool.summary}</p></div><ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" /></div><div className="mt-3 flex flex-wrap gap-1.5">{tool.tags.slice(0, 4).map(tag => <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>)}</div><a href={tool.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-primary hover:text-primary-foreground">Open official site <ExternalLink className="h-3.5 w-3.5" /></a></div>
  </article>;
}

export function EnhancedAiToolsContent() {
  const [query, setQuery] = useState(''); const [active, setActive] = useState('all'); const [view, setView] = useState<'grid'|'list'>('grid');
  const normalized = query.trim().toLowerCase();
  const categories = useMemo(() => allDirectory.filter(c => active === 'all' || c.id === active).map(c => ({ ...c, tools: c.tools.filter(t => !normalized || [t.name, t.summary, ...t.tags, c.name].join(' ').toLowerCase().includes(normalized)) })).filter(c => c.tools.length), [active, normalized]);
  const count = allDirectory.reduce((n,c)=>n+c.tools.length,0);
  return <div className="min-h-[calc(100vh-4rem)] bg-background"><main className="mx-auto w-full max-w-[1500px] px-4 py-7 md:px-8 md:py-10"><div className="space-y-8">
    <div className="flex gap-2 overflow-x-auto pb-1"><Button size="sm" onClick={() => setActive('all')} variant={active === 'all' ? 'default' : 'outline'} className="shrink-0">All</Button>{allDirectory.map(c => <Button key={c.id} size="sm" onClick={() => setActive(c.id)} variant={active === c.id ? 'default' : 'outline'} className="shrink-0">{c.name}</Button>)}</div>
    <section className="relative overflow-hidden rounded-3xl border bg-card p-7 md:p-10"><img src={imageFor('ai-landscape', '2026-command-center')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-15" /><div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30" /><div className="relative space-y-5"><div className="flex flex-wrap gap-2"><Badge><Sparkles className="mr-1 h-3.5 w-3.5" />Updated daily</Badge><Badge variant="secondary">{allDirectory.length} categories</Badge><Badge variant="secondary">{count}+ tools & resources</Badge></div><div><h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">The AI intelligence command center.</h1><p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">Current AI products, advanced agent workflows, research, coding, creative production, security and official learning — organised by what you actually want to do.</p></div><div className="relative max-w-2xl"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tools, categories or use cases..." className="h-12 rounded-full bg-background/90 pl-12" /></div></div></section>
    <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground"><span>{categories.reduce((n,c) => n+c.tools.length,0)} shown</span><div className="flex gap-1 rounded-lg border bg-card p-1"><Button size="sm" variant={view==='grid'?'default':'ghost'} onClick={()=>setView('grid')} aria-label="Grid view"><Grid2X2 className="h-4 w-4" /></Button><Button size="sm" variant={view==='list'?'default':'ghost'} onClick={()=>setView('list')} aria-label="List view"><List className="h-4 w-4" /></Button></div><Link href="/news" className="hidden items-center gap-2 text-primary hover:underline md:inline-flex"><Newspaper className="h-4 w-4" />Latest AI Tech News</Link></div>
    <div className="space-y-10">{categories.map((category, categoryIndex) => <CategorySection key={category.id} category={category} index={categoryIndex} list={view==='list'} />)}</div>
    {!categories.length && <div className="rounded-2xl border border-dashed p-14 text-center text-muted-foreground">No tools matched your search.</div>}
  </div></main></div>;
}

function CategorySection({ category, index, list }: { category: CurrentAICategory; index: number; list: boolean }) {
  return <section id={category.id} className="overflow-hidden rounded-2xl border bg-card"><div className="relative h-40 overflow-hidden"><img src={imageFor('category', category.id)} alt="" className="h-full w-full object-cover" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" /><div className="absolute bottom-4 left-5 right-5 text-white"><h2 className="text-2xl font-semibold">{category.name}</h2><p className="mt-1 max-w-3xl text-sm text-white/80">{category.description}</p></div></div><div className={list ? 'space-y-3 p-4' : 'grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3'}>{category.tools.map((tool, toolIndex) => <ToolCard key={tool.name} tool={tool} index={index * 1000 + toolIndex} list={list} />)}</div></section>;
}
