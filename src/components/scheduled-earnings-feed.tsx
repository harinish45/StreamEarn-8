'use client';

import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, RefreshCw, Trash2, WalletCards } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import earnings from '@/data/scheduled/earnings.json';

type Item = { id:string; title:string; description:string; url:string; source:string; published:string; collectedAt?:string; category:string; tags:string[] };
const hiddenKey='streamearn-scheduled-deleted-v1';

export function ScheduledEarningsFeed(){
  const all=earnings as Item[]; const [hidden,setHidden]=useState<string[]>([]);
  useEffect(()=>{try{const raw=JSON.parse(localStorage.getItem(hiddenKey)||'[]');if(Array.isArray(raw))setHidden(raw.filter((x):x is string=>typeof x==='string'));}catch{}},[]);
  const visible=useMemo(()=>all.filter(x=>!hidden.includes(x.id)),[all,hidden]);
  const remove=(id:string)=>{const next=[...new Set([...hidden,id])];setHidden(next);localStorage.setItem(hiddenKey,JSON.stringify(next));};
  return <section className="rounded-2xl border bg-card p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.16em] text-primary"><WalletCards className="h-3.5 w-3.5"/>Daily earning additions<Badge variant="outline" className="text-[8px]">Append-only</Badge></div><h2 className="mt-1 text-lg font-semibold">New earning opportunities</h2><p className="mt-1 max-w-2xl text-xs text-muted-foreground">New earning records are appended below your existing categories. Nothing is automatically replaced.</p></div><div className="inline-flex items-center gap-1 text-[10px] text-muted-foreground"><RefreshCw className="h-3 w-3"/> Scheduled daily</div></div>
  {!visible.length?<div className="mt-4 rounded-xl border border-dashed p-7 text-center text-xs text-muted-foreground">No scheduled earning additions yet.</div>:<div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{visible.map(item=><article key={item.id} className="rounded-xl border bg-background p-4"><div className="flex items-start justify-between gap-2"><div><Badge variant="secondary" className="text-[9px]">{item.category}</Badge><h3 className="mt-2 text-sm font-semibold leading-5">{item.title}</h3></div><Button variant="ghost" size="icon" className="h-7 w-7" title="Delete this scheduled record" onClick={()=>remove(item.id)}><Trash2 className="h-3.5 w-3.5"/></Button></div><p className="mt-2 text-xs leading-4 text-muted-foreground">{item.description}</p><div className="mt-3 flex flex-wrap gap-1">{item.tags.map(tag=><Badge key={tag} variant="outline" className="text-[8px]">{tag}</Badge>)}</div><div className="mt-3 flex items-center justify-between"><span className="text-[9px] text-muted-foreground">{item.source}</span><a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline">Open <ExternalLink className="h-3 w-3"/></a></div></article>)}</div>}
  </section>;
}
