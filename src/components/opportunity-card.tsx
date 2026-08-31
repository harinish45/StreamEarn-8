'use client';
import type { Opportunity } from '@/lib/data';
import { ArrowUpRight, Star } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface OpportunityCardProps {
  opportunity: Opportunity;
  categoryId: string;
}

const hash=(value:string)=>{let h=2166136261;for(let i=0;i<value.length;i++){h^=value.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const visualFor=(value:string)=>{const h=hash(value);const hue1=h%360;const hue2=(h*7)%360;const x=90+(h%650);const y=55+(Math.floor(h/17)%220);const svg=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 520'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='hsl(${hue1} 52% 30%)'/><stop offset='100%' stop-color='hsl(${hue2} 48% 9%)'/></linearGradient><radialGradient id='r'><stop stop-color='white' stop-opacity='.30'/><stop offset='1' stop-color='white' stop-opacity='0'/></radialGradient></defs><rect width='900' height='520' fill='url(#g)'/><circle cx='${x}' cy='${y}' r='190' fill='url(#r)'/><g fill='none' stroke='rgba(255,255,255,.15)' stroke-width='2'><path d='M0 120 C170 40 270 210 430 130 S700 55 900 170'/><path d='M-40 420 C120 330 260 470 420 360 S720 330 940 440'/><circle cx='720' cy='100' r='70'/><circle cx='720' cy='100' r='36'/></g><rect x='26' y='26' width='170' height='32' rx='16' fill='rgba(0,0,0,.25)'/><text x='43' y='47' fill='rgba(255,255,255,.80)' font-family='monospace' font-size='12' letter-spacing='2'>STREAM EARN</text><text x='34' y='485' fill='rgba(255,255,255,.62)' font-family='monospace' font-size='15' letter-spacing='3'>${String(h).padStart(10,'0')}</text></svg>`;return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`};
const initials=(title:string)=>title.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]?.toUpperCase()).join('')||'OP';

export function OpportunityCard({ opportunity: initialOpportunity, categoryId }: OpportunityCardProps) {
  const [opportunity,setOpportunity]=useState(initialOpportunity);
  const [isFavorited,setIsFavorited]=useState(false);
  const image=visualFor(`${categoryId}:${opportunity.id}:${opportunity.title}`);
  return <article className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_18px_45px_rgba(0,0,0,.20)]" onClick={()=>!opportunity.visited&&setOpportunity(p=>({...p,visited:true}))}>
    <div className="relative aspect-[16/9] overflow-hidden border-b border-border/60 bg-muted">
      <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" loading="lazy"/>
      <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-2"><span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[9px] font-medium text-white backdrop-blur"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 font-mono text-[8px]">{initials(opportunity.title)}</span>{opportunity.title}</span><span className="rounded-full bg-black/45 px-2 py-1 text-[8px] uppercase tracking-[.15em] text-white/80 backdrop-blur">Opportunity</span></div>
    </div>
    <div className="flex flex-1 flex-col p-3">
      <div className="flex items-start justify-between gap-2"><h3 className="text-sm font-semibold leading-5 text-foreground">{opportunity.title}</h3><Button type="button" variant="ghost" size="icon" className="-mr-1 -mt-1 h-7 w-7 shrink-0" onClick={e=>{e.preventDefault();e.stopPropagation();setIsFavorited(v=>!v)}} aria-label={isFavorited?'Remove favorite':'Add favorite'}><Star className={cn('h-4 w-4',isFavorited?'fill-current text-yellow-400':'text-muted-foreground')}/></Button></div>
      <p className="mt-1.5 line-clamp-3 text-xs leading-5 text-muted-foreground">{opportunity.description}</p>
      <div className="mt-auto flex items-end justify-between gap-3 pt-3"><div className="flex flex-wrap gap-1">{opportunity.tags?.slice(0,3).map(tag=><span key={tag} className="rounded-full bg-muted px-2 py-1 text-[9px] text-muted-foreground">{tag}</span>)}</div><a href={opportunity.link} target="_blank" rel="noopener noreferrer" onClick={e=>{e.stopPropagation();if(!opportunity.visited)setOpportunity(p=>({...p,visited:true}))}} className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border px-2 py-1.5 text-[10px] font-medium text-muted-foreground hover:border-accent/50 hover:text-foreground">Open<ArrowUpRight className="h-3.5 w-3.5"/></a></div>
    </div>
  </article>;
}
