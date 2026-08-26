'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  Flag,
  List,
  MoveDown,
  MoveUp,
  Plus,
  Search,
  StickyNote,
  Target,
  Trash2,
  X,
} from 'lucide-react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { UnifiedSidebar } from '@/components/unified-sidebar';
import { PlannerStickyWorkspace } from '@/components/planner-sticky-workspace';

type Tab = 'today' | 'week' | 'calendar' | 'tasks' | 'notes' | 'sticky' | 'progress';
type Status = 'Not started' | 'In progress' | 'Done' | 'Blocked';
type Priority = 'None' | 'Low' | 'Medium' | 'High';

type Task = {
  id: string;
  title: string;
  description: string;
  date: string;
  done: boolean;
  priority: Priority;
  status: Status;
  tags: string[];
  deleted: boolean;
  order: number;
  updated: string;
};

type Note = { id: string; title: string; text: string; date: string; updated: string };
type Store = { tasks: Task[]; notes: Note[] };

const KEY = 'streamearn-planner-v8';
const STATUSES: Status[] = ['Not started', 'In progress', 'Done', 'Blocked'];
const PRIORITIES: Priority[] = ['None', 'Low', 'Medium', 'High'];

const fresh = (): Store => ({ tasks: [], notes: [] });
const uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const now = () => new Date().toISOString();
const today = () => new Date().toISOString().slice(0, 10);
const dateObj = (value: string) => {
  const d = new Date(`${value}T12:00:00`);
  return Number.isNaN(d.getTime()) ? new Date() : d;
};
const shift = (value: string, amount: number) => {
  const d = dateObj(value);
  d.setDate(d.getDate() + amount);
  return d.toISOString().slice(0, 10);
};
const isValidDate = (value: unknown) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

function sanitize(raw: any): Store {
  const store = fresh();
  if (!raw || typeof raw !== 'object') return store;
  if (Array.isArray(raw.tasks)) {
    store.tasks = raw.tasks
      .filter((x: any) => x && typeof x === 'object')
      .map((x: any, index: number) => {
        const status: Status = STATUSES.includes(x.status) ? x.status : Boolean(x.done) ? 'Done' : 'Not started';
        const priority: Priority = PRIORITIES.includes(x.priority) ? x.priority : 'None';
        const tags = Array.isArray(x.tags) ? x.tags.filter((v: any) => typeof v === 'string').map((v: string) => v.trim()).filter(Boolean).slice(0, 8) : [];
        return {
          id: typeof x.id === 'string' ? x.id : uid(),
          title: typeof x.title === 'string' ? x.title.trim() : '',
          description: typeof x.description === 'string' ? x.description : '',
          date: isValidDate(x.date) ? x.date : today(),
          done: status === 'Done' || Boolean(x.done),
          priority,
          status,
          tags,
          deleted: Boolean(x.deleted),
          order: Number.isFinite(x.order) ? Number(x.order) : index,
          updated: typeof x.updated === 'string' ? x.updated : now(),
        } as Task;
      })
      .filter((x: Task) => x.title);
  }
  if (Array.isArray(raw.notes)) {
    store.notes = raw.notes
      .filter((x: any) => x && typeof x === 'object')
      .map((x: any) => ({
        id: typeof x.id === 'string' ? x.id : uid(),
        title: typeof x.title === 'string' && x.title.trim() ? x.title.trim() : 'Untitled note',
        text: typeof x.text === 'string' ? x.text : '',
        date: isValidDate(x.date) ? x.date : today(),
        updated: typeof x.updated === 'string' ? x.updated : now(),
      }))
      .filter((x: Note) => x.text.trim());
  }
  return store;
}

function loadStore(): Store {
  if (typeof window === 'undefined') return fresh();
  try {
    const raw = JSON.parse(window.localStorage.getItem(KEY) || 'null');
    if (raw) return sanitize(raw);
    const legacy = JSON.parse(window.localStorage.getItem('streamearn-planner-v7') || 'null');
    return sanitize(legacy || {});
  } catch {
    return fresh();
  }
}

function priorityWeight(priority: Priority) {
  return priority === 'High' ? 4 : priority === 'Medium' ? 3 : priority === 'Low' ? 2 : 1;
}

export default function PlannerV3() {
  const [store, setStore] = useState<Store>(fresh);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>('today');
  const [date, setDate] = useState(today());
  const [taskTitle, setTaskTitle] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Status>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | Priority>('All');
  const [sort, setSort] = useState<'manual' | 'priority' | 'date' | 'status'>('manual');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    setStore(loadStore());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(store));
    } catch {
      // Keep Planner usable even when browser storage is unavailable.
    }
  }, [store, ready]);

  const activeTasks = useMemo(() => store.tasks.filter((task) => !task.deleted), [store.tasks]);
  const archivedTasks = useMemo(() => store.tasks.filter((task) => task.deleted), [store.tasks]);
  const completed = activeTasks.filter((task) => task.status === 'Done' || task.done).length;
  const percent = activeTasks.length ? Math.round((completed / activeTasks.length) * 100) : 0;
  const overdue = activeTasks.filter((task) => task.date < today() && task.status !== 'Done');
  const highPriority = activeTasks.filter((task) => task.priority === 'High' && task.status !== 'Done');

  const normalizedSearch = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    const list = activeTasks.filter((task) => {
      const haystack = `${task.title} ${task.description} ${task.tags.join(' ')} ${task.status} ${task.priority}`.toLowerCase();
      const matchesSearch = !normalizedSearch || haystack.includes(normalizedSearch);
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
    return [...list].sort((a, b) => {
      if (sort === 'priority') return priorityWeight(b.priority) - priorityWeight(a.priority) || a.order - b.order;
      if (sort === 'date') return a.date.localeCompare(b.date) || a.order - b.order;
      if (sort === 'status') return STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status) || a.order - b.order;
      return a.order - b.order;
    });
  }, [activeTasks, normalizedSearch, priorityFilter, sort, statusFilter]);

  const dayTasks = filtered.filter((task) => task.date === date);
  const todayTasks = activeTasks.filter((task) => task.date === today());
  const week = useMemo(() => Array.from({ length: 7 }, (_, index) => shift(date, index)), [date]);

  const monthCells = useMemo(() => {
    const base = dateObj(date);
    base.setDate(1);
    const year = base.getFullYear();
    const month = base.getMonth();
    const leading = base.getDay();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: 42 }, (_, index) => {
      const day = index - leading + 1;
      if (day < 1 || day > days) return null;
      return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    });
  }, [date]);

  const updateTask = (id: string, patch: Partial<Task>) => {
    setStore((current) => ({
      ...current,
      tasks: current.tasks.map((task) => task.id === id
        ? { ...task, ...patch, done: patch.status === 'Done' ? true : patch.done ?? task.done, updated: now() }
        : task),
    }));
  };

  const addTask = () => {
    const title = taskTitle.trim();
    if (!title) return;
    const maxOrder = activeTasks.reduce((max, task) => Math.max(max, task.order), -1);
    const created: Task = {
      id: uid(), title, description: '', date, done: false, priority: 'None', status: 'Not started', tags: [], deleted: false, order: maxOrder + 1, updated: now(),
    };
    setStore((current) => ({ ...current, tasks: [...current.tasks, created] }));
    setTaskTitle('');
  };

  const moveTask = (id: string, direction: -1 | 1) => {
    setStore((current) => {
      const tasks = [...current.tasks].sort((a, b) => a.order - b.order);
      const index = tasks.findIndex((task) => task.id === id);
      if (index < 0) return current;
      const target = index + direction;
      if (target < 0 || target >= tasks.length) return current;
      const first = tasks[index];
      const second = tasks[target];
      [first.order, second.order] = [second.order, first.order];
      first.updated = now();
      second.updated = now();
      return { ...current, tasks };
    });
  };

  const archiveTask = (id: string) => updateTask(id, { deleted: true });
  const restoreTask = (id: string) => updateTask(id, { deleted: false });

  const addNote = () => {
    const text = noteText.trim();
    if (!text) return;
    setStore((current) => ({
      ...current,
      notes: [{ id: uid(), title: noteTitle.trim() || 'Untitled note', text, date, updated: now() }, ...current.notes],
    }));
    setNoteTitle('');
    setNoteText('');
  };

  const tabs: Array<[Tab, string, typeof ClipboardList]> = [
    ['today', 'Today', ClipboardList],
    ['week', 'Week', List],
    ['calendar', 'Calendar', CalendarDays],
    ['tasks', 'To-Do', Check],
    ['notes', 'Notes', FileText],
    ['sticky', 'Sticky Wall', StickyNote],
    ['progress', 'Progress', Target],
  ];

  if (!ready) {
    return (
      <SidebarProvider><UnifiedSidebar /><SidebarInset><main className="min-h-screen p-8"><div className="animate-pulse text-sm text-muted-foreground">Loading Planner…</div></main></SidebarInset></SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <UnifiedSidebar />
      <SidebarInset>
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-[1400px] px-4 py-5 md:px-6 lg:px-8">
            <header className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Personal workspace</p>
                <h1 className="text-3xl font-semibold tracking-tight">Planner</h1>
                <p className="mt-1 text-sm text-muted-foreground">A clean workspace for tasks, dates, notes and ideas.</p>
              </div>
              <div className="flex items-center gap-1 rounded-xl border bg-card p-1">
                <button className="rounded-lg p-2 hover:bg-muted" onClick={() => setDate(shift(date, -1))} aria-label="Previous day"><ChevronLeft className="h-4 w-4" /></button>
                <button className="rounded-lg px-3 py-2 text-xs font-medium hover:bg-muted" onClick={() => setDate(today())}>Today</button>
                <button className="rounded-lg p-2 hover:bg-muted" onClick={() => setDate(shift(date, 1))} aria-label="Next day"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </header>

            <nav className="mb-5 flex flex-wrap gap-1 border-b pb-2">
              {tabs.map(([id, label, Icon]) => (
                <button key={id} onClick={() => setTab(id)} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium ${tab === id ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                  <Icon className="h-3.5 w-3.5" />{label}
                </button>
              ))}
            </nav>

            {tab === 'today' && (
              <section className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Metric label="Today" value={String(todayTasks.length)} detail="scheduled" />
                  <Metric label="Pending" value={String(todayTasks.filter((task) => task.status !== 'Done').length)} detail="to finish" />
                  <Metric label="Overdue" value={String(overdue.length)} detail="needs attention" />
                  <Metric label="High priority" value={String(highPriority.length)} detail="focus first" />
                </div>
                <section className="rounded-2xl border bg-card">
                  <div className="border-b p-4 md:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div><h2 className="text-lg font-semibold">{date === today() ? 'Today' : dateObj(date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</h2><p className="mt-1 text-xs text-muted-foreground">Keep the important work visible and move tasks as your plan changes.</p></div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground"><span>{dayTasks.filter((task) => task.status === 'Done').length} complete</span><span>•</span><span>{dayTasks.length} total</span></div>
                    </div>
                    <form onSubmit={(event) => { event.preventDefault(); addTask(); }} className="mt-4 flex gap-2">
                      <input value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} className="h-10 min-w-0 flex-1 rounded-xl border bg-background px-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring" placeholder="Add a task…" />
                      <button className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-foreground px-4 text-xs font-semibold text-background"><Plus className="h-4 w-4" />Add</button>
                    </form>
                  </div>
                  <TaskList tasks={dayTasks} onToggle={(id) => { const task = activeTasks.find((item) => item.id === id); updateTask(id, { done: !task?.done, status: task?.done ? 'Not started' : 'Done' }); }} onPatch={updateTask} onMove={moveTask} onArchive={archiveTask} onOpen={setSelectedTaskId} />
                </section>
              </section>
            )}

            {tab === 'week' && (
              <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
                {week.map((day) => {
                  const tasks = activeTasks.filter((task) => task.date === day && !task.deleted).sort((a, b) => a.order - b.order).slice(0, 7);
                  return <button key={day} onClick={() => { setDate(day); setTab('today'); }} className="min-h-40 rounded-2xl border bg-card p-4 text-left hover:border-foreground/20 hover:bg-muted/20">
                    <div className="flex items-start justify-between"><div><p className="text-xs font-semibold">{dateObj(day).toLocaleDateString(undefined, { weekday: 'short' })}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{dateObj(day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p></div><span className={`text-[10px] ${day === today() ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>{tasks.length}</span></div>
                    <div className="mt-4 space-y-1.5">{tasks.length === 0 ? <p className="text-xs text-muted-foreground">No tasks</p> : tasks.map((task) => <div key={task.id} className={`truncate rounded-md px-2 py-1 text-[11px] ${task.status === 'Done' ? 'bg-muted text-muted-foreground line-through' : 'border bg-background'}`}>{task.title}</div>)}</div>
                  </button>;
                })}
              </section>
            )}

            {tab === 'calendar' && (
              <section className="rounded-2xl border bg-card overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4 md:p-5">
                  <div><h2 className="text-lg font-semibold">{dateObj(date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h2><p className="mt-1 text-xs text-muted-foreground">Monthly calendar</p></div>
                  <div className="flex items-center gap-1"><button className="rounded-lg border p-2 hover:bg-muted" onClick={() => setDate(shift(date, -30))} aria-label="Previous month"><ChevronLeft className="h-4 w-4" /></button><button className="rounded-lg border px-3 py-2 text-xs hover:bg-muted" onClick={() => setDate(today())}>Today</button><button className="rounded-lg border p-2 hover:bg-muted" onClick={() => setDate(shift(date, 30))} aria-label="Next month"><ChevronRight className="h-4 w-4" /></button></div>
                </div>
                <div className="grid grid-cols-7 border-l border-t">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <div key={day} className="border-b border-r bg-muted/40 px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{day}</div>)}
                  {monthCells.map((cell, index) => cell ? <button key={`${cell}-${index}`} onClick={() => { setDate(cell); setTab('today'); }} className={`min-h-32 border-b border-r p-2 text-left align-top hover:bg-muted/30 ${cell === today() ? 'bg-primary/5' : ''}`}>
                    <div className="flex items-center justify-between"><span className={`text-xs font-semibold ${cell === today() ? 'text-primary' : ''}`}>{dateObj(cell).getDate()}</span><span className="text-[9px] text-muted-foreground">{activeTasks.filter((task) => task.date === cell).length || ''}</span></div>
                    <div className="mt-2 space-y-1">{activeTasks.filter((task) => task.date === cell).sort((a, b) => a.order - b.order).slice(0, 4).map((task) => <div key={task.id} className={`truncate rounded-md px-1.5 py-1 text-[10px] ${task.status === 'Done' ? 'bg-muted text-muted-foreground line-through' : task.priority === 'High' ? 'border border-red-500/30 bg-red-500/5' : 'border bg-background'}`}>{task.title}</div>)}</div>
                  </button> : <div key={`blank-${index}`} className="min-h-32 border-b border-r bg-muted/10" />)}
                </div>
              </section>
            )}

            {tab === 'tasks' && (
              <section className="space-y-4">
                <div className="rounded-2xl border bg-card p-4 md:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold">To-Do</h2><p className="mt-1 text-xs text-muted-foreground">Organize by status, priority, date or manual order.</p></div><span className="text-xs text-muted-foreground">{filtered.length} visible</span></div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="relative sm:col-span-2"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks…" className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-xs outline-none" /></div>
                    <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as any)} className="h-9 rounded-lg border bg-background px-2 text-xs"><option>All</option>{STATUSES.map((value) => <option key={value}>{value}</option>)}</select>
                    <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value as any)} className="h-9 rounded-lg border bg-background px-2 text-xs"><option>All</option>{PRIORITIES.map((value) => <option key={value}>{value}</option>)}</select>
                    <select value={sort} onChange={(event) => setSort(event.target.value as any)} className="h-9 rounded-lg border bg-background px-2 text-xs"><option value="manual">Manual order</option><option value="priority">Priority</option><option value="date">Date</option><option value="status">Status</option></select>
                  </div>
                </div>
                <div className="rounded-2xl border bg-card"><TaskList tasks={filtered} onToggle={(id) => { const task = activeTasks.find((item) => item.id === id); updateTask(id, { done: !task?.done, status: task?.done ? 'Not started' : 'Done' }); }} onPatch={updateTask} onMove={moveTask} onArchive={archiveTask} onOpen={setSelectedTaskId} /></div>
                {archivedTasks.length > 0 && <details className="rounded-2xl border bg-card"><summary className="cursor-pointer px-4 py-3 text-xs font-semibold text-muted-foreground">Archived ({archivedTasks.length})</summary><div className="divide-y border-t">{archivedTasks.sort((a, b) => b.updated.localeCompare(a.updated)).map((task) => <div key={task.id} className="flex items-center gap-3 px-4 py-3 text-xs"><span className="flex-1 truncate">{task.title}</span><button onClick={() => restoreTask(task.id)} className="text-primary">Restore</button></div>)}</div></details>}
              </section>
            )}

            {tab === 'notes' && (
              <section className="grid gap-4 lg:grid-cols-[360px_1fr]">
                <div className="rounded-2xl border bg-card p-4 md:p-5"><h2 className="text-lg font-semibold">Notes</h2><p className="mt-1 text-xs text-muted-foreground">Capture ideas, study notes and meeting notes without leaving Planner.</p><input value={noteTitle} onChange={(event) => setNoteTitle(event.target.value)} placeholder="Title" className="mt-4 h-9 w-full rounded-lg border bg-background px-3 text-sm" /><textarea value={noteText} onChange={(event) => setNoteText(event.target.value)} placeholder="Write something…" className="mt-2 min-h-52 w-full rounded-lg border bg-background p-3 text-sm outline-none" /><button onClick={addNote} className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-2 text-xs font-semibold text-background"><Plus className="h-3.5 w-3.5" />Save note</button></div>
                <div className="rounded-2xl border bg-card p-4 md:p-5"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Saved notes</h2><span className="text-xs text-muted-foreground">{store.notes.length}</span></div><div className="mt-4 space-y-2">{store.notes.length === 0 ? <p className="py-12 text-center text-sm text-muted-foreground">Nothing saved yet.</p> : store.notes.map((note) => <article key={note.id} className="rounded-xl border p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="text-sm font-medium">{note.title}</h3><p className="mt-1 text-[10px] text-muted-foreground">{note.date}</p></div><button onClick={() => setStore((current) => ({ ...current, notes: current.notes.filter((item) => item.id !== note.id) }))} className="text-muted-foreground hover:text-red-600" aria-label="Delete note"><Trash2 className="h-4 w-4" /></button></div><p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{note.text}</p></article>)}</div></div>
              </section>
            )}

            {tab === 'sticky' && <PlannerStickyWorkspace />}

            {tab === 'progress' && (
              <section className="space-y-4"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Metric label="Active tasks" value={String(activeTasks.length)} detail="current workload" /><Metric label="Completed" value={String(completed)} detail="finished" /><Metric label="Completion" value={`${percent}%`} detail="overall rate" /><Metric label="Blocked" value={String(activeTasks.filter((task) => task.status === 'Blocked').length)} detail="needs action" /></div><div className="rounded-2xl border bg-card p-5"><div className="flex items-center justify-between"><h2 className="font-semibold">Completion</h2><span className="text-sm text-muted-foreground">{percent}%</span></div><div className="mt-3 h-3 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-foreground transition-all" style={{ width: `${percent}%` }} /></div><div className="mt-4 grid gap-3 sm:grid-cols-3"><StatLine label="Not started" value={activeTasks.filter((task) => task.status === 'Not started').length} /><StatLine label="In progress" value={activeTasks.filter((task) => task.status === 'In progress').length} /><StatLine label="High priority" value={highPriority.length} /></div></div></section>
            )}
          </div>
        </main>
      </SidebarInset>

      {selectedTaskId && <TaskDetail task={activeTasks.find((item) => item.id === selectedTaskId)} onClose={() => setSelectedTaskId(null)} onPatch={updateTask} />}
    </SidebarProvider>
  );
}

function TaskList({ tasks, onToggle, onPatch, onMove, onArchive, onOpen }: { tasks: Task[]; onToggle: (id: string) => void; onPatch: (id: string, patch: Partial<Task>) => void; onMove: (id: string, direction: -1 | 1) => void; onArchive: (id: string) => void; onOpen: (id: string) => void }) {
  if (tasks.length === 0) return <p className="py-16 text-center text-sm text-muted-foreground">No tasks match this view.</p>;
  return <div className="divide-y">{tasks.map((task, index) => <div key={task.id} className="group flex items-start gap-3 px-4 py-3.5 md:px-5">
    <button onClick={() => onToggle(task.id)} aria-label={task.done ? 'Mark task incomplete' : 'Mark task complete'} className="mt-0.5 shrink-0">{task.done ? <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="h-3 w-3" /></span> : <span className="block h-5 w-5 rounded-full border-2 border-muted-foreground/50 hover:border-foreground" />}</button>
    <div className="min-w-0 flex-1"><button onClick={() => onOpen(task.id)} className={`block max-w-full truncate text-left text-sm font-medium hover:underline ${task.done ? 'text-muted-foreground line-through' : ''}`}>{task.title}</button>{task.description && <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{task.description}</p>}<div className="mt-2 flex flex-wrap items-center gap-1.5"><StatusPill value={task.status} onChange={(value) => onPatch(task.id, { status: value })} /><PriorityPill value={task.priority} onChange={(value) => onPatch(task.id, { priority: value })} /><label className="inline-flex h-6 items-center gap-1 rounded-md border bg-background px-1.5 text-[10px] text-muted-foreground"><input type="date" value={task.date} onChange={(event) => onPatch(task.id, { date: event.target.value })} className="w-[92px] bg-transparent outline-none" /></label>{task.tags.slice(0, 4).map((tag) => <span key={tag} className="rounded-md bg-muted px-1.5 py-1 text-[10px] text-muted-foreground">#{tag}</span>)}</div></div>
    <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100"><button onClick={() => onMove(task.id, -1)} disabled={index === 0} className="rounded-md border p-1.5 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30" title="Move up"><MoveUp className="h-3.5 w-3.5" /></button><button onClick={() => onMove(task.id, 1)} disabled={index === tasks.length - 1} className="rounded-md border p-1.5 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30" title="Move down"><MoveDown className="h-3.5 w-3.5" /></button><button onClick={() => onArchive(task.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-red-600" title="Archive"><Trash2 className="h-3.5 w-3.5" /></button></div>
  </div>)}</div>;
}

function StatusPill({ value, onChange }: { value: Status; onChange: (value: Status) => void }) { return <select value={value} onChange={(event) => onChange(event.target.value as Status)} className="h-6 rounded-md border bg-background px-1.5 text-[10px] font-medium"><option>Not started</option><option>In progress</option><option>Done</option><option>Blocked</option></select>; }
function PriorityPill({ value, onChange }: { value: Priority; onChange: (value: Priority) => void }) { return <label className="inline-flex h-6 items-center gap-1 rounded-md border bg-background px-1.5 text-[10px] font-medium"><Flag className="h-3 w-3" /><select value={value} onChange={(event) => onChange(event.target.value as Priority)} className="bg-transparent outline-none"><option>None</option><option>Low</option><option>Medium</option><option>High</option></select></label>; }

function TaskDetail({ task, onClose, onPatch }: { task?: Task; onClose: () => void; onPatch: (id: string, patch: Partial<Task>) => void }) {
  const [description, setDescription] = useState(task?.description || '');
  const [tags, setTags] = useState(task?.tags.join(', ') || '');
  if (!task) return null;
  return <div className="fixed inset-0 z-50 flex justify-end bg-black/30 p-0" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><aside className="h-full w-full max-w-md border-l bg-background p-5 shadow-2xl"><div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[.18em] text-muted-foreground">Task details</p><h2 className="mt-1 text-lg font-semibold">{task.title}</h2></div><button onClick={onClose} className="rounded-lg p-2 hover:bg-muted" aria-label="Close"><X className="h-4 w-4" /></button></div><div className="mt-6 space-y-4"><div><label className="text-xs font-semibold">Description</label><textarea value={description} onChange={(event) => setDescription(event.target.value)} onBlur={() => onPatch(task.id, { description })} className="mt-2 min-h-36 w-full rounded-xl border bg-card p-3 text-sm outline-none" placeholder="Add details…" /></div><div><label className="text-xs font-semibold">Tags</label><input value={tags} onChange={(event) => setTags(event.target.value)} onBlur={() => onPatch(task.id, { tags: tags.split(',').map((tag) => tag.trim().replace(/^#/, '')).filter(Boolean).slice(0, 8) })} className="mt-2 h-10 w-full rounded-xl border bg-card px-3 text-sm" placeholder="study, cyber, project" /></div><div className="grid grid-cols-2 gap-2"><label className="rounded-xl border bg-card p-3 text-xs"><span className="block text-muted-foreground">Status</span><select value={task.status} onChange={(event) => onPatch(task.id, { status: event.target.value as Status })} className="mt-2 w-full bg-transparent font-medium outline-none">{STATUSES.map((value) => <option key={value}>{value}</option>)}</select></label><label className="rounded-xl border bg-card p-3 text-xs"><span className="block text-muted-foreground">Priority</span><select value={task.priority} onChange={(event) => onPatch(task.id, { priority: event.target.value as Priority })} className="mt-2 w-full bg-transparent font-medium outline-none">{PRIORITIES.map((value) => <option key={value}>{value}</option>)}</select></label></div><label className="block rounded-xl border bg-card p-3 text-xs"><span className="block text-muted-foreground">Due date</span><input type="date" value={task.date} onChange={(event) => onPatch(task.id, { date: event.target.value })} className="mt-2 w-full bg-transparent font-medium outline-none" /></label></div></aside></div>;
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) { return <div className="rounded-2xl border bg-card p-4"><p className="text-[10px] uppercase tracking-[.16em] text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p><p className="mt-1 text-[11px] text-muted-foreground">{detail}</p></div>; }
function StatLine({ label, value }: { label: string; value: number }) { return <div className="rounded-xl border bg-background p-3"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 text-xl font-semibold">{value}</p></div>; }
