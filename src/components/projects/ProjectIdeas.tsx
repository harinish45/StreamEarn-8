'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Lightbulb, Plus, X } from 'lucide-react';

type Idea = { id: string; name: string; description: string; created_at: string; updated_at: string };

export default function ProjectIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/project-ideas', { credentials: 'same-origin', cache: 'no-store' })
      .then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d?.error || 'Unable to load ideas'); return d; })
      .then((d) => setIdeas(Array.isArray(d) ? d : []))
      .catch((e) => setError(e instanceof Error ? e.message : 'Unable to load ideas'));
  }, []);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || saving) return;
    setSaving(true); setError('');
    try {
      const r = await fetch('/api/project-ideas', {
        method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim() }), cache: 'no-store',
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d?.error || `Unable to save idea (${r.status})`);
      setIdeas((current) => [d, ...current]);
      setName(''); setDescription(''); setOpen(false);
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to save idea'); }
    finally { setSaving(false); }
  };

  return (
    <section className="pb-16 pt-8" aria-labelledby="ideas-title">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-[#ff6b5a]"><Lightbulb className="h-3.5 w-3.5" />Ideas</div>
          <h2 id="ideas-title" className="font-serif text-3xl italic">Ideas worth keeping.</h2>
          <p className="mt-1 text-[10px] text-[#8a8478]">Only a name and description. No project workflow fields.</p>
        </div>
        <button type="button" onClick={() => { setError(''); setOpen(true); }} className="inline-flex items-center gap-1.5 rounded-lg bg-[#ff6b5a] px-3 py-2 text-[11px] font-semibold text-[#0d0c0a]"><Plus className="h-3.5 w-3.5" />New Idea</button>
      </div>
      {error && <div className="mb-4 rounded-lg border border-[#ff6b5a]/20 bg-[#ff6b5a]/[0.04] px-3 py-2 text-xs text-[#ff8a7d]">{error}</div>}
      {ideas.length === 0 ? <div className="rounded-xl border border-dashed border-[#2a2622] bg-[#161412]/50 p-7 text-center text-xs text-[#8a8478]">No ideas yet. Capture one before it disappears.</div> : <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{ideas.map((idea) => <article key={idea.id} className="rounded-xl border border-[#2a2622] bg-[#161412]/70 p-5 transition-transform duration-300 hover:-translate-y-0.5 hover:border-[#ff6b5a]/35"><h3 className="text-sm font-semibold">{idea.name}</h3><p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-[#8a8478]">{idea.description || 'No description.'}</p></article>)}</div>}

      {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"><form onSubmit={save} className="w-full max-w-lg rounded-2xl border border-[#2a2622] bg-[#161412] p-5 shadow-2xl"><div className="mb-5 flex items-center justify-between"><div><h3 className="text-sm font-semibold">New Idea</h3><p className="mt-1 text-[10px] text-[#8a8478]">Keep it simple: name + description.</p></div><button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-[#8a8478] hover:bg-white/[0.04]"><X className="h-4 w-4" /></button></div><label className="mb-4 block"><span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#c9c0b5]">Name</span><input required autoFocus maxLength={160} value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-[#2a2622] bg-[#0d0c0a] px-3 py-2.5 text-sm outline-none focus:border-[#ff6b5a]/50" /></label><label className="mb-5 block"><span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#c9c0b5]">Description</span><textarea maxLength={2000} rows={5} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full resize-y rounded-lg border border-[#2a2622] bg-[#0d0c0a] px-3 py-2.5 text-sm outline-none focus:border-[#ff6b5a]/50" /></label><div className="flex justify-end gap-2"><button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-[#2a2622] px-3 py-2 text-xs text-[#c9c0b5]">Cancel</button><button type="submit" disabled={saving || !name.trim()} className="rounded-lg bg-[#ff6b5a] px-4 py-2 text-xs font-semibold text-[#0d0c0a] disabled:cursor-not-allowed disabled:opacity-50">{saving ? 'Saving…' : 'Save Idea'}</button></div></form></div>}
    </section>
  );
}
