'use client';

import { useMemo, useState } from 'react';
import { ExternalLink, LockKeyhole, Search, ShieldAlert, ShieldCheck, Terminal, Wrench } from 'lucide-react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { UnifiedSidebar } from '@/components/unified-sidebar';
import { Header } from '@/components/header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const resources = [
  { title: 'CTF & Practice Labs', desc: 'Hands-on environments for web, network, reverse engineering and defensive practice.', icon: Terminal, href: 'https://tryhackme.com/' },
  { title: 'Web Security Testing', desc: 'Learn modern application security testing, APIs, authentication and common vulnerabilities.', icon: ShieldAlert, href: 'https://portswigger.net/web-security' },
  { title: 'Blue Team & Detection', desc: 'Explore defensive monitoring, detection engineering and incident-response workflows.', icon: ShieldCheck, href: 'https://attack.mitre.org/' },
  { title: 'Security Automation', desc: 'Build repeatable security workflows for triage, enrichment and response.', icon: Wrench, href: 'https://www.n8n.io/' },
  { title: 'Privacy & Identity', desc: 'Understand identity, access control, secrets and privacy-first engineering.', icon: LockKeyhole, href: 'https://owasp.org/' },
  { title: 'Security Knowledge', desc: 'Use authoritative security references to validate techniques and controls.', icon: ShieldCheck, href: 'https://www.cisa.gov/' },
];

export default function CybersecurityPage() {
  const [query,setQuery]=useState('');
  const filtered=useMemo(()=>resources.filter(r=>`${r.title} ${r.desc}`.toLowerCase().includes(query.toLowerCase())),[query]);
  return <SidebarProvider><UnifiedSidebar/><SidebarInset><Header showSidebarTrigger/><main className="min-h-[calc(100vh-4rem)] bg-background p-4 md:p-8"><div className="mx-auto max-w-7xl"><section className="rounded-3xl border bg-gradient-to-br from-emerald-500/10 via-card to-card p-6 md:p-10"><div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"><div><div className="flex items-center gap-2 text-sm font-medium text-emerald-600"><ShieldCheck className="h-4 w-4"/> Cybersecurity Center</div><h1 className="mt-3 text-3xl font-bold md:text-5xl">Learn, practice and build securely.</h1><p className="mt-3 max-w-2xl text-muted-foreground">A reliable security workspace for labs, defensive knowledge, application security and automation.</p></div><div className="relative w-full md:w-80"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search security resources..." className="pl-9"/></div></div></section><div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filtered.map(r=>{const Icon=r.icon;return <article key={r.title} className="overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-1 hover:shadow-lg"><div className="flex h-36 items-center justify-center bg-gradient-to-br from-emerald-500/15 via-muted to-background"><Icon className="h-12 w-12 text-emerald-600"/></div><div className="p-5"><h2 className="font-semibold">{r.title}</h2><p className="mt-2 text-sm text-muted-foreground">{r.desc}</p><Button asChild className="mt-5 w-full"><a href={r.href} target="_blank" rel="noreferrer">Open resource <ExternalLink className="ml-2 h-4 w-4"/></a></Button></div></article>})}</div></div></main></SidebarInset></SidebarProvider>;
}
