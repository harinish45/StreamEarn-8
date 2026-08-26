'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Check, ChevronLeft, ChevronRight, ClipboardList, Database, FileText, ListTodo, Plus, Repeat2, Search, StickyNote, Target, Trash2 } from 'lucide-react';
import Link from 'next/link';

const KEY = 'streamearn-planner-v6';
type Tab = 'today'|'week'|'calendar'|'tasks'|'notes'|'recurring'|'database'|'progress';
type Task = { id:string; title:string; date:string; done:boolean; priority:string; deleted:boolean };
type Note = { id:string; title:string; text:string; date:string; kind:string };
type Repeat = { id:string; title:string; cadence:string; active:boolean };
type Row = { id:string; name:string; status:string; due:string };
type Store = { tasks:Task[]; notes:Note[]; recurring:Repeat[]; rows:Row[] };

const fresh = ():Store => ({tasks:[], notes:[], recurring:[], rows:[]});
const uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const today = () => new Date().toISOString().slice(0,10);
const dateObj = (s:string) => { const d = new Date(`${s}T12:00:00`); return Number.isNaN(d.getTime()) ? new Date() : d; };
const moveDate = (s:string,n:number) => { const d=dateObj(s); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); };
const safeDate = (v:any) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(dateObj(v).getTime()) ? v : today();

function sanitize(raw:any):Store {
  const s=fresh();
  if(!raw || typeof raw!=='object') return s;
  if(Array.isArray(raw.tasks)) s.tasks=raw.tasks.filter(Boolean).map((x:any)=>({id:typeof x.id==='string'?x.id:uid(),title:typeof x.title==='string'?x.title.trim():'',date:safeDate(x.date),done:Boolean(x.done),priority:['low','medium','high'].includes(x.priority)?x.priority:'medium',deleted:Boolean(x.deleted)})).filter((x:any)=>x.title);
  if(Array.isArray(raw.notes)) s.notes=raw.notes.filter(Boolean).map((x:any)=>({id:typeof x.id==='string'?x.id:uid(),title:typeof x.title==='string'?x.title:'Untitled',text:typeof x.text==='string'?x.text:'',date:safeDate(x.date),kind:typeof x.kind==='string'?x.kind:'note'}));
  if(Array.isArray(raw.recurring)) s.recurring=raw.recurring.filter(Boolean).map((x:any)=>({id:typeof x.id==='string'?x.id:uid(),title:typeof x.title==='string'?x.title.trim():'',cadence:typeof x.cadence==='string'?x.cadence:'daily',active:x.active!==false})).filter((x:any)=>x.title);
  if(Array.isArray(raw.rows)) s.rows=raw.rows.filter(Boolean).map((x:any)=>({id:typeof x.id==='string'?x.id:uid(),name:typeof x.name==='string'?x.name.trim():'',status:typeof x.status==='string'?x.status:'Planned',due:safeDate(x.due)})).filter((x:any)=>x.name);
  return s;
}

function loadStore():Store {
  if(typeof window==='undefined') return fresh();
  try { const raw=window.localStorage.getItem(KEY); return raw ? sanitize(JSON.parse(raw)) : fresh(); } catch { return fresh(); }
}

export default function PlannerV2(){
  const [tab,setTab]=useState<Tab>('today');
  const [date,setDate]=useState(today());
  const [store,setStore]=useState<Store>(fresh);
  const [ready,setReady]=useState(false);
  const [task,setTask]=useState('');
  const [query,setQuery]=useState('');
  const [noteTitle,setNoteTitle]=useState('');
  const [noteText,setNoteText]=useState('');
  const [repeat,setRepeat]=useState('');
  const [row,setRow]=useState('');
  const [rowStatus,setRowStatus]=useState('Planned');

  useEffect(()=>{ try { const old=loadStore(); const legacy=window.localStorage.getItem('streamearn-planner-v5'); if(!old.tasks.length&&!old.notes.length&&!old.recurring.length&&!old.rows.length&&legacy){ const migrated=sanitize(JSON.parse(legacy)); setStore(migrated); window.localStorage.setItem(KEY,JSON.stringify(migrated)); } else setStore(old); } catch { setStore(fresh()); } finally { setReady(true); } },[]);
  useEffect(()=>{ if(ready){ try { window.localStorage.setItem(KEY,JSON.stringify(store)); } catch {} } },[ready,store]);

  const tasks=Array.isArray(store.tasks)?store.tasks:[];
  const active=tasks.filter(t=>!t.deleted);
  const archived=tasks.filter(t=>t.deleted);
  const completed=active.filter(t=>t.done).length;
  const percent=active.length?Math.round(completed/active.length*100):0;
  const dayTasks=useMemo(()=>active.filter(t=>t.date===date && t.title.toLowerCase().includes(query.toLowerCase())),[active,date,query]);
  const week=useMemo(()=>Array.from({length:7},(_,i)=>moveDate(date,i)),[date]);
  const month=useMemo(()=>{const first=dateObj(date);first.setDate(1);return Array.from({length:42},(_,i)=>{const d=new Date(first);d.setDate(i-first.getDay()+1);return d.toISOString().slice(0,10);});},[date]);

  const addTask=()=>{const v=task.trim();if(!v)return;setStore(s=>({...s,tasks:[...s.tasks,{id:uid(),title:v,date,done:false,priority:'medium',deleted:false}]}));setTask('');};
  const toggle=(id:string)=>setStore(s=>({...s,tasks:s.tasks.map(t=>t.id===id?{...t,done:!t.done}:t)}));
  const archive=(id:string)=>setStore(s=>({...s,tasks:s.tasks.map(t=>t.id===id?{...t,deleted:true}:t)}));
  const restore=(id:string)=>setStore(s=>({...s,tasks:s.tasks.map(t=>t.id===id?{...t,deleted:false}:t)}));
  const addNote=(kind:string)=>{const text=noteText.trim();if(!text)return;setStore(s=>({...s,notes:[{id:uid(),title:noteTitle.trim()||kind,text,date,kind},...s.notes]}));setNoteTitle('');setNoteText('');};
  const addRepeat=()=>{const v=repeat.trim();if(!v)return;setStore(s=>({...s,recurring:[...s.recurring,{id:uid(),title:v,cadence:'daily',active:true}]}));setRepeat('');};
  const addRow=()=>{const v=row.trim();if(!v)return;setStore(s=>({...s,rows:[...s.rows,{id:uid(),name:v,status:rowStatus,due:date}]}));setRow('');};

  if(!ready) return <main className="min-h-screen bg-background p-6"><div className="mx-auto max-w-5xl py-12"><p className="text-sm text-muted-foreground">Loading Planner…</p></div></main>;

  return <main className="min-h-screen bg-background"><div className="mx-auto max-w-[1280px] px-4 py-5 md:px-7 md:py-7">
    <header className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><Link href="/" className="text-xs text-muted-foreground hover:text-foreground">← StreamEarn</Link><p className="mt-3 text-[10px] font-semibold uppercase tracking-[.18em] text-muted-foreground">Personal command centre</p><h1 className="text-3xl font-semibold tracking-tight">Planner</h1><p className="mt-1 text-sm text-muted-foreground">Tasks, calendar, notes, recurring work, database, progress and Sticky Wall. Local-first. No AI.</p></div><div className="flex items-center gap-1 rounded-lg border bg-card p-1"><button className="rounded-md p-2 hover:bg-muted" onClick={()=>setDate(moveDate(date,-1))}><ChevronLeft className="h-4 w-4"/></button><button className="rounded-md px-3 py-2 text-xs font-medium hover:bg-muted" onClick={()=>setDate(today())}>Today</button><button className="rounded-md p-2 hover:bg-muted" onClick={()=>setDate(moveDate(date,1))}><ChevronRight className="h-4 w-4"/></button></div></header>
    <nav className="mb-5 flex gap-1 overflow-x-auto border-b pb-2">{([['today','Today',ClipboardList],['week','Week',ListTodo],['calendar','Calendar',CalendarDays],['tasks','To-Do',Check],['notes','Pages & Notes',FileText],['recurring','Recurring',Repeat2],['database','Database',Database],['progress','Progress',Target]] as const).map(([id,label,Icon])=><button key={id} onClick={()=>setTab(id)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium ${tab===id?'bg-foreground text-background':'text-muted-foreground hover:bg-muted'}`}><Icon className="h-3.5 w-3.5"/>{label}</button>)}<Link href="/planner/sticky" className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"><StickyNote className="h-3.5 w-3.5"/>Sticky Wall</Link></nav>

    {tab==='today' && <section className="grid gap-5 lg:grid-cols-[1fr_300px]"><div className="rounded-xl border bg-card p-4"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-semibold">{date===today()?'Today':dateObj(date).toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'})}</h2><p className="text-xs text-muted-foreground">Unfinished tasks remain available until completed.</p></div><span className="rounded-full bg-muted px-2.5 py-1 text-xs">{dayTasks.filter(t=>!t.done).length} pending</span></div><form className="mb-3 flex gap-2" onSubmit={e=>{e.preventDefault();addTask();}}><input value={task} onChange={e=>setTask(e.target.value)} className="h-9 flex-1 rounded-md border bg-background px-3 text-sm outline-none" placeholder="Add a task…"/><button className="rounded-md bg-foreground px-3 text-xs font-semibold text-background"><Plus className="mr-1 inline h-4 w-4"/>Add</button></form><div className="mb-3 flex items-center gap-2"><Search className="h-3.5 w-3.5 text-muted-foreground"/><input value={query} onChange={e=>setQuery(e.target.value)} className="h-8 w-full rounded-md border bg-background px-3 text-xs outline-none" placeholder="Search this day…"/></div><div className="divide-y">{dayTasks.length===0?<p className="py-12 text-center text-sm text-muted-foreground">No tasks for this day.</p>:dayTasks.map(t=><div key={t.id} className="group flex items-center gap-3 py-3"><button onClick={()=>toggle(t.id)} className="shrink-0">{t.done?<span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="h-3 w-3"/></span>:<span className="block h-5 w-5 rounded-full border-2"/>}</button><span className={`min-w-0 flex-1 text-sm ${t.done?'text-muted-foreground line-through':''}`}>{t.title}</span><span className="text-[10px] uppercase text-muted-foreground">{t.priority}</span><button onClick={()=>archive(t.id)} className="opacity-0 group-hover:opacity-100"><Trash2 className="h-4 w-4 text-muted-foreground"/></button></div>)}</div></div><aside className="space-y-3"><Stat label="Completion" value={`${percent}%`}/><Stat label="Active tasks" value={String(active.length)}/><Link href="/planner/sticky" className="block rounded-xl border bg-card p-4 hover:bg-muted"><p className="text-xs font-semibold">Sticky Wall</p><p className="mt-1 text-xs text-muted-foreground">Open the tactile local board.</p></Link></aside></section>}

    {tab==='week' && <section className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">{week.map(d=><button key={d} onClick={()=>{setDate(d);setTab('today')}} className="min-h-36 rounded-xl border bg-card p-3 text-left hover:bg-muted"><p className="text-xs font-semibold">{dateObj(d).toLocaleDateString(undefined,{weekday:'short'})}</p><p className="text-[11px] text-muted-foreground">{dateObj(d).toLocaleDateString(undefined,{month:'short',day:'numeric'})}</p><div className="mt-3 space-y-1">{active.filter(t=>t.date===d).slice(0,5).map(t=><div key={t.id} className={`truncate text-xs ${t.done?'line-through text-muted-foreground':''}`}>• {t.title}</div>)}</div></button>)}</section>}

    {tab==='calendar' && <section className="rounded-xl border bg-card p-4"><div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">Calendar</h2><span className="text-xs text-muted-foreground">Click a date</span></div><div className="grid grid-cols-7 gap-1">{month.map((d,i)=><button key={`${d}-${i}`} onClick={()=>{setDate(d);setTab('today')}} className={`min-h-16 rounded-md border p-2 text-left hover:bg-muted ${d===today()?'border-primary':''}`}><span className="text-xs">{dateObj(d).getDate()}</span>{active.filter(t=>t.date===d).length>0&&<span className="mt-1 block text-[10px] text-muted-foreground">{active.filter(t=>t.date===d).length} tasks</span>}</button>)}</div></section>}

    {tab==='tasks' && <section className="grid gap-5 lg:grid-cols-[1fr_320px]"><div className="rounded-xl border bg-card p-4"><h2 className="font-semibold">All To-Do</h2><div className="mt-3 divide-y">{active.length===0?<p className="py-10 text-sm text-muted-foreground">No tasks yet.</p>:active.map(t=><div key={t.id} className="flex items-center gap-3 py-3"><button onClick={()=>toggle(t.id)}>{t.done?<span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="h-3 w-3"/></span>:<span className="block h-5 w-5 rounded-full border-2"/>}</button><span className={`flex-1 text-sm ${t.done?'line-through text-muted-foreground':''}`}>{t.title}</span><span className="text-[10px] text-muted-foreground">{t.date}</span><button onClick={()=>archive(t.id)}><Trash2 className="h-4 w-4 text-muted-foreground"/></button></div>)}</div></div><div className="rounded-xl border bg-card p-4"><h3 className="font-semibold">Archive</h3><div className="mt-3 space-y-2">{archived.length===0?<p className="text-xs text-muted-foreground">Archive is empty.</p>:archived.map(t=><div key={t.id} className="flex items-center gap-2 text-xs"><span className="flex-1 truncate">{t.title}</span><button onClick={()=>restore(t.id)}>Restore</button></div>)}</div></div></section>}

    {tab==='notes' && <section className="grid gap-5 lg:grid-cols-[360px_1fr]"><div className="rounded-xl border bg-card p-4"><h2 className="font-semibold">Pages & Notes</h2><input value={noteTitle} onChange={e=>setNoteTitle(e.target.value)} className="mt-3 h-9 w-full rounded-md border bg-background px-3 text-sm" placeholder="Title"/><textarea value={noteText} onChange={e=>setNoteText(e.target.value)} className="mt-2 min-h-48 w-full rounded-md border bg-background p-3 text-sm" placeholder="Write something…"/><div className="mt-2 flex gap-2"><button onClick={()=>addNote('page')} className="rounded-md bg-foreground px-3 py-2 text-xs text-background">Save Page</button><button onClick={()=>addNote('meeting')} className="rounded-md border px-3 py-2 text-xs">Meeting</button><button onClick={()=>addNote('note')} className="rounded-md border px-3 py-2 text-xs">Quick Note</button></div></div><div className="rounded-xl border bg-card p-4"><h2 className="font-semibold">Saved</h2><div className="mt-3 space-y-2">{store.notes.length===0?<p className="text-sm text-muted-foreground">Nothing saved yet.</p>:store.notes.map(n=><article key={n.id} className="rounded-lg border p-3"><div className="flex items-center justify-between"><strong className="text-sm">{n.title}</strong><span className="text-[10px] uppercase text-muted-foreground">{n.kind}</span></div><p className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">{n.text}</p></article>)}</div></div></section>}

    {tab==='recurring' && <section className="grid gap-5 lg:grid-cols-[360px_1fr]"><div className="rounded-xl border bg-card p-4"><h2 className="font-semibold">Recurring</h2><form className="mt-3 flex gap-2" onSubmit={e=>{e.preventDefault();addRepeat();}}><input value={repeat} onChange={e=>setRepeat(e.target.value)} className="h-9 flex-1 rounded-md border bg-background px-3 text-sm" placeholder="e.g. Review alerts"/><button className="rounded-md bg-foreground px-3 text-background"><Plus className="h-4 w-4"/></button></form></div><div className="rounded-xl border bg-card p-4 space-y-2">{store.recurring.length===0?<p className="text-sm text-muted-foreground">No recurring tasks.</p>:store.recurring.map(r=><div key={r.id} className="flex items-center gap-3 rounded-lg border p-3"><Repeat2 className="h-4 w-4 text-muted-foreground"/><span className="flex-1 text-sm">{r.title}</span><span className="text-[10px] uppercase text-muted-foreground">{r.cadence}</span></div>)}</div></section>}

    {tab==='database' && <section className="grid gap-5 lg:grid-cols-[360px_1fr]"><div className="rounded-xl border bg-card p-4"><h2 className="font-semibold">Database</h2><input value={row} onChange={e=>setRow(e.target.value)} className="mt-3 h-9 w-full rounded-md border bg-background px-3 text-sm" placeholder="Item name"/><select value={rowStatus} onChange={e=>setRowStatus(e.target.value)} className="mt-2 h-9 w-full rounded-md border bg-background px-2 text-sm"><option>Planned</option><option>Active</option><option>Done</option><option>Blocked</option></select><button onClick={addRow} className="mt-2 w-full rounded-md bg-foreground py-2 text-xs text-background">Add row</button></div><div className="rounded-xl border bg-card p-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs text-muted-foreground"><tr><th className="pb-2">Name</th><th className="pb-2">Status</th><th className="pb-2">Due</th><th/></tr></thead><tbody>{store.rows.length===0?<tr><td colSpan={4} className="py-8 text-center text-xs text-muted-foreground">No rows.</td></tr>:store.rows.map(r=><tr key={r.id} className="border-t"><td className="py-2">{r.name}</td><td>{r.status}</td><td className="text-xs text-muted-foreground">{r.due}</td><td className="text-right"><button onClick={()=>setStore(s=>({...s,rows:s.rows.filter(x=>x.id!==r.id)}))}><Trash2 className="h-4 w-4 text-muted-foreground"/></button></td></tr>)}</tbody></table></div></section>}

    {tab==='progress' && <section className="grid gap-4 sm:grid-cols-3"><Stat label="Tasks" value={String(active.length)}/><Stat label="Completed" value={String(completed)}/><Stat label="Completion" value={`${percent}%`}/></section>}
  </div></main>;
}

function Stat({label,value}:{label:string;value:string}){return <div className="rounded-xl border bg-card p-5"><p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>}
