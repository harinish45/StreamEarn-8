'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { BookOpen, BriefcaseBusiness, ExternalLink, Heart, LayoutGrid, Search, ShieldCheck, Sparkles, WalletCards } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { initialLinks } from '@/lib/resource-data';
import { NewsSection } from '@/components/news-section';

type ResourceLink = typeof initialLinks[number];
const images = ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=900&q=80'];
const sections = [{ id:'all',label:'All Resources',icon:LayoutGrid },{id:'Monday',label:'AI Foundations',icon:BookOpen},{id:'Cybersecurity',label:'Cybersecurity',icon:ShieldCheck},{id:'Careers',label:'Careers & Jobs',icon:BriefcaseBusiness},{id:'Platforms',label:'Platforms',icon:WalletCards},{id:'Favorites',label:'Favorites',icon:Heart}];
const imageFor=(link:ResourceLink)=>images[`${link.id}${link.title}`.split('').reduce((a,c)=>a+c.charCodeAt(0),0)%images.length];

export default function EnhancedResourceHub(){
 const [section,setSection]=useState('all'); const [query,setQuery]=useState(''); const [favorites,setFavorites]=useState<Set<string>>(new Set(initialLinks.filter(l=>l.isFavorite).map(l=>l.id)));
 const links=useMemo(()=>{const q=query.trim().toLowerCase();return initialLinks.filter(l=>{const s=section==='all'||(section==='Favorites'?favorites.has(l.id):l.tags.some(t=>t.toLowerCase()===section.toLowerCase()));const m=!q||[l.title,l.description,...l.tags].join(' ').toLowerCase().includes(q);return s&&m;}).slice(0,120)},[section,query,favorites]);
 const toggle=(id:string)=>setFavorites(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n});
 return <main className="mx-auto w-full max-w-[1500px] px-4 py-7 md:px-8 md:py-10"><div className="space-y-10">
   <section className="relative overflow-hidden rounded-3xl border bg-card p-7 md:p-10"><img src={images[4]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-15" /><div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30" /><div className="relative space-y-5"><div className="flex items-center gap-2 text-primary"><Sparkles className="h-5 w-5" /><span className="text-xs font-semibold uppercase tracking-[0.2em]">Integrated Resource Hub</span></div><h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">Everything useful, organised in one place.</h1><p className="max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">Learning, AI, cybersecurity, careers, platforms, business resources and the second-project library — now one searchable workspace.</p><div className="relative max-w-2xl"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search the entire resource library..." className="h-13 rounded-full bg-background/90 pl-12" /></div></div></section>
   <div className="flex gap-2 overflow-x-auto pb-1">{sections.map(({id,label,icon:Icon})=><Button key={id} variant={section===id?'default':'outline'} className="shrink-0 rounded-full" onClick={()=>setSection(id)}><Icon className="mr-2 h-4 w-4" />{label}</Button>)}<Button asChild variant="outline" className="shrink-0 rounded-full"><Link href="/ai-tools"><Sparkles className="mr-2 h-4 w-4" />AI Directory</Link></Button><Button asChild variant="outline" className="shrink-0 rounded-full"><Link href="/news">AI News</Link></Button></div>
   <div className="flex items-center justify-between text-sm text-muted-foreground"><span>{links.length} resources shown</span><span>Integrated library</span></div>
   <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{links.map(link=><Card key={link.id} className="group overflow-hidden transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"><div className="aspect-[16/8] overflow-hidden"><img src={imageFor(link)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" /></div><CardHeader className="pb-3"><div className="flex items-start justify-between gap-3"><CardTitle className="text-base leading-6">{link.title}</CardTitle><button aria-label={`Favorite ${link.title}`} onClick={()=>toggle(link.id)} className="rounded-md p-1 text-muted-foreground hover:text-primary"><Heart className={`h-4 w-4 ${favorites.has(link.id)?'fill-current text-primary':''}`} /></button></div><p className="text-xs leading-5 text-muted-foreground">{link.description}</p></CardHeader><CardContent><div className="mb-4 flex flex-wrap gap-1.5">{link.tags.slice(0,4).map(tag=><Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>)}</div><Button asChild variant="outline" size="sm" className="w-full"><a href={link.url} target="_blank" rel="noreferrer">Open Resource <ExternalLink className="ml-2 h-3.5 w-3.5" /></a></Button></CardContent></Card>)}</div>
   {!links.length&&<div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">No resources match that filter.</div>}
   <NewsSection compact />
 </div></main>;
}
