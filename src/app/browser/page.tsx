'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { UnifiedSidebar } from '@/components/unified-sidebar';
import { Header } from '@/components/header';

const quickLinks = [
  ['AI Tools', '/ai-tools'], ['AI News', '/news'], ['Resource Hub', '/hub'], ['Workspace', '/workspace'],
];

export default function BrowserPage() {
  const [input, setInput] = useState('');
  const [url, setUrl] = useState('https://www.google.com/search?q=AI+technology+2026');
  const [history, setHistory] = useState<string[]>([url]);
  const [index, setIndex] = useState(0);
  const navigate = (next: string) => {
    const normalized = /^https?:\/\//i.test(next) ? next : `https://www.google.com/search?q=${encodeURIComponent(next)}`;
    const h = [...history.slice(0, index + 1), normalized];
    setHistory(h); setIndex(h.length - 1); setUrl(normalized); setInput(normalized);
  };
  const back = () => { if (index > 0) { setIndex(index - 1); setUrl(history[index - 1]); setInput(history[index - 1]); } };
  const forward = () => { if (index < history.length - 1) { setIndex(index + 1); setUrl(history[index + 1]); setInput(history[index + 1]); } };

  return <SidebarProvider><UnifiedSidebar /><SidebarInset><Header showSidebarTrigger /><div className="min-h-[calc(100vh-4rem)] bg-background p-4 md:p-6"><div className="mx-auto flex h-[calc(100vh-6rem)] max-w-[1600px] flex-col gap-3">
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border bg-card p-2 shadow-sm"><Button variant="ghost" size="icon" onClick={back} disabled={index === 0}><ArrowLeft /></Button><Button variant="ghost" size="icon" onClick={forward} disabled={index === history.length - 1}><ArrowRight /></Button><Button variant="ghost" size="icon" onClick={() => setUrl(url)}><RefreshCw /></Button><div className="relative min-w-[240px] flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && input.trim() && navigate(input.trim())} placeholder="Search the web or type a URL..." className="pl-9" /></div><Button onClick={() => input.trim() && navigate(input.trim())}>Go</Button></div>
    <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-muted/20 p-2 text-xs"><span className="mr-1 flex items-center gap-1 text-muted-foreground"><ShieldCheck className="h-4 w-4" /> External web preview</span>{quickLinks.map(([label, href]) => <a key={href} href={href} className="rounded-full border bg-background px-3 py-1.5 hover:bg-muted">{label}</a>)}<a href={url} target="_blank" rel="noreferrer" className="ml-auto flex items-center gap-1 text-primary hover:underline">Open externally <ExternalLink className="h-3.5 w-3.5" /></a></div>
    <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border bg-card shadow-sm"><iframe src={url} title="External web preview" className="h-full w-full" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" /></div>
  </div></div></SidebarInset></SidebarProvider>;
}
