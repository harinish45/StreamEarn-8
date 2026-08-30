'use client';

import { useMemo, useState } from 'react';
import { BriefcaseBusiness, ExternalLink, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import internships from '@/data/scheduled/internships.json';
import scholarships from '@/data/scheduled/scholarships.json';

type Kind = 'Internship' | 'Scholarship';
type RecordItem = {
  id: string;
  title: string;
  url: string;
  source: string;
  published: string;
  collectedAt?: string;
  organization: string;
  focus: string;
  location: string;
  summary: string;
  eligibility: string;
  status?: 'active' | 'expired';
};

export function ScheduledOpportunityFeed({ kind }: { kind: Kind }) {
  const all = (kind === 'Internship' ? internships : scholarships) as RecordItem[];
  const [showExpired, setShowExpired] = useState(false);
  const visible = useMemo(
    () => all.filter(item => showExpired || item.status !== 'expired'),
    [all, showExpired],
  );

  return <section className="mb-5 rounded-2xl border bg-card p-4 sm:p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.16em] text-primary">
          {kind === 'Internship' ? <BriefcaseBusiness className="h-3.5 w-3.5" /> : <GraduationCap className="h-3.5 w-3.5" />}
          Active opportunities
          <Badge variant="outline" className="text-[8px]">Verified feed</Badge>
        </div>
        <h2 className="mt-1 text-lg font-semibold">Current {kind.toLowerCase()} opportunities</h2>
        <p className="mt-1 max-w-2xl text-xs text-muted-foreground">Stale records are automatically archived; only current records are shown by default.</p>
      </div>
      <button type="button" onClick={() => setShowExpired(v => !v)} className="text-[10px] text-muted-foreground hover:text-foreground">
        {showExpired ? 'Hide archived' : 'Show archived'}
      </button>
    </div>
    {!visible.length ? <div className="mt-4 rounded-xl border border-dashed p-7 text-center text-xs text-muted-foreground">No active opportunities are currently verified.</div> : <div className="mt-4 grid gap-3 lg:grid-cols-2">
      {visible.map(item => <article key={item.id} className="group rounded-xl border bg-background p-3.5 transition hover:border-primary/40">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-[9px]">{item.focus}</Badge>
              <Badge variant="outline" className="text-[9px]">{item.location}</Badge>
              {item.status === 'expired' && <Badge variant="outline" className="text-[9px]">Archived</Badge>}
            </div>
            <h3 className="mt-2 text-sm font-semibold leading-5">{item.title}</h3>
            <p className="mt-1 text-[10px] text-muted-foreground">{item.organization} · {item.source}</p>
          </div>
        </div>
        <p className="mt-2 line-clamp-3 text-xs leading-4 text-muted-foreground">{item.summary}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-[9px] text-muted-foreground">Verified {new Date(item.collectedAt || item.published).toLocaleDateString()}</span>
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] font-medium text-primary hover:underline">Open source <ExternalLink className="h-3 w-3" /></a>
        </div>
      </article>)}
    </div>}
  </section>;
}
