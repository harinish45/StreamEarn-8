'use client';

export default function ProjectsLoading() {
  return (
    <main className="min-h-screen bg-[hsl(var(--main-bg))] font-sans text-[hsl(var(--text-primary))]">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <header className="sticky top-0 z-30 -mx-5 border-b border-[hsl(var(--border-color))] bg-[hsl(var(--main-bg)/0.96)] px-5 py-3 backdrop-blur sm:-mx-6 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="h-4 w-36 animate-pulse rounded bg-[hsl(var(--card-bg))]" />
              <div className="mt-1.5 h-2 w-28 animate-pulse rounded bg-[hsl(var(--card-bg))]" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-16 animate-pulse rounded-lg bg-[hsl(var(--card-bg))]" />
              <div className="h-8 w-24 animate-pulse rounded-lg bg-[hsl(var(--card-bg))]" />
            </div>
          </div>
        </header>
        <section className="py-8">
          <div className="h-3 w-24 animate-pulse rounded bg-[hsl(var(--card-bg))]" />
          <div className="mt-3 h-12 w-80 max-w-full animate-pulse rounded bg-[hsl(var(--card-bg))]" />
          <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-[hsl(var(--card-bg))]" />
          <div className="mt-5 flex flex-wrap gap-2">
            {[1,2,3,4,5].map((x) => <div key={x} className="h-8 w-20 animate-pulse rounded-lg bg-[hsl(var(--card-bg))]" />)}
          </div>
        </section>
        <section className="space-y-2.5 pb-14">
          {[1,2,3].map((x) => (
            <div key={x} className="h-28 animate-pulse rounded-[15px] border border-[hsl(var(--border-color))] bg-[hsl(var(--card-bg)/.72)]" />
          ))}
        </section>
      </div>
    </main>
  );
}
