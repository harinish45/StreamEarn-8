'use client';

import { useMemo, useState } from 'react';
import { BriefcaseBusiness, CheckCircle2, ExternalLink, Search, Sparkles, TrendingUp, Users } from 'lucide-react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { UnifiedSidebar } from '@/components/unified-sidebar';
import { Header } from '@/components/header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const imageFor=(id:string)=>`https://picsum.photos/seed/streamearn-aiwork-${encodeURIComponent(id)}/1000/600`;
const opportunities = [
  { title: 'AI Automation Services', desc: 'Build practical automations for businesses using modern AI workflows.', tags: ['Automation','Business'], href: 'https://www.upwork.com/' },
  { title: 'AI Content Systems', desc: 'Create repeatable content research, drafting and repurposing systems.', tags: ['Content','Creator'], href: 'https://www.fiverr.com/' },
  { title: 'AI Research Assistant', desc: 'Research markets, competitors, products and technical topics with AI-assisted workflows.', tags: ['Research','Analysis'], href: 'https://www.upwork.com/' },
  { title: 'AI App Prototyping', desc: 'Turn ideas into polished web prototypes and internal tools quickly.', tags: ['Development','Apps'], href: 'https://vercel.com/' },
  { title: 'AI Data Workflows', desc: 'Clean, classify, transform and analyse business data with AI-assisted pipelines.', tags: ['Data','Operations'], href: 'https://www.upwork.com/' },
  { title: 'AI Marketing Operations', desc: 'Build campaign research, SEO, outreach and reporting workflows.', tags: ['Marketing','GTM'], href: 'https://www.fiverr.com/' },
];

export default function AIWorkPage() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => opportunities.filter(x => `${x.title} ${x.desc} ${x.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <SidebarProvider><UnifiedSidebar /><SidebarInset><Header showSidebarTrigger /><main className="min-h-[calc(100vh-4rem)] bg-background p-4 md:p-8"><div className="mx-auto max-w-7xl">
    <section className="relative overflow-hidden rounded-3xl border bg-card p-6 md:p-10"><img src={imageFor('hero')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-15" /><div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30" /><div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between"><div><div className="flex items-center gap-2 text-sm font-medium text-primary"><BriefcaseBusiness className="h-4 w-4"/> AI Work Hub</div><h1 className="mt-3 text-3xl font-bold md:text-5xl">Find work you can actually build.</h1><p className="mt-3 max-w-2xl text-muted-foreground">Practical AI-powered service ideas, workflows and earning paths organised in one place.</p></div><div className="w-full md:w-80"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search AI work..." className="pl-9"/></div></div></div></section>
    <div className="mt-6 grid gap-4 md:grid-cols-3"><div className="rounded-2xl border bg-card p-5"><TrendingUp className="h-5 w-5 text-primary"/><p className="mt-3 text-2xl font-bold">{opportunities.length}</p><p className="text-sm text-muted-foreground">ready-to-explore paths</p></div><div className="rounded-2xl border bg-card p-5"><Users className="h-5 w-5 text-primary"/><p className="mt-3 text-2xl font-bold">3</p><p className="text-sm text-muted-foreground">client acquisition channels</p></div><div className="rounded-2xl border bg-card p-5"><CheckCircle2 className="h-5 w-5 text-primary"/><p className="mt-3 text-2xl font-bold">100%</p><p className="text-sm text-muted-foreground">actionable workflows</p></div></div>
    <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filtered.map(item=><article key={item.title} className="group overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-1 hover:shadow-lg"><div className="relative h-36 overflow-hidden"><img src={imageFor(item.title)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy"/><div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent"/><Sparkles className="absolute bottom-4 left-4 h-7 w-7 text-white"/></div><div className="p-5"><h2 className="font-semibold">{item.title}</h2><p className="mt-2 text-sm text-muted-foreground">{item.desc}</p><div className="mt-4 flex flex-wrap gap-2">{item.tags.map(t=><span key={t} className="rounded-full bg-muted px-2.5 py-1 text-xs">{t}</span>)}</div><Button asChild className="mt-5 w-full"><a href={item.href} target="_blank" rel="noreferrer">Explore opportunity <ExternalLink className="ml-2 h-4 w-4"/></a></Button></div></article>)}</div>
  </div></main></SidebarInset></SidebarProvider>;
}
