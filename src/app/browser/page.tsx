'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Globe2, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { UnifiedSidebar } from '@/components/unified-sidebar';
import { Header } from '@/components/header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const destinations = [
  { name: 'AI research', desc: 'Search current AI technology and research', url: 'https://www.google.com/search?q=latest+AI+technology+2026' },
  { name: 'AI coding', desc: 'Find current coding-agent and developer news', url: 'https://www.google.com/search?q=AI+coding+agents+2026' },
  { name: 'AI security', desc: 'Explore current AI security developments', url: 'https://www.google.com/search?q=AI+security+agents+2026' },
  { name: 'AI tools', desc: 'Browse the curated StreamEarn directory', href: '/ai-tools' },
  { name: 'AI news', desc: 'Read the latest curated technology updates', href: '/news' },
  { name: 'Resource hub', desc: 'Open the combined resource library', href: '/hub' },
];

export default function BrowserPage() {
  const [query, setQuery] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const filtered = useMemo(() => destinations.filter(x => `${x.name} ${x.desc}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const openUrl = (value: string) => {
    const target = /^https?:\/\//i.test(value) ? value : `https://www.google.com/search?q=${encodeURIComponent(value)}`;
    window.open(target, '_blank', 'noopener,noreferrer');
  };
  return <SidebarProvider><UnifiedSidebar/><SidebarInset><Header showSidebarTrigger/><main className="min-h-[calc(100vh-4rem)] bg-background p-4 md:p-8"><div className="mx-auto max-w-7xl">
    <section className="rounded-3xl border bg-gradient-to-br from-blue-500/10 via-card to-card p-6 md:p-10"><div className="flex items-center gap-2 text-sm font-medium text-primary"><Globe2 className="h-5 w-5"/> AI Browser</div><h1 className="mt-3 text-3xl font-bold md:text-5xl">Research without the broken iframe.</h1><p className="mt-3 max-w-2xl text-muted-foreground">Use StreamEarn as a reliable launchpad for AI research. External sites open safely in a new tab instead of failing because of frame restrictions.</p><div className="mt-6 flex flex-col gap-2 md:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input value={customUrl} onChange={e=>setCustomUrl(e.target.value)} onKeyDown={e=>e.key==='Enter'&&customUrl.trim()&&openUrl(customUrl.trim())} placeholder="Search the web or enter a URL..." className="pl-9"/></div><Button onClick={()=>customUrl.trim()&&openUrl(customUrl.trim())}>Open</Button></div></section>
    <div className="mt-6 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary"/><span className="text-sm text-muted-foreground">Safe external navigation · no unreliable embedded pages</span></div>
    <div className="relative mt-6"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Filter browser shortcuts..." className="pl-9"/></div>
    <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filtered.map(item=><article key={item.name} className="overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-1 hover:shadow-lg"><div className="flex h-32 items-center justify-center bg-gradient-to-br from-blue-500/15 via-muted to-background"><Sparkles className="h-10 w-10 text-primary"/></div><div className="p-5"><h2 className="font-semibold">{item.name}</h2><p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>{item.href?<Button asChild className="mt-5 w-full"><Link href={item.href}>Open in StreamEarn</Link></Button>:<Button className="mt-5 w-full" onClick={()=>openUrl(item.url!)}>Open externally <ExternalLink className="ml-2 h-4 w-4"/></Button>}</div></article>)}</div>
  </div></main></SidebarInset></SidebarProvider>;
}
