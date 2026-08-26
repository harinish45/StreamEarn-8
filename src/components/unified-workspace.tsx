'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Briefcase, CheckCircle2, Database, DollarSign, Globe2, LayoutDashboard, Library, ListTodo, Search, Shield, Sparkles, Users } from 'lucide-react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { UnifiedSidebar } from '@/components/unified-sidebar';
import { Header } from '@/components/header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { localGet, localSet } from '@/lib/local-store';
import { StorageManager } from '@/components/storage-manager';

const items = [
  ['AI Tools','Curated AI directory','/ai-tools',Sparkles], ['AI Browser','Research and browser workspace','/browser',Globe2], ['AI Tech News','Current AI technology updates','/news',Library], ['Resource Hub','Combined learning and resource library','/hub',Database], ['Courses','Learning and courses','/courses',BookOpen], ['AI Work','Practical AI earning paths','/ai-work',Briefcase], ['Earnings','Online earning opportunities','/earnings',DollarSign], ['Leads & GTM','Lead operations and tracking','/leads',Users], ['Directory','Resource directory','/directory',Database], ['Cybersecurity','Security labs and knowledge','/cybersecurity',Shield],
] as const;

type Task = { id: string; text: string; createdAt: number; done: boolean };

export default function UnifiedWorkspace() {
  const [q,setQ]=useState(''); const [task,setTask]=useState(''); const [tasks,setTasks]=useState<Task[]>([]); const [loaded,setLoaded]=useState(false);
  useEffect(() => { localGet<Task[]>('workspace.tasks', []).then(v => { setTasks(v); setLoaded(true); }); }, []);
  useEffect(() => { if (loaded) void localSet('workspace.tasks', tasks); }, [tasks, loaded]);
  const filtered=useMemo(()=>items.filter(([name,desc])=>`${name} ${desc}`.toLowerCase().includes(q.toLowerCase())),[q]);
  const addTask=()=>{ if(task.trim()){setTasks(v=>[{id:crypto.randomUUID(),text:task.trim(),createdAt:Date.now(),done:false},...v]);setTask('');} };
  return <SidebarProvider><UnifiedSidebar/><SidebarInset><Header showSidebarTrigger/><main className="min-h-[calc(100vh-4rem)] bg-background p-4 md:p-8"><div className="mx-auto max-w-7xl">
    <section className="rounded-3xl border bg-gradient-to-br from-primary/10 via-card to-card p-6 md:p-10"><div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div><div className="flex items-center gap-2 text-sm text-primary"><LayoutDashboard className="h-4 w-4"/> Unified Workspace</div><h1 className="mt-3 text-3xl font-bold md:text-5xl">Your local-first command center.</h1><p className="mt-3 max-w-2xl text-muted-foreground">Navigate the entire StreamEarn platform from one interface. Personal workspace data is stored locally on this device.</p></div><div className="relative w-full lg:w-96"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search everything..." className="pl-9"/></div></div></section>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(([name,desc,href,Icon])=><Link href={href} key={name} className="group rounded-2xl border bg-card p-5 transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"><div className="flex items-center justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5"/></span><span className="text-xs text-muted-foreground">Open</span></div><h2 className="mt-5 font-semibold">{name}</h2><p className="mt-2 text-sm text-muted-foreground">{desc}</p></Link>)}</div>
    <section className="mt-8 rounded-2xl border bg-card p-5"><div className="flex items-center gap-2 font-semibold"><ListTodo className="h-5 w-5 text-primary"/> Quick tasks <span className="ml-auto text-xs font-normal text-muted-foreground">stored locally</span></div><div className="mt-4 flex gap-2"><Input value={task} onChange={e=>setTask(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addTask()} placeholder="Add a task..."/><Button onClick={addTask}>Add</Button></div><div className="mt-4 space-y-2">{tasks.slice(0,12).map(t=><button key={t.id} onClick={()=>setTasks(v=>v.map(x=>x.id===t.id?{...x,done:!x.done}:x))} className="flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm hover:bg-muted"><CheckCircle2 className={`h-4 w-4 ${t.done?'text-primary':'text-muted-foreground'}`}/><span className={t.done?'line-through text-muted-foreground':''}>{t.text}</span></button>)}</div></section>
    <div className="mt-8"><StorageManager /></div>
  </div></main></SidebarInset></SidebarProvider>;
}
