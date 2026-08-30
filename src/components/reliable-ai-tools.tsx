'use client';

import { useMemo, useState } from 'react';
import { ArrowUpRight, ExternalLink, Grid2X2, List, Search, Sparkles, X } from 'lucide-react';
import { currentAIDirectory, type CurrentAITool } from '@/lib/current-ai-directory';
import { currentAIAdditions } from '@/lib/current-ai-additions';

const automationTools: CurrentAITool[] = [
  { name: 'n8n', url: 'https://n8n.io/', summary: 'Visual workflow automation with AI nodes, code steps and self-hosting.', tags: ['automation','workflow','self-hosted'], featured: true },
  { name: 'Zapier', url: 'https://zapier.com/', summary: 'App automation with AI workflows, agents and integrations.', tags: ['automation','agents','integrations'], featured: true },
  { name: 'Make', url: 'https://www.make.com/', summary: 'Visual automation scenarios with branching, transformations and AI.', tags: ['automation','visual','workflow'] },
  { name: 'Gumloop', url: 'https://www.gumloop.com/', summary: 'AI-native workflows for research, data and agentic automation.', tags: ['ai-automation','agents','research'] },
  { name: 'Relevance AI', url: 'https://relevanceai.com/', summary: 'AI agents and workforces for repeatable business operations.', tags: ['agents','automation','business'] },
];

const frontierTools: CurrentAITool[] = [
  { name: 'GPT-5.6 Sol', url: 'https://openai.com/index/gpt-5-6/', summary: 'OpenAI frontier model for coding, reasoning, knowledge work and agentic tasks.', tags: ['frontier','openai','coding'], featured: true },
  { name: 'OpenAI Codex', url: 'https://openai.com/codex/', summary: 'Agentic software engineering for repository work, testing and delivery.', tags: ['agents','coding','openai'], featured: true },
  { name: 'Claude Opus 5', url: 'https://www.anthropic.com/news/claude-opus-5', summary: 'Anthropic frontier model for demanding coding and knowledge work.', tags: ['frontier','anthropic','reasoning'], featured: true },
  { name: 'Claude Code', url: 'https://www.anthropic.com/claude-code', summary: 'Terminal-native coding agent for repository-scale implementation.', tags: ['coding','terminal','anthropic'], featured: true },
  { name: 'Cursor', url: 'https://cursor.com/', summary: 'AI-native development environment with cloud agents and multi-model workflows.', tags: ['coding','ide','agents'], featured: true },
  { name: 'Devin Desktop', url: 'https://devin.ai/desktop', summary: 'Command center and IDE for local and cloud coding agents.', tags: ['coding','ide','agents'], featured: true },
  { name: 'Google Antigravity', url: 'https://antigravity.google/', summary: 'Agentic development environment for multi-agent software and browser workflows.', tags: ['coding','agents','google'], featured: true },
  { name: 'Grok 4.6', url: 'https://x.ai/', summary: 'xAI frontier model for interactive and long-running agentic workflows.', tags: ['frontier','xai','agents'] },
  { name: 'GitHub Copilot Coding Agent', url: 'https://github.com/features/copilot', summary: 'Delegated coding agent integrated with GitHub issues and pull requests.', tags: ['coding','github','agents'] },
  { name: 'Manus', url: 'https://manus.im/', summary: 'General-purpose delegated agent for research, creation and execution.', tags: ['agents','research','automation'] },
  { name: 'OpenHands', url: 'https://www.all-hands.dev/', summary: 'Open platform for software-development agents.', tags: ['agents','coding','open-source'] },
  { name: 'Replit Agent', url: 'https://replit.com/ai', summary: 'Natural-language application building and deployment in the cloud.', tags: ['agents','coding','app-builder'] },
  { name: 'OpenCode', url: 'https://opencode.ai/', summary: 'Open-source terminal coding agent with flexible model support.', tags: ['coding','terminal','open-source'] },
  { name: 'Kimi', url: 'https://www.kimi.com/', summary: 'AI assistant for research, documents, presentations and complex tasks.', tags: ['assistant','research','long-context'] },
];

const retired = new Set(['Gemini CLI', 'Windsurf', 'GitHub Jobs']);
const base = currentAIDirectory.map(c => c.id === 'automation' ? { ...c, tools: [...c.tools, ...automationTools] } : c);
const categories = [...base, ...currentAIAdditions, { id: 'frontier-current', name: 'Frontier Models & Agent Platforms', description: 'Current frontier models and agent products, refreshed for August 2026.', tools: frontierTools }]
  .map(c => ({ ...c, tools: c.tools.filter(t => !retired.has(t.name)) }))
  .filter(c => c.tools.length);

function hue(s: string) { let n = 0; for (const c of s) n = (n * 33 + c.charCodeAt(0)) % 360; return n; }

function Mark({ tool }: { tool: CurrentAITool }) {
  const h = hue(tool.name);
  const initials = tool.name.split(/\s+/).slice(0, 2).map(x => x[0]).join('').toUpperCase();
  return (
    <div className="relative h-24 overflow-hidden border-b border-white/10" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 15% 20%, hsla(${h},90%,65%,.34), transparent 34%), radial-gradient(circle at 90% 75%, hsla(${(h + 95) % 360},85%,60%,.20), transparent 40%), linear-gradient(135deg,#17191e,#0b0d10)` }} />
      <svg className="absolute inset-0 h-full w-full opacity-25" viewBox="0 0 600 180" preserveAspectRatio="none">
        <defs><pattern id={`p-${tool.name.replace(/[^a-z0-9]/gi,'')}`} width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="white" strokeOpacity=".16" /></pattern></defs>
        <rect width="600" height="180" fill="url(#p-{tool.name.replace(/[^a-z0-9]/gi,'')})" />
      </svg>
      <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[9px] font-medium text-white/70 backdrop-blur">AI TOOL</div>
      <div className="absolute bottom-3 left-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white text-[12px] font-bold tracking-tight text-black shadow-xl">{initials}</div>
      {tool.featured && <span className="absolute bottom-4 right-4 rounded-full bg-white px-2.5 py-1 text-[9px] font-semibold text-black">Featured</span>}
    </div>
  );
}

export function ReliableAiTools() {
  const [q, setQ] = useState('');
  const [list, setList] = useState(false);
  const term = q.trim().toLowerCase();
  const filtered = useMemo(() => categories.map(c => ({ ...c, tools: c.tools.filter(t => !term || `${c.name} ${c.description} ${t.name} ${t.summary} ${t.tags.join(' ')}`.toLowerCase().includes(term)) })).filter(c => c.tools.length), [term]);
  const count = filtered.reduce((n,c) => n + c.tools.length, 0);
  const total = categories.reduce((n,c) => n + c.tools.length, 0);

  return <main className="min-h-[calc(100vh-64px)] bg-[#090a0c] text-white">
    <div className="mx-auto max-w-[1640px] px-4 py-6 md:px-8 md:py-8">
      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111318] p-6 shadow-[0_24px_70px_rgba(0,0,0,.30)] md:p-10">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(circle at 82% 20%, rgba(255,205,60,.13), transparent 24%), radial-gradient(circle at 64% 90%, rgba(80,120,255,.12), transparent 30%)' }} />
        <div className="relative max-w-4xl">
          <div className="mb-5 flex flex-wrap gap-2"><span className="inline-flex items-center rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-black"><Sparkles className="mr-1.5 h-3 w-3"/>Refreshed Aug 2026</span><span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] text-white/65">{categories.length} categories</span><span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] text-white/65">{total}+ tools</span></div>
          <h1 className="text-4xl font-semibold tracking-[-.04em] md:text-6xl">AI Intelligence</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/55 md:text-base">Current frontier models, coding agents, automation, research, creative tools and production AI infrastructure — organized without clutter.</p>
          <div className="relative mt-6 max-w-3xl"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35"/><input value={q} maxLength={120} onChange={e=>setQ(e.target.value)} placeholder="Search models, agents, coding, research, automation..." className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 pl-11 pr-11 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25" aria-label="Search AI tools"/>{q && <button onClick={()=>setQ('')} className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-white/45 hover:bg-white/10 hover:text-white" aria-label="Clear search"><X className="h-4 w-4"/></button>}</div>
        </div>
      </section>
      <div className="mt-6 flex items-center justify-between border-b border-white/10 pb-4"><span className="text-xs text-white/40">{count} tools shown</span><div className="flex rounded-xl border border-white/10 bg-white/[.03] p-1"><button onClick={()=>setList(false)} className={`rounded-lg p-2 ${!list?'bg-white text-black':'text-white/45'}`} aria-label="Grid view"><Grid2X2 className="h-3.5 w-3.5"/></button><button onClick={()=>setList(true)} className={`rounded-lg p-2 ${list?'bg-white text-black':'text-white/45'}`} aria-label="List view"><List className="h-3.5 w-3.5"/></button></div></div>
      <div className="mt-8 space-y-10">{filtered.map(c => <section key={c.id} className="overflow-hidden rounded-[22px] border border-white/10 bg-[#0d0f12]"><header className="border-b border-white/10 bg-white/[.025] px-5 py-5 md:px-6"><h2 className="text-lg font-semibold tracking-tight">{c.name}</h2><p className="mt-1 max-w-3xl text-xs leading-5 text-white/40">{c.description}</p></header><div className={list?'divide-y divide-white/10':'grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3'}>{c.tools.map(t => <article key={`${c.id}-${t.name}`} className={list?'flex min-w-0 gap-4 p-4':'overflow-hidden rounded-2xl border border-white/10 bg-[#111317] shadow-[0_12px_35px_rgba(0,0,0,.16)]'}><div className={list?'w-44 shrink-0 overflow-hidden rounded-xl border border-white/10':''}>{<Mark tool={t}/>}</div><div className="min-w-0 flex-1 p-4"><div className="flex items-start gap-3"><h3 className="min-w-0 flex-1 text-sm font-semibold leading-5">{t.name}</h3><ArrowUpRight className="h-4 w-4 shrink-0 text-white/30"/></div><p className="mt-1 line-clamp-2 text-[11px] leading-5 text-white/50">{t.summary}</p><div className="mt-3 flex flex-wrap gap-1.5">{t.tags.slice(0,3).map(tag=><span key={tag} className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] text-white/40">{tag}</span>)}</div><a href={t.url} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-[11px] text-white/65 hover:border-white/25 hover:bg-white/5 hover:text-white">Open official site <ExternalLink className="h-3 w-3"/></a></div></article>)}</div></section>)}{!filtered.length&&<div className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-sm text-white/40">No AI tools matched “{q}”.</div>}</div>
    </div>
  </main>;
}
