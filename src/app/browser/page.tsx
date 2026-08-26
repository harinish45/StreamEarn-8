'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ExternalLink, Globe2, History, ListChecks, LockKeyhole, Plus, Search, ShieldCheck, Sparkles, Trash2, WandSparkles } from 'lucide-react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { UnifiedSidebar } from '@/components/unified-sidebar';
import { Header } from '@/components/header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { localGet, localSet } from '@/lib/local-store';

const shortcuts = [
  { name: 'Deep Research', desc: 'Open the same research question across independent search sources.', query: 'latest AI technology news 2026', icon: Sparkles },
  { name: 'Coding Research', desc: 'Research current coding-agent workflows, developer tooling and practices.', query: 'AI coding agents developer workflow 2026', icon: WandSparkles },
  { name: 'Security Research', desc: 'Research AI security, browser-agent risks and defensive techniques.', query: 'AI browser agent security 2026', icon: ShieldCheck },
  { name: 'AI Tools', desc: 'Open the StreamEarn AI directory inside this application.', href: '/ai-tools', icon: Globe2 },
  { name: 'AI News', desc: 'Read current AI technology updates.', href: '/news', icon: History },
  { name: 'Resource Hub', desc: 'Open the combined learning and resource library.', href: '/hub', icon: ListChecks },
];

type Session = { id: string; query: string; createdAt: number; opened: string[] };

type Task = { id: string; text: string; status: 'ready' | 'opened' };

const searchTargets = (query: string) => [
  `https://www.google.com/search?q=${encodeURIComponent(query)}`,
  `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
  `https://search.brave.com/search?q=${encodeURIComponent(query)}`,
];

export default function BrowserPage() {
  const [query, setQuery] = useState('');
  const [address, setAddress] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [history, setHistory] = useState<Session[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      localGet<Session[]>('browser.sessions', []),
      localGet<Task[]>('browser.tasks', []),
    ]).then(([sessions, savedTasks]) => {
      if (!active) return;
      setHistory(sessions);
      setTasks(savedTasks);
      setLoaded(true);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => { if (loaded) void localSet('browser.sessions', history); }, [history, loaded]);
  useEffect(() => { if (loaded) void localSet('browser.tasks', tasks); }, [tasks, loaded]);

  const filtered = useMemo(() => shortcuts.filter(x => `${x.name} ${x.desc}`.toLowerCase().includes(query.toLowerCase())), [query]);

  const openTarget = (target: string) => {
    window.open(target, '_blank', 'noopener,noreferrer');
  };

  const openWeb = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const target = /^https?:\/\//i.test(trimmed) ? trimmed : `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
    const session: Session = { id: crypto.randomUUID(), query: trimmed, createdAt: Date.now(), opened: [target] };
    setHistory(h => [session, ...h.filter(x => x.query !== trimmed)].slice(0, 20));
    openTarget(target);
  };

  const startResearch = (seed: string) => {
    const targets = searchTargets(seed);
    const session: Session = { id: crypto.randomUUID(), query: seed, createdAt: Date.now(), opened: targets };
    setHistory(h => [session, ...h.filter(x => x.query !== seed)].slice(0, 20));
    setTasks(t => [{ id: crypto.randomUUID(), text: seed, status: 'opened' }, ...t].slice(0, 20));
    // This performs real browser handoff. It does not claim that StreamEarn controlled or scraped the external sites.
    targets.forEach((target, index) => window.setTimeout(() => openTarget(target), index * 150));
  };

  const addTask = () => {
    const text = window.prompt('Describe the browser research task:');
    if (!text?.trim()) return;
    setTasks(t => [{ id: crypto.randomUUID(), text: text.trim(), status: 'ready' }, ...t].slice(0, 20));
  };

  const runTask = (task: Task) => startResearch(task.text);

  return <SidebarProvider><UnifiedSidebar/><SidebarInset><Header showSidebarTrigger/><main className="min-h-[calc(100vh-4rem)] bg-background p-4 md:p-8"><div className="mx-auto max-w-7xl">
    <section className="rounded-3xl border bg-gradient-to-br from-blue-500/10 via-card to-card p-6 shadow-sm md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-medium text-primary"><Globe2 className="h-5 w-5"/> AI Browser Workspace</div><div className="flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1.5 text-xs"><LockKeyhole className="h-3.5 w-3.5"/> Local-first</div></div>
      <h1 className="mt-3 text-3xl font-bold md:text-5xl">A real browser handoff workspace.</h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">Research sessions and tasks persist on this device. StreamEarn opens real websites in your browser; it never fakes clicks, fake progress, or fake scraped results.</p>
      <div className="mt-6 flex flex-col gap-2 md:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input value={address} onChange={e=>setAddress(e.target.value)} onKeyDown={e=>e.key==='Enter'&&openWeb(address)} placeholder="Search the web or enter a URL..." className="h-11 pl-9"/></div><Button size="lg" onClick={()=>openWeb(address)}><ExternalLink className="mr-2 h-4 w-4"/> Open</Button></div>
    </section>

    <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
      <section className="rounded-2xl border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Research tasks</h2><p className="text-sm text-muted-foreground">Ready tasks are stored locally. Running one opens real search sources.</p></div><Button variant="outline" size="sm" onClick={addTask}><Plus className="mr-1 h-4 w-4"/> Task</Button></div>
        <div className="mt-4 space-y-2">{tasks.length === 0 ? <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">Create a task or use a research shortcut.</div> : tasks.map(task => <div key={task.id} className="flex items-center gap-3 rounded-xl border p-3"><span className="shrink-0">{task.status==='opened'?<CheckCircle2 className="h-4 w-4 text-primary"/>:<ShieldCheck className="h-4 w-4 text-muted-foreground"/>}</span><span className="flex-1 text-sm">{task.text}</span><Button size="sm" variant="outline" onClick={()=>runTask(task)}>Research</Button></div>)}</div>
        {tasks.length>0 && <div className="mt-4"><Button variant="ghost" onClick={()=>setTasks([])}><Trash2 className="mr-2 h-4 w-4"/>Clear tasks</Button></div>}
      </section>
      <section className="rounded-2xl border bg-card p-5 shadow-sm"><div className="flex items-center gap-2"><History className="h-4 w-4 text-primary"/><h2 className="font-semibold">Local research history</h2></div><div className="mt-4 space-y-2">{history.length===0?<p className="text-sm text-muted-foreground">No sessions stored yet.</p>:history.map(session=><button key={session.id} onClick={()=>session.opened.forEach(openTarget)} className="block w-full rounded-lg border p-3 text-left hover:bg-muted"><div className="truncate text-sm">{session.query}</div><div className="mt-1 text-[11px] text-muted-foreground">{session.opened.length} source(s) · {new Date(session.createdAt).toLocaleString()}</div></button>)}</div></section>
    </div>

    <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary"/> External websites stay in your browser. StreamEarn does not store your browsing history on its server.</div>
    <div className="relative mt-6"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search browser modes..." className="pl-9"/></div>
    <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filtered.map(item=>{const Icon=item.icon; return <article key={item.name} className="overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-1 hover:shadow-lg"><div className="flex h-32 items-center justify-center bg-gradient-to-br from-primary/15 via-muted to-background"><Icon className="h-10 w-10 text-primary"/></div><div className="p-5"><h2 className="font-semibold">{item.name}</h2><p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>{item.href?<Button asChild className="mt-5 w-full"><Link href={item.href}>Open in StreamEarn</Link></Button>:<Button className="mt-5 w-full" onClick={()=>startResearch(item.query!)}><Sparkles className="mr-2 h-4 w-4"/> Open research sources</Button>}</div></article>})}</div>
  </div></main></SidebarInset></SidebarProvider>;
}
