'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function BrowserPage() {
  const [input,setInput]=useState('');
  const [url,setUrl]=useState('https://www.google.com/search?q=AI+tools+2026');
  const [history,setHistory]=useState<string[]>([url]);
  const [index,setIndex]=useState(0);
  const navigate=(next:string)=>{const normalized=/^https?:\/\//i.test(next)?next:`https://www.google.com/search?q=${encodeURIComponent(next)}`;const h=[...history.slice(0,index+1),normalized];setHistory(h);setIndex(h.length-1);setUrl(normalized);setInput(normalized)};
  const back=()=>{if(index>0){setIndex(index-1);setUrl(history[index-1]);setInput(history[index-1])}};
  const forward=()=>{if(index<history.length-1){setIndex(index+1);setUrl(history[index+1]);setInput(history[index+1])}};
  return <div className="min-h-screen bg-background p-4 md:p-6"><div className="mx-auto flex h-[calc(100vh-2rem)] max-w-[1600px] flex-col gap-3 md:h-[calc(100vh-3rem)]"><div className="flex flex-wrap items-center gap-2 rounded-xl border bg-card p-2"><Button variant="ghost" size="icon" onClick={back} disabled={index===0}><ArrowLeft/></Button><Button variant="ghost" size="icon" onClick={forward} disabled={index===history.length-1}><ArrowRight/></Button><Button variant="ghost" size="icon" onClick={()=>setUrl(url)}><RefreshCw/></Button><div className="relative min-w-[240px] flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&input.trim())navigate(input.trim())}} placeholder="Search with AI or type a URL" className="pl-9"/></div><Button onClick={()=>input.trim()&&navigate(input.trim())}>Go</Button></div><div className="flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-2 text-xs text-muted-foreground"><span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4"/> External web preview</span><a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-foreground">Open externally <ExternalLink className="h-3.5 w-3.5"/></a></div><div className="min-h-0 flex-1 overflow-hidden rounded-xl border bg-card"><iframe src={url} title="AI browser preview" className="h-full w-full" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"/></div></div></div>;
}
