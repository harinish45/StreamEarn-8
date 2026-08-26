'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Newspaper, Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { currentAIDirectory, currentAIToolCount, type CurrentAICategory, type CurrentAITool } from '@/lib/current-ai-directory';

const images = [
  'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80',
];

const imageFor = (seed: string | number) => {
  const text = String(seed);
  const hash = [...text].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return images[hash % images.length];
};

function ToolCard({ tool }: { tool: CurrentAITool }) {
  return <article className="group overflow-hidden rounded-2xl border bg-background transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
    <div className="relative aspect-[16/8] overflow-hidden bg-muted"><img src={imageFor(tool.name)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" /><div className="absolute bottom-3 left-3 flex gap-1.5">{tool.featured && <Badge>Featured</Badge>}<Badge variant="secondary" className="bg-background/85">AI Tool</Badge></div></div>
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
    <section className="relative overflow-hidden rounded-3xl border bg-card p-7 md:p-10"><img src={imageFor('AI Landscape')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-15" /><div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30" /><div className="relative space-y-5"><div className="flex flex-wrap gap-2"><Badge><Sparkles className="mr-1 h-3.5 w-3.5" />2026 Directory</Badge><Badge variant="secondary">{currentAIDirectory.length} categories</Badge><Badge variant="secondary">{currentAIToolCount}+ tools</Badge></div><div><h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">The AI tools command center.</h1><p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">Discover, compare and open tools by workflow — assistants, agents, coding, research, browser automation, creative, business, security and infrastructure.</p></div><div className="relative max-w-2xl"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tools, categories or use cases..." className="h-12 rounded-full bg-background/90 pl-12" /></div></div></section>
    <div className="flex items-center justify-between text-sm text-muted-foreground"><span>{categories.reduce((n, c) => n + c.tools.length, 0)} tools shown</span><Link href="/news" className="inline-flex items-center gap-2 text-primary hover:underline"><Newspaper className="h-4 w-4" />Latest AI Tech News</Link></div>
    <div className="space-y-10">{categories.map((category, index) => <CategorySection key={category.id} category={category} index={index} />)}</div>
    {!categories.length && <div className="rounded-2xl border border-dashed p-14 text-center text-muted-foreground">No tools matched your search.</div>}
  </div></main></div>;
}

function CategorySection({ category, index }: { category: CurrentAICategory; index: number }) {
  return <section id={category.id} className="overflow-hidden rounded-2xl border bg-card"><div className="relative h-40 overflow-hidden"><img src={imageFor(`${category.id}-${index}`)} alt="" className="h-full w-full object-cover" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" /><div className="absolute bottom-4 left-5 right-5 text-white"><h2 className="text-2xl font-semibold">{category.name}</h2><p className="mt-1 max-w-3xl text-sm text-white/80">{category.description}</p></div></div><div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">{category.tools.map(tool => <ToolCard key={tool.name} tool={tool} />)}</div></section>;
}
