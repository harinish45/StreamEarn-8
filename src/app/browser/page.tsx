'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ExternalLink, Globe2, History, ListChecks, LockKeyhole, Play, Plus, Search, ShieldCheck, Sparkles, Square, Trash2, WandSparkles } from 'lucide-react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { UnifiedSidebar } from '@/components/unified-sidebar';
import { Header } from '@/components/header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const shortcuts = [
  { name: 'Comet-style Research', desc: 'Turn a question into a structured multi-source research session.', query: 'latest AI technology news 2026', icon: Sparkles },
  { name: 'Coding Research', desc: 'Compare current coding-agent workflows, tools and developer practices.', query: 'AI coding agents developer workflow 2026', icon: WandSparkles },
  { name: 'Security Research', desc: 'Investigate AI security, browser-agent risks and defensive techniques.', query: 'AI browser agent security 2026', icon: ShieldCheck },
  { name: 'AI Tools', desc: 'Open the StreamEarn AI directory inside the same workspace.', href: '/ai-tools', icon: Globe2 },
  { name: 'AI News', desc: 'Read curated current AI technology updates.', href: '/news', icon: History },
  { name: 'Resource Hub', desc: 'Open the combined learning and resource library.', href: '/hub', icon: ListChecks },
];

type Task = { id: number; text: string; status: 'queued' | 'running' | 'done' };

export default function BrowserPage() {
  const [query, setQuery] = useState('');
  const [address, setAddress] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  const filtered = useMemo(() => shortcuts.filter(x => `${x.name} ${x.desc}`.toLowerCase().includes(query.toLowerCase())), [query]);

  const openWeb = (value: string) => {
    const target = /^https?:\/\//i.test(value) ? value : `https://www.google.com/search?q=${encodeURIComponent(value)}`;
    setHistory(h => [target, ...h.filter(x => x !== target)].slice(0, 8));
    window.open(target, '_blank', 'noopener,noreferrer');
  };

  const startResearch = (seed: string) => {
    const steps: Task[] = [
      { id: 1, text: `Understand: ${seed}`, status: 'running' },
      { id: 2, text: 'Search multiple sources', status: 'queued' },
      { id: 3, text: 'Compare findings', status: 'queued' },
      { id: 4, text: 'Build a concise research brief', status: 'queued' },
    ];
    setTasks(steps);
    setRunning(true);
    // This browser workspace intentionally launches real web research rather than pretending an iframe can control arbitrary sites.
    openWeb(seed);
    window.setTimeout(() => setTasks(s => s.map((t, i) => ({ ...t, status: i < 2 ? 'done' : i === 2 ? 'running' : 'queued' }))), 900);
    window.setTimeout(() => { setTasks(s => s.map(t => ({ ...t, status: 'done' }))); setRunning(false); }, 1800);
  };

  const addTask = () => {
    const text = window.prompt('Describe the browser task you want to research:');
    if (!text?.trim()) return;
    setTasks(t => [...t, { id: Date.now(), text: text.trim(), status: 'queued' }]);
  };

  return <SidebarProvider><UnifiedSidebar/><SidebarInset><Header showSidebarTrigger/><main className="min-h-[calc(100vh-4rem)] bg-background p-4 md:p-8"><div className="mx-auto max-w-7xl">
    <section className="rounded-3xl border bg-gradient-to-br from-blue-500/10 via-card to-card p-6 shadow-sm md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-medium text-primary"><Globe2 className="h-5 w-5"/> AI Browser Workspace</div><div className="flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1.5 text-xs"><LockKeyhole className="h-3.5 w-3.5"/> Permission-first</div></div>
      <h1 className="mt-3 text-3xl font-bold md:text-5xl">Research, plan and execute from one browser workspace.</h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">Built around the useful ideas behind modern agentic browsers and work agents: task plans, persistent history, research shortcuts, human approval and real external browser handoff.</p>
      <div className="mt-6 flex flex-col gap-2 md:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input value={address} onChange={e=>setAddress(e.target.value)} onKeyDown={e=>e.key==='Enter'&&address.trim()&&openWeb(address.trim())} placeholder="Search the web or enter a URL..." className="h-11 pl-9"/></div><Button size="lg" onClick={()=>address.trim()&&openWeb(address.trim())}><ExternalLink className="mr-2 h-4 w-4"/> Open</Button></div>
    </section>

    <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
      <section className="rounded-2xl border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Agent task board</h2><p className="text-sm text-muted-foreground">Break a goal into visible steps instead of using a fake embedded browser.</p></div><Button variant="outline" size="sm" onClick={addTask}><Plus className="mr-1 h-4 w-4"/> Task</Button></div>
        <div className="mt-4 space-y-2">{tasks.length === 0 ? <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">Start a research shortcut or add a task.</div> : tasks.map(task => <div key={task.id} className="flex items-center gap-3 rounded-xl border p-3"><span className="shrink-0">{task.status==='done'?<CheckCircle2 className="h-4 w-4 text-green-600"/>:task.status==='running'?<Play className="h-4 w-4 animate-pulse text-primary"/>:<Square className="h-4 w-4 text-muted-foreground"/>}</span><span className="flex-1 text-sm">{task.text}</span><span className="text-[10px] uppercase tracking-wider text-muted-foreground">{task.status}</span></div>)}</div>
        {tasks.length>0 && <div className="mt-4 flex gap-2"><Button onClick={()=>tasks[0]&&startResearch(tasks[0].text)} disabled={running}><Play className="mr-2 h-4 w-4"/>{running?'Working…':'Run research'}</Button><Button variant="ghost" onClick={()=>setTasks([])}><Trash2 className="mr-2 h-4 w-4"/>Clear</Button></div>}
      </section>
      <section className="rounded-2xl border bg-card p-5 shadow-sm"><div className="flex items-center gap-2"><History className="h-4 w-4 text-primary"/><h2 className="font-semibold">Recent web sessions</h2></div><div className="mt-4 space-y-2">{history.length===0?<p className="text-sm text-muted-foreground">Your recent research destinations will appear here.</p>:history.map(url=><button key={url} onClick={()=>openWeb(url)} className="block w-full truncate rounded-lg border p-2 text-left text-xs hover:bg-muted">{url}</button>)}</div></section>
    </div>

    <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary"/> Sensitive actions stay under your control. External sites open in your own browser session.</div>
    <div className="relative mt-6"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search browser modes..." className="pl-9"/></div>
    <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filtered.map(item=>{const Icon=item.icon; return <article key={item.name} className="overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-1 hover:shadow-lg"><div className="flex h-32 items-center justify-center bg-gradient-to-br from-primary/15 via-muted to-background"><Icon className="h-10 w-10 text-primary"/></div><div className="p-5"><h2 className="font-semibold">{item.name}</h2><p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>{item.href?<Button asChild className="mt-5 w-full"><Link href={item.href}>Open in StreamEarn</Link></Button>:<Button className="mt-5 w-full" onClick={()=>startResearch(item.query!)}><Sparkles className="mr-2 h-4 w-4"/> Start task</Button>}</div></article>})}</div>
  </div></main></SidebarInset></SidebarProvider>;
}
