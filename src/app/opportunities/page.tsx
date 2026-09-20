'use client';

import Link from 'next/link';
import {
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  GraduationCap,
  Lightbulb,
  Radar,
  Sparkles,
} from 'lucide-react';
import { Header } from '@/components/header';

const cards = [
  {
    href: '/internships',
    label: 'INTERNSHIPS',
    title: 'Get real-world experience',
    description: 'Company, research and engineering internships with application tracking and official-source links.',
    action: 'Explore internships',
    icon: BriefcaseBusiness,
    accent: 'from-blue-600/25 via-cyan-500/10 to-transparent',
    iconTone: 'text-cyan-300',
    stat: 'Experience',
    meta: 'Build your resume',
  },
  {
    href: '/scholarships',
    label: 'SCHOLARSHIPS',
    title: 'Find funding for your degree',
    description: 'Undergraduate-focused scholarships filtered for eligibility, timing and official application sources.',
    action: 'Explore scholarships',
    icon: GraduationCap,
    accent: 'from-emerald-600/25 via-lime-500/10 to-transparent',
    iconTone: 'text-emerald-300',
    stat: 'Funding',
    meta: 'Support your studies',
  },
  {
    href: '/programs',
    label: 'PROGRAMS',
    title: 'Build your next advantage',
    description: 'Ambassador, fellowship, research, open-source, mentorship, leadership and innovation programs.',
    action: 'Explore programs',
    icon: Lightbulb,
    accent: 'from-violet-600/30 via-fuchsia-500/10 to-transparent',
    iconTone: 'text-fuchsia-300',
    stat: 'Growth',
    meta: 'Skills + community + network',
  },
];

export default function OpportunitiesPage() {
  return (
    <>
      <Header showSidebarTrigger />
      <main className="mx-auto w-full max-w-[1440px] px-3 pb-12 pt-4 sm:px-5 lg:px-7">
        <section className="relative overflow-hidden rounded-[26px] border border-border/70 bg-card">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,hsl(var(--text-accent)/.18),transparent_34%),radial-gradient(circle_at_88%_20%,rgba(99,102,241,.16),transparent_28%)]" />
          <div className="relative p-6 md:p-8 lg:p-10">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/55 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[.18em] text-muted-foreground backdrop-blur">
                  <Radar className="h-3.5 w-3.5 text-primary" />
                  Opportunity Hub
                </div>
                <h1 className="mt-4 max-w-2xl font-serif text-4xl italic tracking-tight md:text-5xl">
                  Find opportunities that move you forward.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Discover ways to gain experience, reduce study costs, build skills and expand your network.
                  Each radar keeps the next step close to the official source.
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-[10px]">
                  {[
                    ['Verified sources', BadgeCheck],
                    ['Application tracking', Clock3],
                    ['Student-focused', Sparkles],
                  ].map(([label, Icon]) => (
                    <span key={String(label)} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/50 px-2.5 py-1.5 text-muted-foreground">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                      {String(label)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="hidden min-w-52 rounded-2xl border border-border/70 bg-background/45 p-4 text-right backdrop-blur sm:block">
                <div className="font-mono text-[9px] uppercase tracking-[.18em] text-muted-foreground">Your next move</div>
                <div className="mt-2 text-2xl font-semibold">Pick a radar</div>
                <div className="mt-1 text-[10px] leading-4 text-muted-foreground">Open one lane and start tracking applications.</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-[.18em] text-primary">Three ways to grow</div>
              <h2 className="mt-1 font-serif text-2xl tracking-tight md:text-3xl">Explore your next opportunity</h2>
            </div>
            <span className="hidden rounded-full border border-border bg-card px-2.5 py-1 text-[9px] text-muted-foreground sm:inline-flex">
              Discover → Track → Apply
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_50px_rgba(0,0,0,.18)]"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.accent}`} />
                  <div className="relative p-5 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className={`grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-background/60 ${card.iconTone}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full border border-border/80 bg-background/45 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[.16em] text-muted-foreground">
                        {card.label}
                      </span>
                    </div>

                    <div className="mt-8">
                      <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-muted-foreground">{card.stat}</p>
                      <h3 className="mt-1 text-xl font-semibold tracking-tight">{card.title}</h3>
                      <p className="mt-2 min-h-16 text-xs leading-5 text-muted-foreground">{card.description}</p>
                    </div>

                    <div className="mt-5 flex items-end justify-between gap-3 border-t border-border/70 pt-4">
                      <div>
                        <div className="text-[9px] uppercase tracking-[.14em] text-muted-foreground">Why open it</div>
                        <div className="mt-1 text-[10px] font-medium">{card.meta}</div>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-background/45 px-2.5 py-1.5 text-[10px] font-semibold transition group-hover:border-primary/40 group-hover:bg-primary/5">
                        {card.action}
                        <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
