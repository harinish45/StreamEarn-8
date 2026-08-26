'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Archive, CalendarDays, ChevronLeft, ChevronRight, Grip, MoreHorizontal, Plus, RotateCcw, Search, Trash2 } from 'lucide-react';

type Palette = 'lemon'|'blush'|'sky'|'mint'|'peach'|'lilac';
type PaperStyle = 'plain'|'lined'|'grid'|'legal'|'stripe';
type Sticky = { id:string; pageId:string; text:string; color:Palette; style:PaperStyle; x:number; y:number; rotation:number; done:boolean; created:string; updated:string; archived:boolean };
type Page = { id:string; title:string; created:string; updated:string };
type Persisted = { pages:Page[]; notes:Sticky[]; activePageId:string };

const KEY='streamearn-planner-sticky-v5';
const colors:Record<Palette,{p1:string;p2:string;fold:string}>={
  lemon:{p1:'#E9CD4E',p2:'#DDBB2E',fold:'#A98A20'},
  blush:{p1:'#EC7FA6',p2:'#E66E9B',fold:'#B24A73'},
  sky:{p1:'#85BCE9',p2:'#74B0E4',fold:'#4A7FB2'},
  mint:{p1:'#90D18C',p2:'#7EC67C',fold:'#529A52'},
  peach:{p1:'#E18B50',p2:'#DA7F41',fold:'#A85D2C'},
  lilac:{p1:'#AC8FD6',p2:'#9E80CB',fold:'#7457A6'},
};
const palettes=Object.keys(colors) as Palette[];
const papers:PaperStyle[]=['plain','lined','grid','legal','stripe'];
const uid=()=>globalThis.crypto?.randomUUID?.()??`${Date.now()}-${Math.random().toString(36).slice(2)}`;
const now=()=>new Date().toISOString();
const validPalette=(v:any):Palette=>palettes.includes(v)?v:'lemon';
const validPaper=(v:any):PaperStyle=>papers.includes(v)?v:'plain';
const newPage=(title='Main'):Page=>{const t=now();return{id:uid(),title,created:t,updated:t}};
const makeEmpty=():Persisted=>{const p=newPage();return{pages:[p],notes:[],activePageId:p.id}};

function load():Persisted{
  if(typeof window==='undefined')return makeEmpty();
  try{
    const parsed=JSON.parse(localStorage.getItem(KEY)||'null');
    if(!parsed||typeof parsed!=='object')return makeEmpty();
    const rawPages=Array.isArray(parsed.pages)?parsed.pages:[];
    const pages:Page[]=rawPages.filter((p:any)=>p&&typeof p.id==='string').map((p:any)=>({id:p.id,title:typeof p.title==='string'&&p.title.trim()?p.title.trim():'Untitled',created:typeof p.created==='string'?p.created:now(),updated:typeof p.updated==='string'?p.updated:now()}));
    const safePages=pages.length?pages:[newPage()];
    const notes:Sticky[]=Array.isArray(parsed.notes)?parsed.notes.filter((n:any)=>n&&typeof n==='object').map((n:any,i:number)=>({
      id:typeof n.id==='string'?n.id:uid(),pageId:safePages.some(p=>p.id===n.pageId)?n.pageId:safePages[0].id,text:typeof n.text==='string'?n.text:'',
      color:validPalette(n.color),style:validPaper(n.style),x:Number.isFinite(n.x)?Number(n.x):24+(i%4)*285,y:Number.isFinite(n.y)?Number(n.y):24+(Math.floor(i/4)%5)*275,
      rotation:Number.isFinite(n.rotation)?Number(n.rotation):[-2,1,-1,2,0][i%5],done:Boolean(n.done),created:typeof n.created==='string'?n.created:now(),updated:typeof n.updated==='string'?n.updated:now(),archived:Boolean(n.archived)
    })):[];
    return{pages:safePages,notes,activePageId:safePages.some(p=>p.id===parsed.activePageId)?parsed.activePageId:safePages[0].id};
  }catch{return makeEmpty()}
}

export function PlannerStickyWorkspace(){
  const [data,setData]=useState<Persisted>(makeEmpty);
  const [ready,setReady]=useState(false);
  const [query,setQuery]=useState('');
  const [pageMenu,setPageMenu]=useState<string|null>(null);
  const [drag,setDrag]=useState<{id:string;dx:number;dy:number}|null>(null);
  const [showArchived,setShowArchived]=useState(false);
  const board=useRef<HTMLDivElement>(null);

  useEffect(()=>{setData(load());setReady(true)},[]);
  useEffect(()=>{if(ready){try{localStorage.setItem(KEY,JSON.stringify(data))}catch{}}},[data,ready]);
  useEffect(()=>{const move=(e:PointerEvent)=>{if(!drag||!board.current)return;const r=board.current.getBoundingClientRect();const x=Math.max(8,Math.min(e.clientX-r.left-drag.dx,Math.max(8,r.width-270)));const y=Math.max(8,Math.min(e.clientY-r.top-drag.dy,Math.max(8,r.height-255)));setData(d=>({...d,notes:d.notes.map(n=>n.id===drag.id?{...n,x,y,updated:now()}:n)}))};const up=()=>setDrag(null);window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up)}},[drag]);

  const page=data.pages.find(p=>p.id===data.activePageId)||data.pages[0];
  const notes=useMemo(()=>data.notes.filter(n=>n.pageId===page?.id&&(showArchived||!n.archived)&&(!query||n.text.toLowerCase().includes(query.toLowerCase()))),[data.notes,page?.id,query,showArchived]);

  const addPage=()=>{const p=newPage(`Page ${data.pages.length+1}`);setData(d=>({...d,pages:[...d.pages,p],activePageId:p.id}));setPageMenu(null)};
  const rename=(pageId:string)=>{const title=window.prompt('Page name',data.pages.find(p=>p.id===pageId)?.title||'Untitled');if(title?.trim())setData(d=>({...d,pages:d.pages.map(p=>p.id===pageId?{...p,title:title.trim(),updated:now()}:p)}));setPageMenu(null)};
  const deletePage=(pageId:string)=>{if(data.pages.length<=1){window.alert('Keep at least one page.');return}if(!window.confirm('Delete this page and its notes?'))return;setData(d=>{const pages=d.pages.filter(p=>p.id!==pageId);const next=pages[0];return{pages,notes:d.notes.filter(n=>n.pageId!==pageId),activePageId:d.activePageId===pageId?next.id:d.activePageId}});setPageMenu(null)};
  const addNote=()=>{if(!page)return;const i=data.notes.filter(n=>n.pageId===page.id).length;const t=now();let color=palettes[Math.floor(Math.random()*palettes.length)];let style=papers[Math.floor(Math.random()*papers.length)];const last=data.notes.find(n=>n.pageId===page.id);if(last?.color===color)color=palettes[(palettes.indexOf(color)+1)%palettes.length];if(last?.style===style)style=papers[(papers.indexOf(style)+1)%papers.length];const rotation=Math.round((Math.random()*6-3)*10)/10;const x=20+(i%4)*285+(Math.random()*18-9);const y=20+(Math.floor(i/4)%5)*275+(Math.random()*18-9);setData(d=>({...d,notes:[...d.notes,{id:uid(),pageId:page.id,text:'',color,style,x,y,rotation,done:false,created:t,updated:t,archived:false}],pages:d.pages.map(p=>p.id===page.id?{...p,updated:t}:p)}))};
  const patch=(id:string,p:Partial<Sticky>)=>setData(d=>({...d,notes:d.notes.map(n=>n.id===id?{...n,...p,updated:now()}:n)}));
  const clearPage=()=>{if(!page||!window.confirm('Delete all notes on this page?'))return;setData(d=>({...d,notes:d.notes.filter(n=>n.pageId!==page.id)}))};

  if(!ready)return <div className="rounded-2xl border p-6 text-sm text-muted-foreground">Loading Sticky Wall…</div>;

  return <section className="overflow-hidden rounded-2xl border bg-[#171210] text-[#F3E9DC]">
    <div className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-[#1c1510] px-3 py-2">
      <div className="flex max-w-full items-center gap-1.5 overflow-x-auto">{data.pages.map(p=><div key={p.id} className="relative flex shrink-0 items-center"><button onClick={()=>setData(d=>({...d,activePageId:p.id}))} className={`rounded-lg px-3 py-1.5 text-xs ${p.id===page?.id?'bg-[#F2C94C] font-semibold text-[#241C16]':'text-[#C9B391] hover:bg-white/10'}`}>{p.title}</button><button onClick={()=>setPageMenu(pageMenu===p.id?null:p.id)} className="ml-0.5 rounded p-1 text-[#8f7d6b] hover:bg-white/10" aria-label="Page menu"><MoreHorizontal className="h-3.5 w-3.5"/></button>{pageMenu===p.id&&<div className="absolute left-0 top-9 z-30 w-36 rounded-lg border border-white/10 bg-[#241C16] p-1 shadow-xl"><button onClick={()=>rename(p.id)} className="block w-full rounded px-2 py-1.5 text-left text-xs hover:bg-white/10">Rename</button><button onClick={()=>deletePage(p.id)} className="block w-full rounded px-2 py-1.5 text-left text-xs text-red-200 hover:bg-red-500/10">Delete</button></div>}</div>)}<button onClick={addPage} className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-[#C9B391] hover:bg-white/10"><Plus className="h-3 w-3"/>Page</button></div>
      <div className="ml-auto flex items-center gap-2"><div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5 sm:flex"><Search className="h-3.5 w-3.5 text-[#9A8672]"/><input value={query} onChange={e=>setQuery(e.target.value)} className="w-40 bg-transparent text-xs outline-none placeholder:text-[#756454]" placeholder="Search page…"/></div><button onClick={()=>setShowArchived(v=>!v)} className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-[#C9B391] hover:bg-white/10">{showArchived?'Hide archived':'Archived'}</button><button onClick={clearPage} className="rounded-lg p-2 text-[#9A8672] hover:bg-red-500/10 hover:text-red-300" title="Clear page"><Trash2 className="h-4 w-4"/></button><button onClick={addNote} className="inline-flex items-center gap-1.5 rounded-lg bg-[#F2C94C] px-3 py-1.5 text-xs font-semibold text-[#241C16]"><Plus className="h-3.5 w-3.5"/>Sticky</button></div>
    </div>
    <div className="flex items-center gap-2 border-b border-white/10 bg-[#17110d] px-3 py-2"><span className="text-[10px] uppercase tracking-[.16em] text-[#8f7d6b]">{page?.title}</span><span className="text-[10px] text-[#665548]">{notes.length} visible</span><span className="ml-auto text-[10px] text-[#665548]">Drag • tick • change colour/style</span></div>
    <div ref={board} className="relative h-[610px] overflow-auto bg-[radial-gradient(rgba(255,235,205,.08)_1px,transparent_1px)] [background-size:28px_28px] p-2">
      {notes.length===0&&<div className="absolute inset-0 grid place-items-center"><div className="text-center"><div className="mx-auto mb-3 h-14 w-14 -rotate-6 rounded bg-[#E9CD4E] shadow-xl"/><p className="text-sm text-[#C9B391]">This page is empty</p><p className="mt-1 text-xs text-[#756454]">Add a sticky and organize it your way.</p></div></div>}
      {notes.map(n=><Sticky key={n.id} note={n} patch={patch} startDrag={(e)=>{if((e.target as HTMLElement).closest('textarea,button,select,input'))return;const r=(e.currentTarget as HTMLElement).getBoundingClientRect();setDrag({id:n.id,dx:e.clientX-r.left,dy:e.clientY-r.top})}}/>)}
    </div>
  </section>;
}

function Sticky({note,patch,startDrag}:{note:Sticky;patch:(id:string,p:Partial<Sticky>)=>void;startDrag:(e:React.PointerEvent<HTMLDivElement>)=>void}){
  const p=colors[note.color]||colors.lemon;
  const paper=note.style==='lined'?'bg-[repeating-linear-gradient(transparent_0_25px,rgba(0,0,0,.12)_25px_26px)]':note.style==='grid'?'bg-[radial-gradient(rgba(0,0,0,.14)_1px,transparent_1.4px)] [background-size:14px_14px]':note.style==='legal'?'bg-[linear-gradient(90deg,transparent_30px,rgba(217,72,15,.4)_30px_31.5px,transparent_31.5px)]':note.style==='stripe'?'bg-[repeating-linear-gradient(45deg,rgba(255,255,255,.1)_0_14px,transparent_14px_28px)]':'';
  const nextPalette=palettes[(palettes.indexOf(note.color)+1)%palettes.length];
  const nextPaper=papers[(papers.indexOf(note.style)+1)%papers.length];
  return <article onPointerDown={startDrag} className="absolute flex h-[250px] w-[250px] flex-col rounded-[3px] p-4 text-[#262019] shadow-[0_5px_12px_rgba(0,0,0,.4),0_25px_45px_-12px_rgba(0,0,0,.6)] transition-[transform,box-shadow] duration-150 hover:shadow-[0_8px_16px_rgba(0,0,0,.4),0_32px_55px_-12px_rgba(0,0,0,.72)]" style={{left:note.x,top:note.y,transform:`rotate(${note.rotation}deg)`,background:`linear-gradient(175deg,${p.p1},${p.p2})`,opacity:note.archived?.45:1}}>
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/20 to-transparent"/>
    {note.style==='plain'&&<div className="absolute -top-2 left-1/2 h-5 w-16 -translate-x-1/2 rotate-[-2deg] bg-white/25 shadow-md"/>}
    {note.style==='lined'&&<div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-red-500 shadow-md"/>}
    {note.style==='legal'&&<div className="absolute -top-2 left-1/2 h-4 w-8 -translate-x-1/2 rounded bg-slate-500 shadow-md"/>}
    {note.style==='stripe'&&<div className="absolute -top-2 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-blue-700 shadow-md"/>}
    <div className="relative z-10 flex items-center justify-between gap-2"><label className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[.12em] opacity-60"><input type="checkbox" checked={note.done} onChange={e=>patch(note.id,{done:e.target.checked})} className="h-3.5 w-3.5"/>Done</label><div className="flex items-center gap-1"><button onClick={()=>patch(note.id,{archived:!note.archived})} className="rounded-full bg-black/10 p-1 opacity-60 hover:opacity-100" title={note.archived?'Restore':'Archive'}>{note.archived?<RotateCcw className="h-3 w-3"/>:<Archive className="h-3 w-3"/>}</button><button onClick={()=>patch(note.id,{color:nextPalette})} className="h-4 w-4 rounded border border-black/10" style={{background:colors[nextPalette].p1}} title="Next colour"/><button onClick={()=>patch(note.id,{style:nextPaper})} className="rounded-full bg-black/10 p-1 text-[9px] opacity-60 hover:opacity-100" title="Next paper style">↗</button></div></div>
    <textarea value={note.text} onChange={e=>patch(note.id,{text:e.target.value})} placeholder="Write something…" className={`relative z-10 mt-2 min-h-0 flex-1 resize-none overflow-auto bg-transparent font-serif text-[18px] leading-[1.45] outline-none placeholder:text-black/35 ${paper} ${note.done?'line-through opacity-60':''}`}/>
    <div className="relative z-10 mt-2 flex items-center justify-between"><span className="text-[9px] uppercase tracking-wider opacity-40">{new Date(note.updated).toLocaleDateString(undefined,{month:'short',day:'numeric'})}</span><Grip className="h-3.5 w-3.5 opacity-30"/></div><div className="pointer-events-none absolute -bottom-px -right-px h-7 w-7" style={{background:`linear-gradient(to top left,transparent 0 46%,rgba(255,255,255,.3) 47% 49%,${p.fold} 50%)`}}/>
  </article>;
}
