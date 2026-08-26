'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, CalendarDays, Check, ChevronLeft, ChevronRight, Grip, Plus, RotateCcw, Search, Trash2, X } from 'lucide-react';
import Link from 'next/link';

type Palette = 'lemon' | 'blush' | 'sky' | 'mint' | 'peach' | 'lilac';
type NoteStyle = 1 | 2 | 3 | 4 | 5;
type Note = { id: string; text: string; color: Palette; style: NoteStyle; x: number; y: number; rotation: number; created: string; updated: string; archived?: boolean };

const KEY = 'streamearn-planner-sticky-wall-v2';
const PALETTES: Record<Palette, { p1: string; p2: string; fold: string }> = {
  lemon: { p1: '#E9CD4E', p2: '#DDBB2E', fold: '#A98A20' },
  blush: { p1: '#EC7FA6', p2: '#E66E9B', fold: '#B24A73' },
  sky: { p1: '#85BCE9', p2: '#74B0E4', fold: '#4A7FB2' },
  mint: { p1: '#90D18C', p2: '#7EC67C', fold: '#529A52' },
  peach: { p1: '#E18B50', p2: '#DA7F41', fold: '#A85D2C' },
  lilac: { p1: '#AC8FD6', p2: '#9E80CB', fold: '#7457A6' },
};
const COLORS = Object.keys(PALETTES) as Palette[];
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const today = () => new Date().toISOString().slice(0, 10);
const id = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function seedNotes(): Note[] { return []; }
function read(): Note[] { if (typeof window === 'undefined') return seedNotes(); try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }

export default function StickyWallPage() {
  const [notes, setNotes] = useState<Note[]>(read);
  const [color, setColor] = useState<Palette>('lemon');
  const [style, setStyle] = useState<NoteStyle>(1);
  const [query, setQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [calendar, setCalendar] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ id: string; dx: number; dy: number } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => localStorage.setItem(KEY, JSON.stringify(notes)), [notes]);
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!drag || !boardRef.current) return;
      const r = boardRef.current.getBoundingClientRect();
      const x = clamp(e.clientX - r.left - drag.dx, 8, Math.max(8, r.width - 276));
      const y = clamp(e.clientY - r.top - drag.dy, 8, Math.max(8, r.height - 260));
      setNotes(v => v.map(n => n.id === drag.id ? { ...n, x, y, updated: new Date().toISOString() } : n));
    };
    const up = () => setDrag(null);
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, [drag]);

  const visible = useMemo(() => notes.filter(n => (showArchived || !n.archived) && n.text.toLowerCase().includes(query.toLowerCase())), [notes, query, showArchived]);
  const add = () => {
    const r = boardRef.current?.getBoundingClientRect();
    const i = notes.length;
    setNotes(v => [{ id: id(), text: '', color, style, x: 30 + (i % 4) * 285, y: 30 + (Math.floor(i / 4) % 4) * 275, rotation: [-2, 1, -1, 2, 0][i % 5], created: new Date().toISOString(), updated: new Date().toISOString() }, ...v]);
    setTimeout(() => document.querySelector<HTMLTextAreaElement>('[data-new-note="true"]')?.focus(), 30);
    void r;
  };
  const update = (noteId: string, patch: Partial<Note>) => setNotes(v => v.map(n => n.id === noteId ? { ...n, ...patch, updated: new Date().toISOString() } : n));
  const remove = (noteId: string) => setNotes(v => v.map(n => n.id === noteId ? { ...n, archived: true } : n));
  const restore = (noteId: string) => setNotes(v => v.map(n => n.id === noteId ? { ...n, archived: false } : n));
  const empty = () => { if (confirm('Delete every sticky note? This cannot be undone.')) setNotes([]); };

  return <div className="min-h-screen overflow-hidden bg-[#171210] text-[#F3E9DC]">
    <header className="flex flex-wrap items-center gap-3 border-b border-white/10 bg-[#17110d]/90 px-4 py-3 backdrop-blur-xl md:px-6">
      <Link href="/planner" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/15" aria-label="Back to planner"><ArrowLeft className="h-4 w-4" /></Link>
      <div className="flex items-center gap-3"><div className="h-8 w-8 -rotate-6 rounded-[3px] bg-gradient-to-br from-[#EFD45B] to-[#DDBB2E] shadow-lg" /><div><h1 className="font-serif text-2xl leading-none">Sticky Wall</h1><p className="mt-0.5 text-[10px] uppercase tracking-[.18em] text-[#9A8672]">Local • private • no AI</p></div></div>
      <div className="ml-auto flex flex-wrap items-center gap-2">
        <div className="hidden items-center gap-1 rounded-full bg-white/[.06] px-2 py-1.5 sm:flex">{COLORS.map(k => <button key={k} onClick={() => setColor(k)} aria-label={`Use ${k}`} className={`h-5 w-5 rounded-[5px] transition ${color === k ? 'ring-2 ring-[#F2C94C] ring-offset-2 ring-offset-[#171210]' : '-rotate-6 hover:rotate-0'}`} style={{ background: `linear-gradient(160deg,${PALETTES[k].p1},${PALETTES[k].p2})` }} />)}</div>
        <select value={style} onChange={e => setStyle(Number(e.target.value) as NoteStyle)} className="rounded-full border border-white/10 bg-[#241C16] px-3 py-2 text-xs text-[#F3E9DC] outline-none"><option value="1">Tape</option><option value="2">Lined</option><option value="3">Grid</option><option value="4">Legal</option><option value="5">Stripe</option></select>
        <button onClick={() => setShowArchived(v => !v)} className="rounded-full border border-white/10 px-3 py-2 text-xs text-[#C9B391] hover:bg-white/10">{showArchived ? 'Hide archived' : 'Archived'}</button>
        <button onClick={add} className="inline-flex items-center gap-1.5 rounded-full bg-[#F2C94C] px-4 py-2 text-xs font-semibold text-[#241C16] shadow-lg shadow-yellow-900/20"><Plus className="h-4 w-4" /> New</button>
      </div>
    </header>

    <div className="flex items-center gap-2 border-b border-white/10 bg-[#17110d]/80 px-4 py-2 md:px-6">
      <div className="flex flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/[.05] px-3 py-1.5"><Search className="h-3.5 w-3.5 text-[#9A8672]" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search notes…" className="w-full bg-transparent text-xs text-white outline-none placeholder:text-[#756454]" /></div>
      <span className="hidden text-[10px] uppercase tracking-[.15em] text-[#9A8672] sm:inline">{visible.length} notes</span>
      <button onClick={empty} className="rounded-full p-2 text-[#9A8672] hover:bg-red-500/10 hover:text-red-300" aria-label="Clear all notes"><Trash2 className="h-4 w-4" /></button>
    </div>

    <main ref={boardRef} className="relative h-[calc(100vh-105px)] min-h-[520px] overflow-auto bg-[radial-gradient(rgba(255,235,205,.08)_1px,transparent_1px)] [background-size:28px_28px] p-2">
      {visible.length === 0 && <div className="pointer-events-none absolute inset-0 grid place-items-center"><div className="text-center"><div className="mx-auto mb-4 h-16 w-16 -rotate-6 rounded bg-gradient-to-br from-[#EFD45B] to-[#DDBB2E] shadow-2xl" /><p className="text-sm text-[#C9B391]">{query ? 'No notes match your search.' : 'Nothing pinned yet.'}</p><p className="mt-1 text-xs text-[#756454]">Create a note and keep quick thoughts visible.</p></div></div>}
      {visible.map(n => <StickyCard key={n.id} note={n} onChange={text => update(n.id, { text })} onDelete={() => remove(n.id)} onRestore={() => restore(n.id)} onColor={c => update(n.id, { color: c })} onDate={() => setCalendar(n.id)} onPointerDown={(e) => { if ((e.target as HTMLElement).closest('textarea,button')) return; const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); setDrag({ id: n.id, dx: e.clientX - r.left, dy: e.clientY - r.top }); }} />)}
    </main>

    {calendar && <CalendarPopover note={notes.find(n => n.id === calendar)} onClose={() => setCalendar(null)} onDate={d => { update(calendar, { updated: new Date(`${d}T12:00:00`).toISOString() }); setCalendar(null); }} />}
  </div>;
}

function StickyCard({ note, onChange, onDelete, onRestore, onColor, onDate, onPointerDown }: { note: Note; onChange: (v: string) => void; onDelete: () => void; onRestore: () => void; onColor: (v: Palette) => void; onDate: () => void; onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void }) {
  const p = PALETTES[note.color];
  const styleClass = note.style === 2 ? 'bg-[repeating-linear-gradient(transparent_0_25px,rgba(0,0,0,.12)_25px_26px)]' : note.style === 3 ? 'bg-[radial-gradient(rgba(0,0,0,.14)_1px,transparent_1.4px)] [background-size:14px_14px]' : note.style === 4 ? 'bg-[linear-gradient(90deg,transparent_30px,rgba(217,72,15,.4)_30px_31.5px,transparent_31.5px)]' : note.style === 5 ? 'bg-[repeating-linear-gradient(45deg,rgba(255,255,255,.1)_0_14px,transparent_14px_28px)]' : '';
  return <article onPointerDown={onPointerDown} className="absolute flex h-[250px] w-[250px] flex-col rounded-[3px] p-4 text-[#262019] shadow-[0_5px_12px_rgba(0,0,0,.4),0_25px_45px_-12px_rgba(0,0,0,.6)] transition-shadow hover:shadow-[0_8px_16px_rgba(0,0,0,.4),0_32px_55px_-12px_rgba(0,0,0,.72)]" style={{ left: note.x, top: note.y, transform: `rotate(${note.rotation}deg)`, background: `linear-gradient(175deg,${p.p1},${p.p2})` }}>
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/20 to-transparent" />
    {note.style === 1 && <div className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-2deg] bg-white/30 shadow-md" />}
    {note.style === 2 && <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-red-600 shadow-md" />}
    {note.style === 4 && <div className="absolute -top-2 left-1/2 h-4 w-8 -translate-x-1/2 rounded bg-slate-500 shadow-md" />}
    {note.style === 5 && <div className="absolute -top-2 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-blue-700 shadow-md" />}
    <div className="relative z-10 mb-2 flex items-center justify-between gap-2"><div className="text-[9px] font-bold uppercase tracking-[.18em] opacity-50">{new Date(note.updated).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div><div className="flex gap-1"><button onClick={onDate} className="rounded-full bg-black/10 p-1 opacity-60 hover:opacity-100" title="Date"><CalendarDays className="h-3 w-3" /></button>{note.archived ? <button onClick={onRestore} className="rounded-full bg-black/10 p-1 opacity-60 hover:opacity-100" title="Restore"><RotateCcw className="h-3 w-3" /></button> : <button onClick={onDelete} className="rounded-full bg-black/10 p-1 opacity-60 hover:bg-red-700 hover:text-white hover:opacity-100" title="Archive"><Trash2 className="h-3 w-3" /></button>}</div></div>
    <textarea data-new-note={!note.text ? 'true' : undefined} value={note.text} onChange={e => onChange(e.target.value)} placeholder="Write something…" className={`relative z-10 min-h-0 flex-1 resize-none overflow-auto bg-transparent font-serif text-[18px] leading-[1.5] outline-none placeholder:text-black/35 ${styleClass}`} />
    <div className="relative z-10 mt-2 flex items-center justify-between"><div className="flex gap-1">{COLORS.map(k => <button key={k} onClick={() => onColor(k)} aria-label={`Change to ${k}`} className={`h-3 w-3 rounded-sm ${note.color === k ? 'ring-1 ring-black/60' : ''}`} style={{ background: PALETTES[k].p1 }} />)}</div><Grip className="h-3.5 w-3.5 opacity-30" /></div>
    <div className="pointer-events-none absolute -bottom-px -right-px h-7 w-7" style={{ background: `linear-gradient(to top left,transparent 0 46%,rgba(255,255,255,.3) 47% 49%,${p.fold} 50%)` }} />
  </article>;
}

function CalendarPopover({ note, onClose, onDate }: { note?: Note; onClose: () => void; onDate: (d: string) => void }) {
  const [cursor, setCursor] = useState(() => new Date());
  if (!note) return null;
  const year = cursor.getFullYear(), month = cursor.getMonth(), first = new Date(year, month, 1), days = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: first.getDay() + days }, (_, i) => i < first.getDay() ? null : i - first.getDay() + 1);
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}><div className="w-[270px] rounded-2xl border border-white/10 bg-[#241C16] p-3 shadow-2xl"><div className="mb-2 flex items-center justify-between"><button onClick={() => setCursor(new Date(year, month - 1, 1))} className="rounded p-1 hover:bg-white/10"><ChevronLeft className="h-4 w-4" /></button><span className="text-xs font-semibold">{cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span><button onClick={() => setCursor(new Date(year, month + 1, 1))} className="rounded p-1 hover:bg-white/10"><ChevronRight className="h-4 w-4" /></button></div><div className="grid grid-cols-7 gap-1 text-center text-[9px] text-[#9A8672]">{['S','M','T','W','T','F','S'].map((d,i) => <span key={`${d}${i}`}>{d}</span>)}</div><div className="mt-1 grid grid-cols-7 gap-1">{cells.map((d,i) => d === null ? <span key={i} /> : <button key={i} onClick={() => onDate(`${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`)} className="h-8 rounded-lg text-xs hover:bg-white/10">{d}</button>)}</div><button onClick={onClose} className="mt-2 w-full rounded-lg py-1.5 text-xs text-[#9A8672] hover:bg-white/10">Close</button></div></div>;
}
