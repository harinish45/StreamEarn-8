'use client';

import { useMemo, useState } from 'react';
import { Bug, ExternalLink, LockKeyhole, Search, ShieldAlert, ShieldCheck, Terminal, Wrench } from 'lucide-react';
import { Header } from '@/components/header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Resource={title:string;desc:string;href:string;category:string;icon:typeof Bug;featured?:boolean};
const resources:Resource[]=[
 {title:'HackerOne',desc:'Bug bounty and responsible vulnerability disclosure programs.',href:'https://www.hackerone.com/bug-bounty-platform',category:'Bug Bounty',icon:Bug,featured:true},
 {title:'Bugcrowd',desc:'Crowdsourced security and bug bounty research programs.',href:'https://www.bugcrowd.com/bug-bounty-programs/',category:'Bug Bounty',icon:Bug},
 {title:'Intigriti',desc:'European bug bounty and vulnerability disclosure platform.',href:'https://www.intigriti.com/',category:'Bug Bounty',icon:Bug},
 {title:'YesWeHack',desc:'Global bug bounty and vulnerability disclosure programs.',href:'https://yeswehack.com/',category:'Bug Bounty',icon:Bug},
 {title:'Synack Red Team',desc:'Managed security research and penetration testing platform.',href:'https://www.synack.com/red-team/',category:'Bug Bounty',icon:Bug},
 {title:'CTFtime',desc:'Global CTF calendar, rankings and competition archive.',href:'https://ctftime.org/',category:'CTF',icon:Terminal,featured:true},
 {title:'Hack The Box',desc:'Hands-on machines, labs, challenges and security training.',href:'https://www.hackthebox.com/',category:'CTF',icon:Terminal,featured:true},
 {title:'TryHackMe',desc:'Guided rooms and practical offensive and defensive paths.',href:'https://tryhackme.com/',category:'CTF',icon:Terminal,featured:true},
 {title:'picoCTF',desc:'Beginner-to-advanced challenges from Carnegie Mellon University.',href:'https://picoctf.org/',category:'CTF',icon:Terminal},
 {title:'OverTheWire',desc:'Wargames for Linux, networking, web and security fundamentals.',href:'https://overthewire.org/wargames/',category:'CTF',icon:Terminal},
 {title:'Root-Me',desc:'Challenges across web, network, crypto and reverse engineering.',href:'https://www.root-me.org/',category:'CTF',icon:Terminal},
 {title:'PortSwigger Web Security Academy',desc:'Free labs for modern web application security and Burp workflows.',href:'https://portswigger.net/web-security',category:'Web & AppSec',icon:ShieldAlert,featured:true},
 {title:'PentesterLab',desc:'Hands-on web security exercises built around real vulnerability classes.',href:'https://pentesterlab.com/',category:'Web & AppSec',icon:ShieldAlert},
 {title:'APIsec University',desc:'Practical API security training and testing exercises.',href:'https://www.apisecuniversity.com/',category:'Web & AppSec',icon:ShieldAlert},
 {title:'OWASP WebGoat',desc:'Deliberately insecure application for safe web security learning.',href:'https://owasp.org/www-project-webgoat/',category:'Web & AppSec',icon:ShieldAlert},
 {title:'DVWA',desc:'Damn Vulnerable Web Application for controlled practice.',href:'https://github.com/digininja/DVWA',category:'Web & AppSec',icon:ShieldAlert},
 {title:'OWASP Juice Shop',desc:'Modern intentionally vulnerable application covering many web risks.',href:'https://owasp.org/www-project-juice-shop/',category:'Web & AppSec',icon:ShieldAlert},
 {title:'VulnHub',desc:'Downloadable vulnerable machines for penetration-testing practice.',href:'https://www.vulnhub.com/',category:'Pentest & Red Team',icon:Wrench},
 {title:'Metasploitable',desc:'Intentionally vulnerable systems for controlled penetration-testing labs.',href:'https://sourceforge.net/projects/metasploitable/',category:'Pentest & Red Team',icon:Wrench},
 {title:'Security Shepherd',desc:'OWASP training platform for secure development and testing.',href:'https://owasp.org/www-project-security-shepherd/',category:'Pentest & Red Team',icon:Wrench},
 {title:'CyberDefenders',desc:'Blue-team challenges for SOC, DFIR, threat hunting and detection.',href:'https://cyberdefenders.org/',category:'Blue Team & DFIR',icon:ShieldCheck,featured:true},
 {title:'LetsDefend',desc:'SOC analyst training through realistic incidents and alerts.',href:'https://letsdefend.io/',category:'Blue Team & DFIR',icon:ShieldCheck},
 {title:'Blue Team Labs Online',desc:'Practical defensive labs covering SOC, DFIR and threat hunting.',href:'https://blueteamlabs.online/',category:'Blue Team & DFIR',icon:ShieldCheck},
 {title:'MITRE ATT&CK',desc:'Authoritative knowledge base for adversary techniques and detections.',href:'https://attack.mitre.org/',category:'Blue Team & DFIR',icon:ShieldCheck},
 {title:'Malware Traffic Analysis',desc:'PCAP exercises for network traffic and malware investigation.',href:'https://www.malware-traffic-analysis.net/',category:'Blue Team & DFIR',icon:ShieldCheck},
 {title:'pwn.college',desc:'Hands-on binary exploitation, systems and low-level security education.',href:'https://pwn.college/',category:'Binary & Exploitation',icon:Terminal,featured:true},
 {title:'Exploit Education',desc:'Vulnerable programs for memory corruption and exploitation practice.',href:'https://exploit.education/',category:'Binary & Exploitation',icon:Terminal},
 {title:'Crackmes.one',desc:'Reverse-engineering challenges for binary analysis practice.',href:'https://crackmes.one/',category:'Reverse Engineering',icon:Wrench},
 {title:'FLARE-VM',desc:'Windows environment for malware analysis and reverse engineering.',href:'https://github.com/mandiant/flare-vm',category:'Reverse Engineering',icon:Wrench},
 {title:'Security Onion',desc:'Security monitoring distribution for network visibility and detection practice.',href:'https://securityonionsolutions.com/',category:'SOC & Detection',icon:ShieldCheck},
 {title:'Splunk Security Training',desc:'Training for SIEM search, detection and security operations.',href:'https://www.splunk.com/en_us/training.html',category:'SOC & Detection',icon:ShieldCheck},
 {title:'CloudGoat',desc:'Deliberately vulnerable AWS environment for cloud security practice.',href:'https://github.com/RhinoSecurityLabs/cloudgoat',category:'Cloud Security',icon:LockKeyhole},
 {title:'Kubernetes Goat',desc:'Deliberately insecure Kubernetes environment for cloud-native security practice.',href:'https://github.com/madhuakula/kubernetes-goat',category:'Cloud Security',icon:LockKeyhole},
 {title:'OWASP Kubernetes Top 10',desc:'Security risks and guidance for Kubernetes and cloud-native systems.',href:'https://owasp.org/www-project-kubernetes-top-ten/',category:'Cloud Security',icon:LockKeyhole},
 {title:'CISA Cybersecurity Resources',desc:'Authoritative government guidance, advisories and training resources.',href:'https://www.cisa.gov/topics/cyber-threats-and-advisories',category:'Security Knowledge',icon:ShieldCheck}
];
const categories=['All',...Array.from(new Set(resources.map(r=>r.category)))];
const hash=(s:string)=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const imageFor=(id:string)=>{const h=hash(id);const c1=h%360,c2=(h*11)%360;const svg=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 700'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='hsl(${c1} 58% 24%)'/><stop offset='1' stop-color='hsl(${c2} 55% 8%)'/></linearGradient><filter id='b'><feGaussianBlur stdDeviation='28'/></filter></defs><rect width='1200' height='700' fill='url(#g)'/><g opacity='.32'><circle cx='${180+h%500}' cy='${140+h%300}' r='130' fill='white' filter='url(#b)'/><circle cx='${760+h%260}' cy='${480+h%120}' r='180' fill='white' filter='url(#b)'/></g><g fill='none' stroke='white' stroke-opacity='.22'><rect x='70' y='70' width='1060' height='560' rx='32'/><path d='M120 500 360 260l180 120 250-230 190 140'/><path d='M150 180h300M150 215h190'/><path d='M770 515h270M770 550h180'/></g><g fill='white' fill-opacity='.72'><circle cx='360' cy='260' r='7'/><circle cx='540' cy='380' r='7'/><circle cx='790' cy='150' r='7'/><circle cx='980' cy='290' r='7'/></g><text x='90' y='610' fill='white' fill-opacity='.62' font-family='monospace' font-size='22' letter-spacing='5'>CYBERSECURITY // LAB</text><text x='90' y='645' fill='white' fill-opacity='.34' font-family='monospace' font-size='13'>${String(h).padStart(10,'0')}</text></svg>`;return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`};

export default function CybersecurityPage(){
 const [query,setQuery]=useState('');const [active,setActive]=useState('All');
 const filtered=useMemo(()=>resources.filter(r=>(active==='All'||r.category===active)&&`${r.title} ${r.desc} ${r.category}`.toLowerCase().includes(query.toLowerCase())),[query,active]);
 const grouped=active==='All'?categories.slice(1).map(c=>({category:c,items:filtered.filter(r=>r.category===c)})).filter(g=>g.items.length):[{category:active,items:filtered}];
 return <><Header showSidebarTrigger/><div className="p-3 md:p-6"><div className="mx-auto max-w-[1500px]">
 <section className="relative overflow-hidden rounded-2xl border bg-card p-5 md:p-7"><img src={imageFor('cybersecurity-hero')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-10"/><div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/35"/><div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><div className="flex items-center gap-2 text-xs font-medium text-primary"><ShieldCheck className="h-4 w-4"/> Cybersecurity Practice Center</div><h1 className="mt-2 text-3xl font-bold md:text-5xl">Practice. Hunt. Defend. Build.</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Curated security platforms for bug bounty, CTFs, web security, red team, blue team, DFIR, exploitation, reverse engineering and cloud security.</p></div><div className="relative w-full md:w-80"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search platforms, labs or topics..." className="h-10 pl-9"/></div></div></section>
 <div className="mt-4 flex flex-wrap gap-1.5">{categories.map(c=><Button key={c} size="sm" variant={active===c?'default':'outline'} className="h-8 rounded-full px-3 text-xs" onClick={()=>setActive(c)}>{c}</Button>)}</div>
 <div className="mt-5 space-y-6">{grouped.map(group=><section key={group.category}><div className="mb-2 flex items-center gap-2"><h2 className="text-lg font-semibold">{group.category}</h2><Badge variant="secondary" className="text-[10px]">{group.items.length}</Badge></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{group.items.map(r=>{const Icon=r.icon;return <article key={r.title} className="group overflow-hidden rounded-xl border bg-card transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"><div className="relative aspect-[16/8] overflow-hidden bg-muted"><img src={imageFor(`${r.category}-${r.title}`)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/><div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent"/><Icon className="absolute bottom-2 left-2 h-5 w-5 text-white"/></div><div className="p-3"><div className="flex items-start gap-2"><div className="min-w-0 flex-1"><h3 className="text-sm font-semibold">{r.title}</h3><p className="mt-1 line-clamp-2 text-[11px] leading-4 text-muted-foreground">{r.desc}</p></div>{r.featured&&<Badge className="shrink-0 text-[9px]">Top pick</Badge>}</div><a href={r.href} target="_blank" rel="noreferrer" className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-md border px-2 py-1.5 text-[11px] font-medium hover:bg-primary hover:text-primary-foreground">Open platform <ExternalLink className="h-3 w-3"/></a></div></article>})}</div></section>)}{!filtered.length&&<div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">No security platforms matched your search.</div>}</div>
 </div></div></>;
}
