'use client';

import { useMemo, useState } from 'react';
import { ExternalLink, Grid2X2, List, Search, Sparkles, Star, X, Workflow, GitBranch, Database, Code2, Palette, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { currentAIDirectory, currentAIToolCount, type CurrentAICategory, type CurrentAITool } from '@/lib/current-ai-directory';
import { leadAutomationTools } from '@/lib/lead-automation-data';

type ViewMode = 'grid' | 'list';

const imageFor = (kind: string, id: string, index = 0) => `https://picsum.photos/seed/streamearn-${kind}-${encodeURIComponent(id)}-${index}/900/600`;
const logoFor = (url: string) => { try { return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`; } catch { return ''; } };

function ToolCard({ tool, index, view }: { tool: CurrentAITool; index: number; view: ViewMode }) {
  const logo = logoFor(tool.url);
  const compact = view === 'list';
  return <a href={tool.url} target="_blank" rel="noreferrer" className={`group relative block overflow-hidden rounded-xl border bg-card/90 transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg ${compact ? 'flex min-h-[78px]' : ''}`}>
    <div className={`relative overflow-hidden bg-muted ${compact ? 'w-24 shrink-0' : 'aspect-[16/6]'}`}>
      <img src={imageFor('tool', tool.name, index)} alt="" className="h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/85 to-transparent" />
    </div>
    <div className="relative p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {logo && <img src={logo} alt="" className="h-5 w-5 rounded-md bg-white object-contain p-0.5" loading="lazy" />}
            <h3 className="truncate text-sm font-semibold">{tool.name}</h3>
            {tool.featured && <Star className="h-3 w-3 shrink-0 fill-current text-primary" />}
          </div>
          <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-muted-foreground">{tool.summary}</p>
        </div>
        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      </div>
      <div className="mt-2 flex flex-wrap gap-1">{tool.tags.slice(0, 3).map(tag => <Badge variant="secondary" key={tag} className="px-1.5 py-0 text-[9px]">{tag}</Badge>)}</div>
    </div>
  </a>;
}

function CategorySection({ category, query, view }: { category: CurrentAICategory; query: string; view: ViewMode }) {
  const tools = category.tools.filter(t => !query || [t.name, t.summary, ...t.tags, category.name].join(' ').toLowerCase().includes(query));
  if (!tools.length) return null;
  return <section id={`ai-${category.id}`} className="scroll-mt-20 space-y-2.5">
    <div className="flex items-end justify-between gap-3 border-b pb-2"><div><h2 className="text-lg font-semibold tracking-tight">{category.name}</h2><p className="mt-0.5 text-[11px] text-muted-foreground">{category.description}</p></div><span className="text-[10px] text-muted-foreground">{tools.length}</span></div>
    <div className={view === 'list' ? 'space-y-2' : 'grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3'}>{tools.map((tool, i) => <ToolCard key={tool.name} tool={tool} index={i} view={view} />)}</div>
  </section>;
}

function MindMap() {
  const groups = [
    { label: 'DISCOVER', icon: Search, color: 'text-sky-300', cats: ['AI Assistants & Everyday AI','Search, Research & Knowledge Discovery','RAG, Vector Search & Knowledge Infrastructure','Advanced AI Work & Research'] },
    { label: 'BUILD', icon: Code2, color: 'text-violet-300', cats: ['AI Coding Agents & IDEs','AI App Builders & Full-Stack Creation','Agent Frameworks & SDKs','MCP, Agent Connectivity & Tool Access','Agent Engineering & Production'] },
    { label: 'AUTOMATE', icon: Workflow, color: 'text-emerald-300', cats: ['Workflow Automation & AI Orchestration','Browser & Computer-Use Agents','Lead Automation & GTM'] },
    { label: 'CREATE', icon: Palette, color: 'text-pink-300', cats: ['Image Generation, Design & Creative','AI Video, Avatars & Motion','Voice, Speech, Audio & Music','Writing, Editing & Content Operations'] },
    { label: 'OPERATE', icon: Database, color: 'text-amber-300', cats: ['Productivity, Notes & Personal Knowledge','Meetings, Transcription & Conversation Intelligence','Sales, GTM & Lead Intelligence','Customer Support & Service AI','Data Analysis, BI & Spreadsheets','Presentations, Documents & Storytelling'] },
    { label: 'TRUST', icon: ShieldCheck, color: 'text-cyan-300', cats: ['Cybersecurity, AppSec & AI Security','AI Evaluation, Observability & Quality','Local, Open & Self-Hosted AI','AI Infrastructure, Deployment & Serving'] },
  ];
  return <section className="relative overflow-hidden rounded-2xl border bg-card/40 p-3 md:p-5">
    <div className="pointer-events-none absolute inset-0 opacity-50" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl animate-pulse" />
    <div className="relative mx-auto max-w-6xl">
      <div className="mb-3 text-center"><Badge variant="outline" className="text-[9px]"><Sparkles className="mr-1 h-3 w-3" />AI ecosystem map</Badge><p className="mt-1 text-[10px] text-muted-foreground">Start at the center, follow a workflow, then jump into the tools.</p></div>
      <div className="relative grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group, i) => { const Icon = group.icon; return <div key={group.label} className="group relative rounded-xl border bg-background/75 p-3 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-primary/40">
          <div className="mb-2 flex items-center gap-2"><div className={`rounded-lg border bg-card p-1.5 ${group.color}`}><Icon className="h-3.5 w-3.5" /></div><span className="text-[10px] font-bold tracking-[0.18em]">{group.label}</span><span className="ml-auto text-[9px] text-muted-foreground">0{i + 1}</span></div>
          <div className="space-y-1">{group.cats.map(cat => <a key={cat} href={`#ai-${currentAIDirectory.find(c => c.name === cat)?.id || ''}`} className="block rounded-md px-2 py-1 text-[10px] text-muted-foreground transition hover:bg-primary/10 hover:text-foreground">{cat}</a>)}</div>
        </div>; })}
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block"><div className="rounded-full border-2 border-primary/50 bg-background px-5 py-3 text-center shadow-[0_0_50px_rgba(250,204,21,.16)]"><Sparkles className="mx-auto h-5 w-5 text-primary" /><div className="mt-1 text-[10px] font-bold tracking-[0.18em]">STREAM EARN</div><div className="text-[9px] text-muted-foreground">AI INTELLIGENCE</div></div></div>
    </div>
    <style jsx>{`@keyframes drift{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-6px,0)}}`}</style>
  </section>;
}

export function AiToolsContent() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [view, setView] = useState<ViewMode>('grid');
  const normalized = query.trim().toLowerCase();
  const allCategories = useMemo(() => [...currentAIDirectory, { id: 'lead-automation', name: 'Lead Automation & GTM', description: 'Prospecting, enrichment, intent, qualification and outbound automation.', tools: leadAutomationTools }], []);
  const categories = useMemo(() => allCategories.filter(c => activeCategory === 'all' || c.id === activeCategory), [allCategories, activeCategory]);
  const featured = useMemo(() => allCategories.flatMap(c => c.tools.filter(t => t.featured)), [allCategories]);

  return <main className="min-h-screen overflow-x-hidden bg-background"><div className="mx-auto max-w-[1500px] px-3 py-4 md:px-5 md:py-6">
    <header className="space-y-3">
      <div className="flex flex-wrap items-center gap-1.5"><Badge variant="outline" className="text-[9px]"><Sparkles className="mr-1 h-3 w-3" />2026 Directory</Badge><Badge variant="secondary" className="text-[9px]">{allCategories.length} pathways</Badge><Badge variant="secondary" className="text-[9px]">{currentAIToolCount + leadAutomationTools.length}+ tools</Badge></div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"><div><h1 className="text-3xl font-semibold tracking-tight md:text-4xl">AI Intelligence</h1><p className="mt-1 max-w-3xl text-xs leading-5 text-muted-foreground">A compact, current map of the AI ecosystem — discover, build, automate, create, operate and secure.</p></div><div className="flex items-center gap-2"><div className="relative w-full sm:w-80"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tools or use cases..." className="h-9 pl-9 pr-9 text-xs" />{query && <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 h-7 w-7" onClick={() => setQuery('')}><X className="h-3.5 w-3.5" /></Button>}</div><div className="flex rounded-md border bg-card p-0.5"><Button size="sm" variant={view === 'grid' ? 'default' : 'ghost'} onClick={() => setView('grid')} className="h-8 px-2"><Grid2X2 className="h-3.5 w-3.5" /></Button><Button size="sm" variant={view === 'list' ? 'default' : 'ghost'} onClick={() => setView('list')} className="h-8 px-2"><List className="h-3.5 w-3.5" /></Button></div></div></div>
    </header>
    {!query && activeCategory === 'all' && <div className="mt-4"><MindMap /></div>}
    <div className="mt-5 flex flex-wrap gap-1.5">{allCategories.map(c => <button key={c.id} onClick={() => setActiveCategory(c.id)} className={`rounded-full border px-2.5 py-1 text-[9px] transition ${activeCategory === c.id ? 'border-primary bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'}`}>{c.name}</button>)}</div>
    {!query && activeCategory === 'all' && <section className="mt-5 space-y-2"><div className="flex items-end justify-between"><div><h2 className="text-lg font-semibold">High-signal picks</h2><p className="text-[10px] text-muted-foreground">A quick route into the most useful workflows.</p></div><span className="text-[10px] text-muted-foreground">{featured.length} featured</span></div><div className={view === 'list' ? 'space-y-2' : 'grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4'}>{featured.slice(0, 16).map((t, i) => <ToolCard key={t.name} tool={t} index={i} view={view} />)}</div></section>}
    <div className="mt-7 space-y-8">{categories.map(c => <CategorySection key={c.id} category={c} query={normalized} view={view} />)}</div>
    {!categories.some(c => c.tools.some(t => !normalized || [t.name,t.summary,...t.tags,c.name].join(' ').toLowerCase().includes(normalized))) && <div className="py-16 text-center text-sm text-muted-foreground">No matching tools found.</div>}
  </div></main>;
}
