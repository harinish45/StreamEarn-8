'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Newspaper, Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { currentAIDirectory, currentAIToolCount, type CurrentAICategory, type CurrentAITool } from '@/lib/current-ai-directory';

const categoryImages = [
  'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
];

function imageFor(index: number) { return categoryImages[index % categoryImages.length]; }

function ToolCard({ tool }: { tool: CurrentAITool }) {
  return <a href={tool.url} target="_blank" rel="noreferrer" className="group rounded-xl border bg-background p-4 transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><h3 className="font-semibold group-hover:text-primary">{tool.name}</h3>{tool.featured && <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Top</span>}</div><p className="mt-1 text-xs leading-5 text-muted-foreground">{tool.summary}</p></div><ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" /></div><div className="mt-3 flex flex-wrap gap-1.5">{tool.tags.slice(0, 4).map(tag => <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>)}</div></a>;
}

export function EnhancedAiToolsContent() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('all');
  const normalized = query.trim().toLowerCase();
  const categories = useMemo(() => currentAIDirectory.filter(c => active === 'all' || c.id === active).map(c => ({ ...c, tools: c.tools.filter(t => !normalized || [t.name, t.summary, ...t.tags, c.name].join(' ').toLowerCase().includes(normalized)) })).filter(c => c.tools.length), [active, normalized]);

  return <div className="min-h-[calc(100vh-4rem)] bg-background"><div className="mx-auto grid max-w-[1600px] lg:grid-cols-[285px_1fr]">
    <aside className="hidden border-r bg-card/40 lg:block"><div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto p-4"><div className="mb-4 flex items-center gap-2 px-2 font-semibold"><Sparkles className="h-4 w-4 text-primary" />AI Landscape</div><div className="space-y-1"><button onClick={() => setActive('all')} className={`w-full rounded-lg px-3 py-2 text-left text-sm ${active === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>All categories</button>{currentAIDirectory.map(c => <button key={c.id} onClick={() => setActive(c.id)} className={`w-full rounded-lg px-3 py-2 text-left text-sm ${active === c.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>{c.name}</button>)}</div><div className="mt-6 rounded-xl border bg-background p-4"><div className="flex items-center gap-2 text-sm font-semibold"><Newspaper className="h-4 w-4" /> AI Tech News</div><p className="mt-2 text-xs leading-5 text-muted-foreground">Current launches, agent trends, security and developer updates.</p><Button asChild size="sm" variant="outline" className="mt-3 w-full"><Link href="/news">Open News</Link></Button></div></div></aside>
    <main className="min-w-0 px-4 py-7 md:px-8 md:py-10"><div className="mx-auto max-w-6xl space-y-8">
      <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden"><Button size="sm" onClick={() => setActive('all')} variant={active === 'all' ? 'default' : 'outline'}>All</Button>{currentAIDirectory.map(c => <Button key={c.id} size="sm" onClick={() => setActive(c.id)} variant={active === c.id ? 'default' : 'outline'} className="shrink-0">{c.name}</Button>)}</div>
      <section className="relative overflow-hidden rounded-3xl border bg-card p-7 md:p-10"><img src={imageFor(0)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-15" /><div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30" /><div className="relative space-y-5"><div className="flex flex-wrap gap-2"><Badge>2026 Directory</Badge><Badge variant="secondary">{currentAIDirectory.length} categories</Badge><Badge variant="secondary">{currentAIToolCount}+ tools</Badge></div><h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">AI tools organised around real workflows.</h1><p className="max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">A visual, searchable map of assistants, agents, coding, browser automation, research, creative production, business, security and infrastructure.</p><div className="relative max-w-2xl"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tools, categories or use cases..." className="h-13 rounded-full bg-background/90 pl-12" /></div></div></section>
      <div className="space-y-12">{categories.map((category, index) => <CategorySection key={category.id} category={category} index={index} />)}</div>
      {!categories.length && <div className="rounded-2xl border border-dashed p-14 text-center text-muted-foreground">No tools matched your search.</div>}
    </div></main>
  </div></div>;
}

function CategorySection({ category, index }: { category: CurrentAICategory; index: number }) {
  return <section id={category.id} className="overflow-hidden rounded-2xl border bg-card"><div className="relative h-44 overflow-hidden"><img src={imageFor(index + 1)} alt="" className="h-full w-full object-cover" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" /><div className="absolute bottom-4 left-5 right-5"><h2 className="text-2xl font-semibold">{category.name}</h2><p className="mt-1 max-w-3xl text-sm text-muted-foreground">{category.description}</p></div></div><div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">{category.tools.map(tool => <ToolCard key={tool.name} tool={tool} />)}</div></section>;
}
