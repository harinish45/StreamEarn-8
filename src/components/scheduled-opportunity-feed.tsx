'use client';

import { useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, ExternalLink, GraduationCap, Trash2, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import internships from '@/data/scheduled/internships.json';
import scholarships from '@/data/scheduled/scholarships.json';

type Kind = 'Internship' | 'Scholarship';
type RecordItem = {
  id: string; title: string; url: string; source: string; published: string;
  organization: string; focus: string; location: string; summary: string; eligibility: string;
};

const hiddenKey = 'streamearn-scheduled-deleted-v1';

export function ScheduledOpportunityFeed({ kind }: { kind: Kind }) {
  const all = (kind === 'Internship' ? internships : scholarships) as RecordItem[];
  const [hidden, setHidden] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(hiddenKey) || '[]');
      if (Array.isArray(raw)) setHidden(raw.filter((x): x is string => typeof x === 'string'));
    } catch {}
  }, []);

  const visible = useMemo(() => all.filter(item => !hidden.includes(item.id)), [all, hidden]);
  const remove = (id: string) => {
    const next = [...new Set([...hidden, id])];
    setHidden(next);
    localStorage.setItem(hiddenKey, JSON.stringify(next));
  };

  return <section className="mb-5 rounded-2xl border bg-card p-4 sm:p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.16em] text-primary">
          {kind === 'Internship' ? <BriefcaseBusiness className="h-3.5 w-3.5" /> : <GraduationCap className="h-3.5 w-3.5" />}
          Daily additions
          <Badge variant="outline" className="text-[8px]">Append-only</Badge>
        </div>
        <h2 className="mt-1 text-lg font-semibold">New {kind.toLowerCase()} records</h2>
        <p className="mt-1 max-w-2xl text-xs text-muted-foreground">New records are added to the existing history. Nothing here is automatically replaced or deleted.</p>
      </div>
      <div className="inline-flex items-center gap-1 text-[10px] text-muted-foreground"><RefreshCw className="h-3 w-3" /> Scheduled daily</div>
    </div>

    {!visible.length ? <div className="mt-4 rounded-xl border border-dashed p-7 text-center text-xs text-muted-foreground">No scheduled additions yet. Existing opportunities remain unchanged.</div> :
      <div className="mt-4 grid gap-3 lg:grid-cols-2">{visible.map(item => <article key={item.id} className="group rounded-xl border bg-background p-3.5 transition hover:border-primary/40">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0"><div className="flex flex-wrap gap-1"><Badge variant="secondary" className="text-[9px]">{item.focus}</Badge><Badge variant="outline" className="text-[9px]">{item.location}</Badge></div><h3 className="mt-2 text-sm font-semibold leading-5">{item.title}</h3><p className="mt-1 text-[10px] text-muted-foreground">{item.organization} · {item.source}</p></div>
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" title="Delete this scheduled record" onClick={() => remove(item.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
        </div>
        <p className="mt-2 line-clamp-3 text-xs leading-4 text-muted-foreground">{item.summary}</p>
        <div className="mt-3 flex items-center justify-between gap-2"><span className="text-[9px] text-muted-foreground">Added {new Date(item.collectedAt || item.published).toLocaleDateString()}</span><a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-medium text-primary hover:underline">Open source <ExternalLink className="h-3 w-3" /></a></div>
      </article>)}</div>}
  </section>;
}
