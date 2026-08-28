'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Archive, ArrowUpRight, CheckCircle2, CircleAlert, Clock3, Filter, FolderKanban, LayoutGrid, List, Plus, RefreshCw, Search, Sparkles, Target, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Project = {
  id: string; name: string; description: string; people: string[]; organization: string; role: string;
  priority: string; status: string; progress: number; phase: string; nextAction: string;
  blockers: string[]; updatedAt: string;
};

const statuses = ['all', 'idea', 'planning', 'in-progress', 'blocked', 'testing', 'completed', 'archived'];
const priorities = ['all', 'P0', 'P1', 'P2', 'P3'];
const statusLabels: Record<string, string> = { idea: 'Idea', planning: 'Planning', 'in-progress': 'In progress', blocked: 'Blocked', testing: 'Testing', completed: 'Completed', archived: 'Archived' };

function toneForStatus(status: string) {
  if (status === 'completed') return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
  if (status === 'blocked') return 'border-red-500/30 bg-red-500/10 text-red-300';
  if (status === 'in-progress') return 'border-sky-500/30 bg-sky-500/10 text-sky-300';
  if (status === 'testing') return 'border-violet-500/30 bg-violet-500/10 text-violet-300';
  return 'border-white/10 bg-white/[0.04] text-muted-foreground';
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [priority, setPriority] = useState('P2');
  const [status, setStatus] = useState('idea');
  const [filter, setFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('priority');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [error, setError] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  async function load() {
    setLoading(true); setError('');
    try {
      const r = await fetch('/api/projects', { cache: 'no-store' });
      if (!r.ok) throw new Error(r.status === 401 ? 'Please log in to access your projects.' : 'Unable to load projects');
      setProjects(await r.json());
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to load projects'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function add() {
    if (!name.trim()) { setError('Give the project a name first.'); return; }
    setError('');
    try {
      const r = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name.trim(), priority, status }) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Unable to create project');
      setProjects(p => [data, ...p]); setName(''); setShowQuickAdd(false);
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to create project'); }
  }

  async function archive(id: string) {
    if (!confirm('Archive this project? It will remain in history and will not be permanently deleted.')) return;
    const r = await fetch('/api/projects/archive', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (r.ok) load(); else setError('Unable to archive project');
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rank: Record<string, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return projects
      .filter(p => filter === 'all' || p.status === filter)
      .filter(p => priorityFilter === 'all' || p.priority === priorityFilter)
      .filter(p => !q || `${p.name} ${p.description} ${p.organization} ${p.role} ${p.people?.join(' ') || ''} ${p.nextAction}`.toLowerCase().includes(q))
      .sort((a, b) => sort === 'progress' ? b.progress - a.progress : sort === 'updated' ? String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')) : rank[a.priority] - rank[b.priority]);
  }, [projects, filter, priorityFilter, query, sort]);

  const active = projects.filter(p => p.status !== 'archived' && p.status !== 'completed');
  const completed = projects.filter(p => p.status === 'completed');
  const blocked = projects.filter(p => p.status === 'blocked');
  const urgent = projects.filter(p => (p.priority === 'P0' || p.priority === 'P1') && p.status !== 'completed' && p.status !== 'archived');
  const averageProgress = projects.length ? Math.round(projects.reduce((s, p) => s + Math.max(0, Math.min(100, p.progress || 0)), 0) / projects.length) : 0;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1400px] space-y-6 p-4 md:p-8">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-card via-card to-primary/5 p-6 md:p-8">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-primary"><FolderKanban className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-[0.2em]">Project Command Center</span></div>
              <h1 className="max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">Your entire build life, <span className="text-primary">under control.</span></h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">Projects, people, priorities, blockers, milestones and next actions — organized so you always know what matters now.</p>
            </div>
            <div className="flex shrink-0 gap-2"><Button onClick={() => setShowQuickAdd(v => !v)}><Plus className="mr-2 h-4 w-4" />New project</Button><Button variant="outline" onClick={load}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button></div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ['Active', active.length, Clock3, 'Keep moving'],
            ['High priority', urgent.length, Target, 'P0 / P1'],
            ['Blocked', blocked.length, CircleAlert, 'Needs attention'],
            ['Completed', completed.length, CheckCircle2, 'Shipped'],
            ['Avg. progress', `${averageProgress}%`, Sparkles, 'Across history'],
          ].map(([label, value, Icon, hint]) => <Card key={String(label)} className="border-white/10 bg-card/70"><CardContent className="p-4"><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">{label as string}</span><Icon className="h-4 w-4 text-primary" /></div><div className="mt-2 text-2xl font-bold">{value as string}</div><div className="mt-1 text-[11px] text-muted-foreground">{hint as string}</div></CardContent></Card>)}
        </section>

        {showQuickAdd && <Card className="border-primary/30 bg-primary/[0.04]"><CardHeader className="pb-3"><div className="flex items-center justify-between"><div><CardTitle className="text-base">Start something new</CardTitle><p className="mt-1 text-xs text-muted-foreground">Create the project shell now; fill its deeper workspace after opening it.</p></div><Button size="icon" variant="ghost" onClick={() => setShowQuickAdd(false)} aria-label="Close"><X className="h-4 w-4" /></Button></div></CardHeader><CardContent className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]"><Input autoFocus value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} placeholder="Project name — e.g. StreamEarn v2" /><select value={priority} onChange={e => setPriority(e.target.value)} className="h-10 rounded-md border bg-background px-3 text-sm"><option>P0</option><option>P1</option><option>P2</option><option>P3</option></select><select value={status} onChange={e => setStatus(e.target.value)} className="h-10 rounded-md border bg-background px-3 text-sm">{statuses.slice(1, -1).map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}</select><Button onClick={add}><Plus className="mr-2 h-4 w-4" />Create</Button></CardContent></Card>}

        <section className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-card/50 p-3 md:flex-row md:items-center">
          <div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search projects, people, organizations, next actions…" className="border-white/10 bg-background/70 pl-9" /></div>
          <div className="flex flex-wrap gap-2"><select value={filter} onChange={e => setFilter(e.target.value)} className="h-10 rounded-md border bg-background px-3 text-sm"><option value="all">All statuses</option>{statuses.slice(1).map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}</select><select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="h-10 rounded-md border bg-background px-3 text-sm">{priorities.map(p => <option key={p}>{p === 'all' ? 'All priorities' : p}</option>)}</select><select value={sort} onChange={e => setSort(e.target.value)} className="h-10 rounded-md border bg-background px-3 text-sm"><option value="priority">Sort: priority</option><option value="progress">Sort: progress</option><option value="updated">Sort: recently updated</option></select><Button variant={view === 'grid' ? 'secondary' : 'outline'} size="icon" onClick={() => setView('grid')} aria-label="Grid view"><LayoutGrid className="h-4 w-4" /></Button><Button variant={view === 'list' ? 'secondary' : 'outline'} size="icon" onClick={() => setView('list')} aria-label="List view"><List className="h-4 w-4" /></Button></div>
        </section>

        {error && <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>}

        <div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold">Your portfolio</h2><p className="text-xs text-muted-foreground">Showing {visible.length} of {projects.length} projects</p></div><div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex"><Filter className="h-3.5 w-3.5" /> Filters are instant and local</div></div>

        {loading ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[1,2,3].map(i => <Card key={i} className="h-48 animate-pulse border-white/10" />)}</div> : visible.length === 0 ? <Card className="border-dashed border-white/15"><CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center"><div className="rounded-2xl bg-primary/10 p-4"><FolderKanban className="h-8 w-8 text-primary" /></div><h3 className="mt-4 text-lg font-semibold">{projects.length ? 'Nothing matches your view' : 'Your command center is ready'}</h3><p className="mt-2 max-w-md text-sm text-muted-foreground">{projects.length ? 'Try clearing a filter or searching for a different project.' : 'Create your first project and start tracking the people, work, blockers and next actions that matter.'}</p>{projects.length === 0 && <Button className="mt-5" onClick={() => setShowQuickAdd(true)}><Plus className="mr-2 h-4 w-4" />Create your first project</Button>}</CardContent></Card> : view === 'list' ? <div className="overflow-hidden rounded-2xl border border-white/10 bg-card"><div className="grid grid-cols-[1.6fr_.8fr_.7fr_.8fr_1fr_auto] gap-3 border-b border-white/10 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"><span>Project</span><span>Status</span><span>Priority</span><span>Progress</span><span>Next action</span><span /></div>{visible.map(p => <div key={p.id} className="grid grid-cols-[1.6fr_.8fr_.7fr_.8fr_1fr_auto] items-center gap-3 border-b border-white/5 px-4 py-4 last:border-0"><Link href={`/projects/${p.id}`} className="min-w-0"><div className="truncate text-sm font-semibold hover:text-primary">{p.name}</div><div className="truncate text-[11px] text-muted-foreground">{p.organization || 'Independent'}{p.people?.length ? ` · ${p.people.join(', ')}` : ''}</div></Link><span className={`w-fit rounded-full border px-2 py-1 text-[10px] ${toneForStatus(p.status)}`}>{statusLabels[p.status] || p.status}</span><span className="text-xs font-semibold">{p.priority}</span><div><div className="mb-1 text-[10px] text-muted-foreground">{p.progress}%</div><div className="h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(0, Math.min(100, p.progress || 0))}%` }} /></div></div><span className="truncate text-xs text-muted-foreground">{p.nextAction || 'No next action set'}</span>{p.status !== 'archived' && <Button size="icon" variant="ghost" onClick={() => archive(p.id)} aria-label={`Archive ${p.name}`}><Archive className="h-4 w-4" /></Button>}</div>)}</div> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visible.map(p => <Card key={p.id} className={`group overflow-hidden border-white/10 bg-card/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 ${p.status === 'archived' ? 'opacity-60' : ''}`}><CardHeader className="p-5 pb-3"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="mb-2 flex flex-wrap gap-1.5"><span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">{p.priority}</span><span className={`rounded-full border px-2 py-1 text-[10px] ${toneForStatus(p.status)}`}>{statusLabels[p.status] || p.status}</span></div><CardTitle className="truncate text-base"><Link href={`/projects/${p.id}`} className="hover:text-primary">{p.name}</Link></CardTitle><p className="mt-1 truncate text-xs text-muted-foreground">{p.organization || 'Independent'} · {p.role || 'Owner'}</p></div>{p.status !== 'archived' && <Button size="icon" variant="ghost" className="opacity-60 transition-opacity group-hover:opacity-100" onClick={() => archive(p.id)} aria-label={`Archive ${p.name}`}><Archive className="h-4 w-4" /></Button>}</div></CardHeader><CardContent className="space-y-4 p-5 pt-0"><div><div className="mb-1.5 flex items-center justify-between text-[11px]"><span className="text-muted-foreground">Delivery progress</span><span className="font-semibold">{p.progress || 0}%</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.max(0, Math.min(100, p.progress || 0))}%` }} /></div></div><div className="grid grid-cols-2 gap-2 text-xs"><div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5"><div className="text-[10px] uppercase tracking-wide text-muted-foreground">Phase</div><div className="mt-1 truncate font-medium">{p.phase || 'Not set'}</div></div><div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5"><div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground"><Users className="h-3 w-3" /> People</div><div className="mt-1 truncate font-medium">{p.people?.length ? p.people.join(', ') : 'Solo'}</div></div></div><div className="rounded-lg border border-white/5 bg-white/[0.02] p-3"><div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Next action</div><div className="mt-1 line-clamp-2 text-xs leading-5">{p.nextAction || 'Set the next concrete action in the project workspace.'}</div></div>{p.blockers?.length > 0 && <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-300"><CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span><b>Blocked:</b> {p.blockers.join(', ')}</span></div>}<Link href={`/projects/${p.id}`} className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold transition hover:border-primary/30 hover:bg-primary/5">Open workspace <ArrowUpRight className="h-3.5 w-3.5" /></Link></CardContent></Card>)}</div>}
      </div>
    </main>
  );
}
