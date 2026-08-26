'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Newspaper, Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { currentAIDirectory, currentAIToolCount, type CurrentAICategory, type CurrentAITool } from '@/lib/current-ai-directory';

// Every card receives a stable, unique seed. This prevents image reuse while keeping
// the visual set deterministic between builds and refreshes.
const imageFor = (kind: string, id: string | number) =>
  `https://picsum.photos/seed/streamearn-${encodeURIComponent(`${kind}-${id}`)}/1200/700`;

function ToolCard({ tool, index }: { tool: CurrentAITool; index: number }) {
  return <article className="group overflow-hidden rounded-2xl border bg-background transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
    <div className="relative aspect-[16/8] overflow-hidden bg-muted"><img src={imageFor('tool', `${tool.name}-${index}`)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" /><div className="absolute bottom-3 left-3 flex gap-1.5">{tool.featured && <Badge>Featured</Badge>}<Badge variant="secondary" className="bg-background/85">AI Tool</Badge></div></div>
    <div className="p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold group-hover:text-primary">{tool.name}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{tool.summary}</p></div><ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" /></div><div className="mt-3 flex flex-wrap gap-1.5">{tool.tags.slice(0, 4).map(tag => <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>)}</div><a href={tool.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-primary hover:text-primary-foreground">Open official site <ExternalLink className="h-3.5 w-3.5" /></a></div>
  </article>;
}

export function EnhancedAiToolsContent() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('all');
  const normalized = query.trim().toLowerCase();
  const categories = useMemo(() => currentAIDirectory.filter(c => active === 'all' || c.id === active).map(c => ({ ...c, tools: c.tools.filter(t => !normalized || [t.name, t.summary, ...t.tags, c.name].join(' ').toLowerCase().includes(normalized)) })).filter(c => c.tools.length), [active, normalized]);

  return <div className="min-h-[calc(100vh-4rem)] bg-background"><main className="mx-auto w-full max-w-[1500px] px-4 py-7 md:px-8 md:py-10"><div className="space-y-8">
    <div className="flex gap-2 overflow-x-auto pb-1"><Button size="sm" onClick={() => setActive('all')} variant={active === 'all' ? 'default' : 'outline'} className="shrink-0">All</Button>{currentAIDirectory.map(c => <Button key={c.id} size="sm" onClick={() => setActive(c.id)} variant={active === c.id ? 'default' : 'outline'} className="shrink-0">{c.name}</Button>)}</div>
    <section className="relative overflow-hidden rounded-3xl border bg-card p-7 md:p-10"><img src={imageFor('ai-landscape', 'hero')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-15" /><div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30" /><div className="relative space-y-5"><div className="flex flex-wrap gap-2"><Badge><Sparkles className="mr-1 h-3.5 w-3.5" />2026 Directory</Badge><Badge variant="secondary">{currentAIDirectory.length} categories</Badge><Badge variant="secondary">{currentAIToolCount}+ tools</Badge></div><div><h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">The AI tools command center.</h1><p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">Discover, compare and open tools by workflow — assistants, agents, coding, research, creative, business, security and infrastructure.</p></div><div className="relative max-w-2xl"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tools, categories or use cases..." className="h-12 rounded-full bg-background/90 pl-12" /></div></div></section>
    <div className="flex items-center justify-between text-sm text-muted-foreground"><span>{categories.reduce((n, c) => n + c.tools.length, 0)} tools shown</span><Link href="/news" className="inline-flex items-center gap-2 text-primary hover:underline"><Newspaper className="h-4 w-4" />Latest AI Tech News</Link></div>
    <div className="space-y-10">{categories.map((category, categoryIndex) => <CategorySection key={category.id} category={category} index={categoryIndex} />)}</div>
    {!categories.length && <div className="rounded-2xl border border-dashed p-14 text-center text-muted-foreground">No tools matched your search.</div>}
  </div></main></div>;
}

function CategorySection({ category, index }: { category: CurrentAICategory; index: number }) {
  return <section id={category.id} className="overflow-hidden rounded-2xl border bg-card"><div className="relative h-40 overflow-hidden"><img src={imageFor('category', category.id)} alt="" className="h-full w-full object-cover" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" /><div className="absolute bottom-4 left-5 right-5 text-white"><h2 className="text-2xl font-semibold">{category.name}</h2><p className="mt-1 max-w-3xl text-sm text-white/80">{category.description}</p></div></div><div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">{category.tools.map((tool, toolIndex) => <ToolCard key={tool.name} tool={tool} index={index * 1000 + toolIndex} />)}</div></section>;
}
