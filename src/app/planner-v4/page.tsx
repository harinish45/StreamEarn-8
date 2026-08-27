
  const active = useMemo(() => store.tasks.filter(t => !t.deleted), [store.tasks]);
  const archived = useMemo(() => store.tasks.filter(t => t.deleted), [store.tasks]);
  const completed = active.filter(t => t.status === 'Done' || t.done).length;
  const percent = active.length ? Math.round(completed / active.length * 100) : 0;
  const normalized = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    const list = active.filter(t => (!normalized || `${t.title} ${t.description} ${t.tags.join(' ')} ${t.status} ${t.priority}`.toLowerCase().includes(normalized)) && (statusFilter === 'All' || t.status === statusFilter) && (priorityFilter === 'All' || t.priority === priorityFilter));
    return [...list].sort((a, b) => sort === 'Priority' ? priorityRank(b.priority) - priorityRank(a.priority) || a.order - b.order : sort === 'Date' ? a.date.localeCompare(b.date) || a.order - b.order : sort === 'Status' ? STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status) || a.order - b.order : a.order - b.order);
  }, [active, normalized, priorityFilter, sort, statusFilter]);
  const dayTasks = filtered.filter(t => t.date === date);
  const week = useMemo(() => Array.from({ length: 7 }, (_, i) => shift(date, i)), [date]);
  const days = useMemo(() => monthCells(date), [date]);

  const updateTask = (id: string, patch: Partial<Task>) => setStore(s => ({ ...s, tasks: s.tasks.map(t => t.id === id ? { ...t, ...patch, done: patch.status === 'Done' ? true : patch.status !== undefined ? false : patch.done ?? t.done, updated: now() } : t) }));
  const addTask = () => { const title = taskTitle.trim(); if (!title) return; const order = active.reduce((m, t) => Math.max(m, t.order), -1) + 1; setStore(s => ({ ...s, tasks: [...s.tasks, { id: uid(), title, description: '', date, status: 'To do', priority: 'None', done: false, tags: [], order, deleted: false, updated: now() }] })); setTaskTitle(''); };
  const moveTask = (id: string, direction: -1 | 1) => setStore(s => { const ordered = [...s.tasks.filter(t => !t.deleted)].sort((a, b) => a.order - b.order); const i = ordered.findIndex(t => t.id === id); const j = i + direction; if (i < 0 || j < 0 || j >= ordered.length) return s; [ordered[i].order, ordered[j].order] = [ordered[j].order, ordered[i].order]; return { ...s, tasks: s.tasks.map(t => ordered.find(x => x.id === t.id) || t) }; });
  const toggleDone = (id: string) => { const t = active.find(x => x.id === id); if (t) updateTask(id, { status: t.status === 'Done' ? 'To do' : 'Done' }); };
  const addNote = () => { if (!noteText.trim()) return; setStore(s => ({ ...s, notes: [{ id: uid(), title: noteTitle.trim() || 'Untitled note', text: noteText.trim(), date, updated: now() }, ...s.notes] })); setNoteTitle(''); setNoteText(''); };
  const toggleSelect = (id: string) => setSelected(v => v.includes(id) ? v.filter(x => x !== id) : [...v, id]);
  const archiveSelected = () => { if (!selected.length) return; setStore(s => ({ ...s, tasks: s.tasks.map(t => selected.includes(t.id) ? { ...t, deleted: true, updated: now() } : t) })); setSelected([]); };

  if (!ready) return <SidebarProvider><UnifiedSidebar /><SidebarInset><main className="min-h-screen p-6"><p className="text-sm text-muted-foreground">Loading Planner…</p></main></SidebarInset></SidebarProvider>;

  return <SidebarProvider><UnifiedSidebar /><SidebarInset><main className="min-h-screen w-full overflow-x-hidden bg-background"><div className="mx-auto w-full max-w-[1320px] min-w-0 px-3 py-4 sm:px-5 lg:px-6">
    <header className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-semibold tracking-tight">Planner</h1><p className="mt-0.5 text-xs text-muted-foreground">Tasks, dates, notes and your Sticky Wall.</p></div><div className="flex items-center gap-1 rounded-lg border bg-card p-1"><button className="rounded-md p-1.5 hover:bg-muted" onClick={() => setDate(shift(date, -1))} aria-label="Previous"><ChevronLeft className="h-4 w-4" /></button><button className="rounded-md px-2.5 py-1.5 text-xs hover:bg-muted" onClick={() => setDate(today())}>Today</button><button className="rounded-md p-1.5 hover:bg-muted" onClick={() => setDate(shift(date, 1))} aria-label="Next"><ChevronRight className="h-4 w-4" /></button></div></div></header>