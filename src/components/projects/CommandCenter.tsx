'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Archive, Download, ExternalLink, LayoutGrid, Link2, List, Plus, Search, Users, X } from 'lucide-react';

type Project = {
  id: string; name: string; description?: string; status: string; priority?: string; progress?: number;
  nextAction?: string; people?: string[]; organization?: string; role?: string; phase?: string;
  blockers?: string[]; repository?: string; liveUrl?: string; techStack?: string[]; startDate?: string;
  targetDate?: string; createdAt?: string; updatedAt?: string; notes?: string[];
};

type FormState = {
  name: string; description: string; status: string; priority: string; progress: string; nextAction: string;
  people: string; organization: string; role: string; phase: string; techStack: string;
  repository: string; liveUrl: string; notes: string;
};

const blank: FormState = {
  name: '', description: '', status: 'planning', priority: 'P1', progress: '0', nextAction: '',
  people: '', organization: '', role: '', phase: '', techStack: '', repository: '', liveUrl: '', notes: '',
};

const stages = [
  ['all', 'All'], ['idea', 'Idea'], ['planning', 'Planning'], ['in-progress', 'In progress'],
  ['blocked', 'Blocked'], ['testing', 'Testing'], ['completed', 'Completed'], ['archived', 'Archived'],
];
const priorities = [['all', 'All priority'], ['P0', 'Critical'], ['P1', 'High'], ['P2', 'Medium'], ['P3', 'Low']];
const colors: Record<string, string> = {
  idea: '#c9b896', planning: '#c9b896', 'in-progress': '#8fa88a', blocked: '#ff6b5a',
  testing: '#c9b896', completed: '#ff6b5a', archived: '#5a5550',
};
const label = (s: string) => stages.find(([key]) => key === s)?.[1] || s;
const priorityLabel = (s?: string) => priorities.find(([key]) => key === s)?.[1] || 'Medium';
const splitList = (value: string) => value.split(',').map((x) => x.trim()).filter(Boolean);
const splitLines = (value: string) => value.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
const age = (d?: string) => {
  if (!d) return 'Unknown';
  const n = Math.max(0, (Date.now() - new Date(d).getTime()) / 1000);
  if (n < 60) return 'just now';
  if (n < 3600) return `${Math.floor(n / 60)}m ago`;
  if (n < 86400) return `${Math.floor(n / 3600)}h ago`;
  if (n < 604800) return `${Math.floor(n / 86400)}d ago`;
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function CommandCenter() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [stage, setStage] = useState('all');
  const [priority, setPriority] = useState('all');
  const [view, setView] = useState<'cards' | 'list'>('cards');
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(blank);
  const [selected, setSelected] = useState<Project | null>(null);

  const setF = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const loadProjects = useCallback(async () => {
    try {
      const r = await fetch('/api/projects', { cache: 'no-store', credentials: 'same-origin' });
      const d = await r.json().catch(() => []);
      if (!r.ok) throw new Error(d?.error || `Unable to load projects (${r.status})`);
      setProjects(Array.isArray(d) ? d : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadProjects(); }, [loadProjects]);

  const create = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (saving) return;
    const name = form.name.trim();
    if (!name) { setError('Project name is required.'); return; }

    setSaving(true);
    setError('');
    try {
      const body = {
        ...form,
        name,
        progress: Math.min(100, Math.max(0, Number(form.progress) || 0)),
        people: splitList(form.people),
        techStack: splitList(form.techStack),
        notes: splitLines(form.notes),
      };
      const r = await fetch('/api/projects', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d?.error || `Project could not be created (${r.status})`);

      // Update the UI from the successful POST response immediately. Do not depend on a second GET.
      setProjects((current) => [d, ...current.filter((p) => p.id !== d.id)]);
      setSelected(d);
      setForm({ ...blank });
      setModal(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Project could not be created');
    } finally {
      setSaving(false);
    }
  };

  const archive = async () => {
    if (!selected || !confirm('Archive this project? It remains recoverable.')) return;
    try {
      const r = await fetch('/api/projects/archive', {
        method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selected.id }),
      });
      if (!r.ok) throw new Error('Unable to archive project');
      setProjects((p) => p.map((x) => x.id === selected.id ? { ...x, status: 'archived' } : x));
      setSelected(null);
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to archive project'); }
  };

  const stats = useMemo(() => ({
    ongoing: projects.filter((p) => p.status === 'in-progress').length,
    upcoming: projects.filter((p) => p.status === 'idea' || p.status === 'planning').length,
    later: projects.filter((p) => p.status === 'idea').length,
    completed: projects.filter((p) => p.status === 'completed').length,
  }), [projects]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rank: Record<string, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return projects
      .filter((p) => p.status !== 'archived')
      .filter((p) => stage === 'all' || p.status === stage)
      .filter((p) => priority === 'all' || p.priority === priority)
      .filter((p) => !q || [p.name, p.description, p.organization, p.role, p.phase, p.nextAction, p.repository, p.liveUrl, ...(p.people || []), ...(p.techStack || []), ...(p.notes || [])].join(' ').toLowerCase().includes(q))
      .sort((a, b) => (rank[a.priority || 'P3'] ?? 3) - (rank[b.priority || 'P3'] ?? 3));
  }, [projects, query, stage, priority]);

  const exportCSV = () => {
    const esc = (v: unknown) => `"${String(v ?? '').replaceAll('"', '""')}"`;
    const header = ['Name', 'Status', 'Priority', 'Progress', 'Organization', 'Role', 'Phase', 'People', 'Tech Stack', 'Repository', 'Live URL'];
    const rows = projects.map((p) => [p.name, p.status, p.priority, p.progress, p.organization, p.role, p.phase, (p.people || []).join('; '), (p.techStack || []).join('; '), p.repository, p.liveUrl].map(esc).join(','));
    const blob = new Blob([[header.join(','), ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `streamearn-projects-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0d0c0a] text-[#f5f0e8]">
      <div className="mx-auto min-h-screen max-w-7xl px-6">
        <header className="sticky top-0 z-30 -mx-6 border-b border-[#2a2622]/70 bg-[#0d0c0a]/95 px-6 py-3 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <div><h1 className="text-[14px] font-semibold">Project Command Center</h1><p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.2em] text-[#8a8478]">Memory · Tracking · Flow</p></div>
            <div className="flex gap-2">
              <button type="button" onClick={exportCSV} className="hidden rounded-lg px-2.5 py-1.5 text-[11px] text-[#d4cdc2] hover:bg-white/[0.03] sm:flex"><Download className="mr-1.5 h-3.5 w-3.5" />Export</button>
              <button type="button" onClick={() => { setError(''); setForm({ ...blank }); setModal(true); }} className="rounded-lg bg-[#ff6b5a] px-3 py-1.5 text-[11px] font-semibold text-[#0d0c0a]"><Plus className="mr-1 inline h-3.5 w-3.5" />New Project</button>
            </div>
          </div>
        </header>

        <section className="py-7 md:py-9">
          <div className="mb-6 max-w-2xl"><div className="mb-1.5 flex items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-[#ff6b5a]"><span className="h-px w-5 bg-[#ff6b5a]/50" />Command Center</div><h2 className="font-serif text-4xl italic leading-[.98] tracking-tight md:text-5xl">Everything you're building.</h2><p className="mt-2.5 max-w-lg text-xs leading-5 text-[#8a8478]">A quiet place to remember what you're building, who's building it with you, and what comes next.</p></div>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
            {[['01','Ongoing',stats.ongoing,'in-progress'],['02','Upcoming',stats.upcoming,'planning'],['03','Later',stats.later,'idea'],['04','Completed',stats.completed,'completed']].map(([n,t,c,s]) => <button type="button" key={n} onClick={() => setStage(String(s))} className="rounded-xl border border-[#2a2622] bg-[#161412]/80 p-4 text-left hover:border-[#ff6b5a]/35"><div className="mb-2 flex justify-between"><span className="font-serif text-2xl italic text-[#ff6b5a]/30">{n}</span><span className="h-1.5 w-1.5 rounded-full" style={{ background: colors[String(s)] }} /></div><div className="text-2xl font-semibold">{c}</div><div className="mt-0.5 text-[9px] uppercase tracking-wider text-[#8a8478]">{t}</div></button>)}
          </div>
        </section>

        <section className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">{[['all','All',projects.length],['in-progress','Ongoing',stats.ongoing],['planning','Upcoming',stats.upcoming],['idea','Later',stats.later],['completed','Completed',stats.completed]].map(([k,t,c]) => <button type="button" key={String(k)} onClick={() => setStage(String(k))} className={`rounded-lg border px-3 py-1.5 text-[11px] ${stage === String(k) ? 'border-[#ff6b5a]/35 bg-[#ff6b5a]/10' : 'border-[#2a2622] text-[#8a8478]'}`}>{t}<span className="ml-1 font-mono text-[9px] opacity-40">{c}</span></button>)}</div>
          <div className="flex gap-1.5"><div className="relative"><Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-[#5a5550]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className="w-44 rounded-lg border border-[#2a2622] bg-[#161412]/70 py-1.5 pl-8 pr-2.5 text-xs outline-none placeholder:text-[#5a5550]" /></div><button type="button" onClick={() => setView((v) => v === 'cards' ? 'list' : 'cards')} className="rounded-lg border border-[#2a2622] p-1.5 text-[#8a8478]">{view === 'cards' ? <List className="h-3.5 w-3.5" /> : <LayoutGrid className="h-3.5 w-3.5" />}</button></div>
        </section>

        {error && <div className="mb-4 rounded-lg border border-[#ff6b5a]/20 bg-[#ff6b5a]/[0.04] px-3 py-2.5 text-xs text-[#ff8a7d]">{error}</div>}
        <section className="pb-12"><div className="mb-4 flex items-end justify-between"><div><h2 className="text-sm font-semibold">Projects</h2><p className="mt-0.5 text-[10px] text-[#8a8478]">{visible.length} visible · {projects.length} total · directory details included</p></div><span className="hidden font-mono text-[8px] uppercase tracking-widest text-[#5a5550] md:block">Inline details · no navigation</span></div>
          {loading ? <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{[1,2,3,4,5,6].map((i) => <div key={i} className="h-48 animate-pulse rounded-xl border border-[#2a2622] bg-[#161412]/60" />)}</div> : view === 'cards' ? <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{visible.map((p) => <button type="button" key={p.id} onClick={() => setSelected(p)} className="rounded-xl border border-[#2a2622] bg-[#161412]/70 p-5 text-left hover:border-[#ff6b5a]/35"><div className="mb-3 flex items-start justify-between gap-3"><div className="min-w-0"><div className="mb-1.5 flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full" style={{ background: colors[p.status] || '#8a8478' }} /><span className="text-[9px] uppercase tracking-widest" style={{ color: colors[p.status] || '#8a8478' }}>{label(p.status)}</span></div><h3 className="truncate text-base font-semibold">{p.name}</h3></div><span className="rounded-full border border-[#2a2622] px-2 py-1 text-[8px] uppercase text-[#8a8478]">{priorityLabel(p.priority)}</span></div><div className="mb-3 flex justify-between text-[9px] uppercase tracking-wider text-[#8a8478]"><span>Progress</span><span>{p.progress || 0}%</span></div><div className="h-1 rounded-full bg-[#0a0908]"><div className="h-full rounded-full bg-[#ff6b5a]" style={{ width: `${Math.min(100, Math.max(0, Number(p.progress || 0)))}%` }} /></div>{p.nextAction && <div className="mt-3 rounded-lg border border-[#2a2622] bg-[#0a0908]/45 p-2.5"><div className="mb-1 text-[8px] uppercase tracking-widest text-[#8a8478]">Next</div><div className="truncate text-[11px] text-[#d4cdc2]">{p.nextAction}</div></div>}<div className="mt-3 flex items-center justify-between border-t border-[#2a2622]/70 pt-2.5 text-[9px] text-[#5a5550]"><span>{p.people?.length || 0} people{p.organization ? ` · ${p.organization}` : ''}</span><span>{age(p.updatedAt)}</span></div></button>)}</div> : <div className="overflow-x-auto rounded-xl border border-[#2a2622] bg-[#161412]/70"><table className="w-full min-w-[900px] text-left text-xs"><thead className="border-b border-[#2a2622] text-[10px] uppercase text-[#5a5550]"><tr>{['Project','Status','Priority','Progress','Directory','Next','Updated'].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead><tbody>{visible.map((p) => <tr key={p.id} onClick={() => setSelected(p)} className="cursor-pointer border-b border-[#2a2622]/70 hover:bg-white/[0.025]"><td className="p-3 font-medium">{p.name}</td><td className="p-3" style={{ color: colors[p.status] || '#8a8478' }}>{label(p.status)}</td><td className="p-3 text-[#8a8478]">{priorityLabel(p.priority)}</td><td className="p-3 font-mono">{p.progress || 0}%</td><td className="p-3 text-[#8a8478]">{p.organization || 'Solo'}</td><td className="max-w-[280px] truncate p-3">{p.nextAction || '—'}</td><td className="p-3 text-[#8a8478]">{age(p.updatedAt)}</td></tr>)}</tbody></table></div>}</section>
      </div>

      {modal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050504]/85 p-4 backdrop-blur-md" onMouseDown={(e) => { if (e.currentTarget === e.target && !saving) setModal(false); }}>
        <form onSubmit={(e) => void create(e)} className="max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-xl border border-[#2a2622] bg-[#161412] shadow-2xl" noValidate>
          <div className="flex items-start justify-between border-b border-[#2a2622] p-5"><div><h2 className="font-serif text-lg italic">New Project</h2><p className="mt-0.5 text-[10px] text-[#8a8478]">Capture what you're building.</p></div><button type="button" onClick={() => setModal(false)} disabled={saving} className="rounded-lg border border-[#2a2622] p-1.5"><X className="h-3.5 w-3.5" /></button></div>
          <div className="grid gap-3 p-5 md:grid-cols-2">
            <label className="md:col-span-2 text-[10px] text-[#8a8478]">Project Name<input autoFocus required value={form.name} onChange={(e) => setF('name', e.target.value)} className="mt-1 w-full rounded-lg border border-[#2a2622] bg-[#0d0c0a] px-3 py-2 text-xs outline-none focus:border-[#ff6b5a]/35" /></label>
            <label className="text-[10px] text-[#8a8478]">Organization<input value={form.organization} onChange={(e) => setF('organization', e.target.value)} className="mt-1 w-full rounded-lg border border-[#2a2622] bg-[#0d0c0a] px-3 py-2 text-xs" /></label>
            <label className="text-[10px] text-[#8a8478]">Your Role<input value={form.role} onChange={(e) => setF('role', e.target.value)} className="mt-1 w-full rounded-lg border border-[#2a2622] bg-[#0d0c0a] px-3 py-2 text-xs" /></label>
            <label className="md:col-span-2 text-[10px] text-[#8a8478]">Next Action<input value={form.nextAction} onChange={(e) => setF('nextAction', e.target.value)} className="mt-1 w-full rounded-lg border border-[#2a2622] bg-[#0d0c0a] px-3 py-2 text-xs" /></label>
            <label className="md:col-span-2 text-[10px] text-[#8a8478]">Repository / Folder<input value={form.repository} onChange={(e) => setF('repository', e.target.value)} className="mt-1 w-full rounded-lg border border-[#2a2622] bg-[#0d0c0a] px-3 py-2 text-xs" /></label>
            <label className="md:col-span-2 text-[10px] text-[#8a8478]">Live URL<input value={form.liveUrl} onChange={(e) => setF('liveUrl', e.target.value)} className="mt-1 w-full rounded-lg border border-[#2a2622] bg-[#0d0c0a] px-3 py-2 text-xs" /></label>
            <label className="text-[10px] text-[#8a8478]">People<textarea value={form.people} onChange={(e) => setF('people', e.target.value)} rows={2} placeholder="Comma-separated names" className="mt-1 w-full resize-none rounded-lg border border-[#2a2622] bg-[#0d0c0a] px-3 py-2 text-xs" /></label>
            <label className="text-[10px] text-[#8a8478]">Tech Stack<textarea value={form.techStack} onChange={(e) => setF('techStack', e.target.value)} rows={2} placeholder="Comma-separated tools" className="mt-1 w-full resize-none rounded-lg border border-[#2a2622] bg-[#0d0c0a] px-3 py-2 text-xs" /></label>
            <label className="md:col-span-2 text-[10px] text-[#8a8478]">Description<textarea value={form.description} onChange={(e) => setF('description', e.target.value)} rows={2} className="mt-1 w-full resize-none rounded-lg border border-[#2a2622] bg-[#0d0c0a] px-3 py-2 text-xs" /></label>
            <label className="md:col-span-2 text-[10px] text-[#8a8478]">Notes<textarea value={form.notes} onChange={(e) => setF('notes', e.target.value)} rows={2} placeholder="One note per line" className="mt-1 w-full resize-none rounded-lg border border-[#2a2622] bg-[#0d0c0a] px-3 py-2 text-xs" /></label>
            <label className="text-[10px] text-[#8a8478]">Status<select value={form.status} onChange={(e) => setF('status', e.target.value)} className="mt-1 w-full rounded-lg border border-[#2a2622] bg-[#0d0c0a] px-2.5 py-2 text-xs"><option value="idea">Idea</option><option value="planning">Planning</option><option value="in-progress">In progress</option><option value="blocked">Blocked</option><option value="testing">Testing</option><option value="completed">Completed</option></select></label>
            <label className="text-[10px] text-[#8a8478]">Priority<select value={form.priority} onChange={(e) => setF('priority', e.target.value)} className="mt-1 w-full rounded-lg border border-[#2a2622] bg-[#0d0c0a] px-2.5 py-2 text-xs"><option value="P0">Critical</option><option value="P1">High</option><option value="P2">Medium</option><option value="P3">Low</option></select></label>
            <label className="text-[10px] text-[#8a8478]">Progress<input type="number" min="0" max="100" value={form.progress} onChange={(e) => setF('progress', e.target.value)} className="mt-1 w-full rounded-lg border border-[#2a2622] bg-[#0d0c0a] px-2.5 py-2 text-xs" /></label>
          </div>
          <div className="flex justify-end gap-2 border-t border-[#2a2622] p-5"><button type="button" onClick={() => setModal(false)} disabled={saving} className="rounded-lg border border-[#2a2622] px-3.5 py-2 text-[11px]">Cancel</button><button type="submit" disabled={saving} className="rounded-lg bg-[#ff6b5a] px-3.5 py-2 text-[11px] font-semibold text-[#0d0c0a] disabled:cursor-wait disabled:opacity-50">{saving ? 'Creating…' : 'Create Project'}</button></div>
        </form>
      </div>}

      {selected && <div className="fixed inset-0 z-40 bg-[#050504]/85 p-3 backdrop-blur-md md:p-5" onMouseDown={(e) => { if (e.currentTarget === e.target) setSelected(null); }}><div className="mx-auto flex h-full max-w-4xl flex-col overflow-hidden rounded-xl border border-[#2a2622] bg-[#161412]"><div className="flex items-start justify-between border-b border-[#2a2622] p-5"><div><div className="text-[9px] uppercase tracking-widest" style={{ color: colors[selected.status] || '#8a8478' }}>{label(selected.status)} · {selected.organization || 'Independent'}</div><h2 className="mt-1.5 font-serif text-3xl italic">{selected.name}</h2><p className="mt-1 text-[10px] text-[#8a8478]">updated {age(selected.updatedAt)}</p></div><div className="flex gap-1.5"><button type="button" onClick={() => void archive()} className="rounded-lg border border-[#2a2622] p-1.5" title="Archive"><Archive className="h-3.5 w-3.5" /></button><button type="button" onClick={() => setSelected(null)} className="rounded-lg border border-[#2a2622] p-1.5"><X className="h-3.5 w-3.5" /></button></div></div><div className="flex-1 overflow-y-auto p-5"><div className="grid gap-4 lg:grid-cols-[1.4fr_.8fr]"><section className="rounded-xl border border-[#2a2622] bg-[#0d0c0a]/35 p-4"><div className="text-[9px] uppercase tracking-wider text-[#8a8478]">Project brief</div><p className="mt-2.5 text-xs leading-5 text-[#d4cdc2]">{selected.description || 'No project brief recorded yet.'}</p><div className="mt-4 rounded-xl border border-[#ff6b5a]/15 bg-[#ff6b5a]/[0.04] p-3"><div className="text-[9px] uppercase text-[#ff8a7d]">Next action</div><div className="mt-1 text-xs">{selected.nextAction || 'No next action set.'}</div></div></section><aside className="space-y-4"><section className="rounded-xl border border-[#2a2622] bg-[#0d0c0a]/35 p-4"><div className="mb-3 flex items-center gap-2 text-[9px] uppercase tracking-wider text-[#8a8478]"><Users className="h-3.5 w-3.5" />Directory details</div>{[['Organization', selected.organization], ['Role', selected.role], ['Phase', selected.phase], ['People', (selected.people || []).join(', ') || 'Solo project']].map(([k,v]) => <div key={String(k)} className="mb-3 text-[11px]"><div className="text-[8px] uppercase text-[#5a5550]">{k}</div><div className="mt-0.5 text-[#d4cdc2]">{v || 'Not set'}</div></div>)}</section><section className="rounded-xl border border-[#2a2622] bg-[#0d0c0a]/35 p-4"><div className="text-[9px] uppercase text-[#8a8478]">Progress</div><div className="mt-1.5 font-serif text-3xl italic">{selected.progress || 0}%</div><div className="mt-2 h-1 rounded-full bg-[#0a0908]"><div className="h-full rounded-full bg-[#ff6b5a]" style={{ width: `${Math.min(100, Math.max(0, Number(selected.progress || 0)))}%` }} /></div></section></aside></div><div className="mt-4 flex flex-wrap gap-2">{(selected.techStack || []).map((x) => <span key={x} className="rounded-full border border-[#2a2622] px-2 py-1 text-[10px]">{x}</span>)}{selected.repository && <a href={selected.repository} target="_blank" rel="noreferrer" className="rounded-lg border border-[#2a2622] px-2.5 py-1.5 text-[10px]"><Link2 className="mr-1.5 inline h-3 w-3" />Repository</a>}{selected.liveUrl && <a href={selected.liveUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-[#2a2622] px-2.5 py-1.5 text-[10px]"><ExternalLink className="mr-1.5 inline h-3 w-3" />Live product</a>}</div></div></div></div>}
    </main>
  );
}
