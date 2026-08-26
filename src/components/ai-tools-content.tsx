'use client';

import { useMemo, useState } from 'react';
import { ExternalLink, Search, Sparkles, Star, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { currentAIDirectory, currentAIToolCount, type CurrentAICategory, type CurrentAITool } from '@/lib/current-ai-directory';

function ToolCard({ tool }: { tool: CurrentAITool }) {
  return (
    <a href={tool.url} target="_blank" rel="noreferrer" className="group block rounded-2xl border bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2"><h3 className="font-semibold">{tool.name}</h3>{tool.featured && <Star className="h-3.5 w-3.5 fill-current text-primary" />}</div>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{tool.summary}</p>
        </div>
        <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">{tool.tags.slice(0, 4).map(tag => <Badge variant="secondary" key={tag}>{tag}</Badge>)}</div>
    </a>
  );
}

function CategorySection({ category }: { category: CurrentAICategory }) {
  return <section id={category.id} className="scroll-mt-24 space-y-4"><div><h2 className="text-2xl font-semibold tracking-tight">{category.name}</h2><p className="mt-1 max-w-3xl text-sm text-muted-foreground">{category.description}</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{category.tools.map(tool => <ToolCard key={tool.name} tool={tool} />)}</div></section>;
}

export function AiToolsContent() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const categories = useMemo(() => {
    const q = query.trim().toLowerCase();
    return currentAIDirectory.filter(c => activeCategory === 'all' || c.id === activeCategory).map(c => ({...c, tools: c.tools.filter(t => !q || [t.name,t.summary,...t.tags,c.name].join(' ').toLowerCase().includes(q))})).filter(c => c.tools.length);
  }, [query, activeCategory]);
  const featured = useMemo(() => currentAIDirectory.flatMap(c => c.tools.filter(t => t.featured)), []);

  return <div className="min-h-screen bg-background"><div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
    <header className="space-y-5"><div className="flex flex-wrap items-center gap-2"><Badge variant="outline"><Sparkles className="mr-1 h-3.5 w-3.5" /> 2026 Directory</Badge><Badge variant="secondary">{currentAIDirectory.length} categories</Badge><Badge variant="secondary">{currentAIToolCount}+ tools</Badge></div>
      <div><h1 className="text-4xl font-semibold tracking-tight md:text-5xl">AI Tools Directory</h1><p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">A refreshed category-first map of the current AI landscape: assistants, agents, coding, research, browser automation, creative production, business workflows, security and infrastructure.</p></div>
      <div className="relative max-w-2xl"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tools, categories, use cases..." className="h-12 rounded-full pl-12 pr-12" />{query && <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2" onClick={() => setQuery('')}><X className="h-4 w-4" /></Button>}</div>
      <div className="flex gap-2 overflow-x-auto pb-2"><Button size="sm" variant={activeCategory === 'all' ? 'default' : 'outline'} onClick={() => setActiveCategory('all')}>All</Button>{currentAIDirectory.map(c => <Button key={c.id} size="sm" variant={activeCategory === c.id ? 'default' : 'outline'} onClick={() => setActiveCategory(c.id)}>{c.name}</Button>)}</div>
    </header>
    {!query && activeCategory === 'all' && <section className="mt-10 space-y-4"><div><h2 className="text-2xl font-semibold">Top-level picks</h2><p className="text-sm text-muted-foreground">High-signal tools across the major AI workflows.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{featured.slice(0,16).map(t => <ToolCard key={t.name} tool={t} />)}</div></section>}
    <div className="mt-12 space-y-12">{categories.map(c => <CategorySection key={c.id} category={c} />)}</div>
    {!categories.length && <div className="py-20 text-center text-muted-foreground">No matching tools found.</div>}
  </div></div>;
}
