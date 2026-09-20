'use client';

import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, GraduationCap, Lightbulb, ShieldCheck } from 'lucide-react';
import { Header } from '@/components/header';

export default function OpportunitiesPage() {
  return (
    <>
      <Header showSidebarTrigger />
      <main className="mx-auto w-full max-w-[1380px] px-3 pb-10 pt-6 sm:px-5 lg:px-7">
        <section className="rounded-2xl border bg-card p-6 sm:p-8">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-primary">
            <ShieldCheck className="h-4 w-4" />
            Verified Opportunity Radar
          </div>

          <h1 className="mt-2 text-3xl font-bold">Current Opportunities</h1>

          <p className="mt-2 max-w-4xl text-sm text-muted-foreground">
            Browse three dedicated radars: internships, scholarships and broader programs such as ambassador,
            fellowship, research, open-source, mentorship, community and student training opportunities.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Link href="/internships" className="group rounded-2xl border bg-background p-6 transition hover:border-primary/50">
              <BriefcaseBusiness className="h-7 w-7 text-primary" />
              <h2 className="mt-4 text-xl font-semibold">Internship Radar</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Closing soon → Open now → Upcoming. Verified India, Tamil Nadu, remote and global undergraduate opportunities.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                Open radar <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
              </span>
            </Link>

            <Link href="/scholarships" className="group rounded-2xl border bg-background p-6 transition hover:border-primary/50">
              <GraduationCap className="h-7 w-7 text-primary" />
              <h2 className="mt-4 text-xl font-semibold">Scholarship Radar</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Strict undergraduate eligibility filter with official-source links and personal tracking.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                Open radar <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
              </span>
            </Link>

            <Link href="/programs" className="group rounded-2xl border bg-background p-6 transition hover:border-primary/50">
              <Lightbulb className="h-7 w-7 text-primary" />
              <h2 className="mt-4 text-xl font-semibold">Programs</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ambassador, fellowship, research, open-source, mentorship, leadership, community and training programs.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                Open Programs <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
