'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Grid2X2, List, Network, Newspaper, Search, Sparkles, X, ArrowUpRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { currentAIDirectory, type CurrentAICategory, type CurrentAITool } from '@/lib/current-ai-directory';
import { currentAIAdditions } from '@/lib/current-ai-additions';

const automationTools: CurrentAITool[] = [
  { name: 'n8n', url: 'https://n8n.io/', summary: 'Visual workflow automation with AI nodes, code steps and a self-hosting path.', tags: ['automation','workflow','self-hosted'], featured: true },
  { name: 'Zapier', url: 'https://zapier.com/', summary: 'Broad app automation with AI workflows, agents and MCP connectivity.', tags: ['automation','no-code','integrations'], featured: true },
  { name: 'Make', url: 'https://www.make.com/', summary: 'Visual scenarios with branching, transformations and AI workflow capabilities.', tags: ['automation','visual','workflow'] },
  { name: 'Gumloop', url: 'https://www.gumloop.com/', summary: 'AI-native workflows for research, data processing and agentic automation.', tags: ['ai-automation','agents','research'] },
  { name: 'Relevance AI', url: 'https://relevanceai.com/', summary: 'AI agents and workforces for repeatable business operations.', tags: ['agents','automation','workforce'] },
  { name: 'Lindy', url: 'https://www.lindy.ai/', summary: 'Assistant-style automation for recurring personal and business work.', tags: ['automation','assistants','agents'] },
  { name: 'Microsoft Power Automate', url: 'https://www.microsoft.com/en-us/power-platform/products/power-automate', summary: 'Enterprise workflow and desktop automation across Microsoft ecosystems.', tags: ['automation','enterprise','rpa'] },
  { name: 'UiPath', url: 'https://www.uipath.com/', summary: 'Enterprise RPA and agentic automation for UI-driven processes.', tags: ['rpa','enterprise','automation'] },
  { name: 'Relay.app', url: 'https://relay.app/', summary: 'Human-in-the-loop workflows with approvals and AI steps.', tags: ['automation','workflow','approvals'] },
];

const frontierTools: CurrentAITool[] = [
  { name: 'GPT-5.6 Sol', url: 'https://openai.com/index/gpt-5-6/', summary: 'OpenAI flagship frontier model for coding, knowledge work, cybersecurity, science, computer use and design.', tags: ['frontier','openai','coding','reasoning'], featured: true },
  { name: 'OpenAI Codex', url: 'https://openai.com/codex/', summary: 'Agentic software engineering surface for repository work, coding, testing and longer-running tasks.', tags: ['agents','coding','openai'], featured: true },
  { name: 'Claude Opus 5', url: 'https://www.anthropic.com/news/claude-opus-5', summary: 'Anthropic frontier model for demanding coding, knowledge work and proactive assistance.', tags: ['frontier','anthropic','coding','reasoning'], featured: true },
  { name: 'Claude Code', url: 'https://www.anthropic.com/claude-code', summary: 'Terminal-native coding agent for repository-scale implementation, debugging and delivery.', tags: ['coding','terminal','anthropic'], featured: true },
  { name: 'Cursor', url: 'https://cursor.com/', summary: 'AI-native development environment with cloud agents, builds and multi-model workflows.', tags: ['coding','ide','agents'], featured: true },
  { name: 'Devin Desktop', url: 'https://devin.ai/desktop', summary: 'Agent command center and IDE for managing local and cloud coding agents; the current successor to Windsurf.', tags: ['coding','ide','agents'], featured: true },
  { name: 'Google Antigravity', url: 'https://antigravity.google/', summary: 'Google agentic development environment for multi-agent software and browser workflows.', tags: ['coding','agents','google'], featured: true },
  { name: 'Grok 4.6', url: 'https://x.ai/', summary: 'Current xAI frontier model used for long-running agentic and interactive workflows.', tags: ['frontier','xai','agents'] },
  { name: 'GitHub Copilot Coding Agent', url: 'https://github.com/features/copilot', summary: 'Delegated coding agent integrated with GitHub issues, repositories, tests and pull requests.', tags: ['coding','github','agents'] },
  { name: 'Manus', url: 'https://manus.im/', summary: 'General-purpose delegated agent for research, creation and multi-step execution.', tags: ['agents','automation','research'] },
  { name: 'Genspark', url: 'https://www.genspark.ai/', summary: 'Agentic research, creation and task execution across a broad AI workspace.', tags: ['agents','research','creation'] },
  { name: 'OpenHands', url: 'https://www.all-hands.dev/', summary: 'Open platform for software-development agents with an open-source path.', tags: ['agents','coding','open-source'] },
  { name: 'Replit Agent', url: 'https://replit.com/ai', summary: 'Natural-language application building, iteration and deployment in the cloud.', tags: ['agents','coding','app-builder'] },
  { name: 'OpenCode', url: 'https://opencode.ai/', summary: 'Open-source terminal coding agent with flexible model support.', tags: ['coding','terminal','open-source'] },
  { name: 'Kimi', url: 'https://www.kimi.com/', summary: 'General AI assistant for research, documents, presentations and complex tasks.', tags: ['assistant','research','long-context'] },
];

const staleNames = new Set(['Gemini CLI', 'Windsurf', 'GitHub Jobs']);
const rawDirectory = currentAIDirectory.map(c => c.id === 'automation' ? { ...c, tools: [...c.tools, ...automationTools] } : c).concat(currentAIAdditions, [{ id: 'frontier-current', name: 'Frontier Models & Agent Platforms', description: 'Current frontier models and agent products, refreshed for August 2026.', tools: frontierTools }]);
const allDirectory: CurrentAICategory[] = rawDirectory.map(category => ({ ...category, tools: category.tools.filter(tool => !staleNames.has(tool.name)) })).filter(category => category.tools.length);

function hueFor(text: string) { let n = 0; for (const ch of text) n = (n * 31 + ch.charCodeAt(0)) % 360; return n; }

function ToolVisual({ tool, category }: { tool: CurrentAITool; category: string }) {
  const hue = hueFor(tool.name);
  return <div className="relative h-28 overflow-hidden border-b bg-[#101114]">
    <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 18% 20%, hsla(${hue},85%,65%,.30), transparent 36%), radial-gradient(circle at 85% 70%, hsla(${(hue + 80) % 360},75%,55%,.18), transparent 40%), linear-gradient(135deg, #15171b, #0b0c0f)` }} />
    <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.055) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[9px] font-medium text-white/75 backdrop-blur">{category}</div>
    <div className="absolute bottom-3 left-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/95 shadow-lg">
      <span className="text-lg font-bold text-black/70">{tool.name.slice(0,1)}</span>
    </div>
    {tool.featured && <Badge className="absolute bottom-4 right-4 rounded-full bg-white px-2.5 py-1 text-[9px] font-semibold text-black hover:bg-white">Featured</Badge>}
  </div>;
}

function ToolCard({ tool, category, list }: { tool: CurrentAITool; category: string; list: boolean }) {
  return <article className={`group overflow-hidden rounded-2xl border border-white/10 bg-[#0e0f11] shadow-[0_12px_35px_rgba(0,0,0,.18)] transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-[#111317] ${list ? 'flex min-h-[112px]' : ''}`}>
    <ToolVisual tool={tool} category={category} />
    <div className="min-w-0 flex-1 p-4"><div className="flex items-start gap-3"><div className="min-w-0 flex-1"><h3 className="truncate text-[15px] font-semibold tracking-tight text-white">{tool.name}</h3><p className="mt-1 line-clamp-2 text-[11px] leading-5 text-white/55">{tool.summary}</p></div><ArrowUpRight className="h-4 w-4 shrink-0 text-white/35 transition group-hover:text-white/75" /></div><div className="mt-3 flex flex-wrap gap-1.5">{tool.tags.slice(0, 3).map(tag => <Badge key={tag} variant="outline" className="border-white/15 bg-transparent px-2 py-0.5 text-[9px] font-normal text-white/55">{tag}</Badge>)}</div><a href={tool.url} target="_blank" rel="noopener noreferrer" className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-[11px] font-medium text-white/75 transition hover:border-white/30 hover:bg-white/5 hover:text-white">Open official site <ExternalLink className="h-3 w-3" /></a></div>
  </article>;
}

export function EnhancedAiToolsContent() {
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'grid'|'list'>('grid');
  const normalized = query.trim().toLowerCase();
  const categories = useMemo(() => allDirectory.map(c => ({ ...c, tools: c.tools.filter(t => !normalized || [t.name, t.summary, ...t.tags, c.name, c.description].join(' ').toLowerCase().includes(normalized)) })).filter(c => c.tools.length), [normalized]);
  const count = allDirectory.reduce((n,c)=>n+c.tools.length,0);
  const visibleCount = categories.reduce((n,c)=>n+c.tools.length,0);
  
  return (
    <div className="overflow-x-hidden">
      <div className="mx-auto w-full max-w-[1640px] px-4 py-6 md:px-8 md:py-10">
        <div className="space-y-8">
          <section className="relative isolate overflow-hidden rounded-[28px] border border-white/10 bg-[#101216] p-6 shadow-[0_25px_80px_rgba(0,0,0,.35)] md:p-10">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 82% 22%, rgba(255,210,55,.14), transparent 24%), radial-gradient(circle at 65% 80%, rgba(95,120,255,.13), transparent 28%), linear-gradient(135deg,#15171c,#0d0e11 55%,#101216)' }} />
              {/* Removed heavy mask-image grid and orbits for mobile performance */}
              <div className="hidden md:block absolute inset-0 opacity-30" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px)', backgroundSize: '32px 32px', maskImage: 'radial-gradient(circle at 78% 45%,black,transparent 62%)'}} />
            </div>
            <div className="relative max-w-4xl space-y-5">
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-full bg-white text-black hover:bg-white"><Sparkles className="mr-1 h-3 w-3"/>Refreshed Aug 2026</Badge>
                <Badge variant="secondary" className="rounded-full bg-white/10 text-white/75">{allDirectory.length} categories</Badge>
                <Badge variant="secondary" className="rounded-full bg-white/10 text-white/75">{count}+ tools</Badge>
              </div>
              <div>
                <h1 className="text-4xl font-semibold tracking-[-.035em] md:text-6xl">AI Intelligence</h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/55 md:text-base">A curated, current directory of frontier models, coding agents, research tools, automation, creative platforms and production AI infrastructure.</p>
              </div>
              <div className="relative max-w-3xl">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"/>
                <Input value={query} onChange={e => setQuery(e.target.value.slice(0,120))} placeholder="Search tools, agents, models, research, coding, automation..." className="h-12 rounded-2xl border-white/10 bg-black/30 pl-11 pr-11 text-white placeholder:text-white/30" aria-label="Search AI tools and categories" />
                {query && <Button size="icon" variant="ghost" onClick={() => setQuery('')} className="absolute right-1 top-1/2 h-10 w-10 -translate-y-1/2 rounded-xl text-white/60 hover:bg-white/10 hover:text-white" aria-label="Clear search"><X className="h-4 w-4"/></Button>}
              </div>
            </div>
          </section>
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 text-xs text-white/45">
            <span>{visibleCount} tools shown</span>
            <div className="flex items-center gap-3">
              <Link href="/news" className="hidden items-center gap-1.5 text-white/60 hover:text-white md:inline-flex"><Newspaper className="h-3.5 w-3.5"/>Latest AI News</Link>
              <div className="flex gap-1 rounded-xl border border-white/10 bg-white/[.03] p-1">
                <Button size="sm" variant={view==='grid'?'default':'ghost'} onClick={()=>setView('grid')} aria-label="Grid view" className="h-8 rounded-lg"><Grid2X2 className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant={view==='list'?'default':'ghost'} onClick={()=>setView('list')} aria-label="List view" className="h-8 rounded-lg"><List className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          </div>
          <div className="space-y-10">{categories.map((category, categoryIndex) => <CategorySection key={category.id} category={category} index={categoryIndex} list={view==='list'} />)}</div>
          {!categories.length && <div className="rounded-2xl border border-dashed border-white/15 bg-white/[.02] p-12 text-center text-sm text-white/45">No tools matched &quot;{query}&quot;. Try a capability such as agents, coding, research or automation.</div>}
        </div>
      </div>
    </div>
  );
}

function CategorySection({ category, index, list }: { category: CurrentAICategory; index: number; list: boolean }) {
  const hue = hueFor(category.name);
  return <section id={category.id} className="overflow-hidden rounded-[22px] border border-white/10 bg-[#0d0f12] shadow-[0_20px_60px_rgba(0,0,0,.18)]">
    <div className="relative overflow-hidden border-b border-white/10 px-5 py-5 md:px-6" style={{ background: `radial-gradient(circle at 80% 20%, hsla(${hue},70%,55%,.13), transparent 35%), linear-gradient(135deg,#15171b,#0d0f12)` }}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[.22em] text-white/35">AI Directory</p>
          <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">{category.name}</h2>
          <p className="mt-1 max-w-3xl text-xs leading-5 text-white/45">{category.description}</p>
        </div>
        <span className="hidden rounded-full border border-white/10 bg-white/[.03] px-3 py-1 text-[10px] text-white/40 sm:inline-flex">{category.tools.length} tools</span>
      </div>
    </div>
    <div className={list ? 'space-y-3 p-4 md:p-5' : 'grid gap-4 p-4 md:grid-cols-2 md:p-5 xl:grid-cols-3'}>
      {category.tools.map((tool, toolIndex) => <ToolCard key={`${category.id}-${tool.name}-${toolIndex}`} tool={tool} category={category.name} list={list} />)}
    </div>
  </section>;
}
