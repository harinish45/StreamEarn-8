'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Briefcase, Building2, Database, DollarSign, ExternalLink, Globe2, Heart, LayoutDashboard, Search, Shield, Sparkles, Users, WandSparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const items = [
  ['AI Tools','AI directory','/ai-tools',Sparkles],
  ['AI Browser','Research and web actions','/browser',Globe2],
  ['Courses','Courses and learning resources','/courses',BookOpen],
  ['Earnings','Online earning opportunities','/earnings',DollarSign],
  ['Leads','Lead operations and tracking','/leads',Users],
  ['Directory','Resource directory','/directory',Database],
  ['Dashboard','Personal dashboard and tasks','/dashboard',LayoutDashboard],
  ['Cybersecurity','Security resources and learning','/category/ai-training',Shield],
  ['Modern Freelancing','Freelance platforms and services','/category/freelance-marketplaces',Briefcase],
  ['Creator Economy','Creator monetization resources','/category/content-monetization',WandSparkles],
] as const;

export default function UnifiedWorkspace() {
  const [q,setQ]=useState('');
  const filtered=useMemo(()=>items.filter(([name,desc])=>`${name} ${desc}`.toLowerCase().includes(q.toLowerCase())),[q]);
  return <div className="min-h-screen bg-background"><div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><div className="flex items-center gap-2 text-sm text-muted-foreground"><Sparkles className="h-4 w-4"/> Unified StreamEarn Workspace</div><h1 className="mt-2 text-4xl font-semibold tracking-tight">One app. One workspace.</h1><p className="mt-2 max-w-2xl text-muted-foreground">The earning hub, learning resources, AI tools, research browser and operational dashboards now live behind the same deployment.</p></div><div className="relative w-full md:w-80"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search workspace..." className="pl-9"/></div></div>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(([name,desc,href,Icon])=><Card key={name} className="group transition hover:border-primary/50 hover:shadow-md"><CardHeader><CardTitle className="flex items-center justify-between text-lg"><span className="flex items-center gap-2"><Icon className="h-5 w-5 text-primary"/>{name}</span><ExternalLink className="h-4 w-4 text-muted-foreground"/></CardTitle></CardHeader><CardContent><p className="mb-4 text-sm text-muted-foreground">{desc}</p><Button asChild><Link href={href}>Open</Link></Button></CardContent></Card>)}</div>
    <div className="mt-8 rounded-2xl border bg-muted/20 p-5"><div className="flex items-center gap-2 font-semibold"><Heart className="h-4 w-4"/> Combined app surface</div><p className="mt-2 text-sm text-muted-foreground">Use this workspace as the entry point, then jump into the specialized StreamEarn pages without leaving the app.</p></div>
  </div></div>;
}
