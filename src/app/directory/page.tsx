'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, ExternalLink, Grid2X2, Heart, List, Search } from 'lucide-react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { UnifiedSidebar } from '@/components/unified-sidebar';
import { initialLinks, type ResourceLink } from '@/lib/resource-data';

const STORAGE_KEY = 'streamearn-directory-v3';
const DIRECTORY_LIMIT = 50;
const HIDDEN_DIRECTORY_TAGS = new Set(['Monday', 'Tuesday', 'Learning']);
// Known stale/retired destinations are excluded until re-verified. Keep this list explicit so bad links never surface silently.
const INACTIVE_OR_RETIRED_IDS = new Set(['42', '68']);

const CATEGORY_ORDER = [
  'AI', 'Developer', 'Cybersecurity', 'Security', 'Careers', 'Internships', 'Jobs',
  'Business', 'Real Estate', 'Platforms', 'Cloud', 'Productivity', 'Data',
  'Design', 'Discovery', 'Reviews', 'India', 'Startups', 'Technology', 'Coding',
  'Web', 'Research', 'Standards', 'Practice', 'Labs', 'CTF', 'Linux', 'Roadmaps',
];

function activeLinks() {
  return initialLinks.filter((item) => !INACTIVE_OR_RETIRED_IDS.has(item.id));
}

function curatedFor(category: string) {
  const pool = category === 'All'
    ? activeLinks()
    : activeLinks().filter((item) => item.tags.includes(category));
  return pool
    .filter((item) => !item.tags.some((tag) => HIDDEN_DIRECTORY_TAGS.has(tag)))
    .slice(0, DIRECTORY_LIMIT);
}

type SavedState = { isFavorite?: boolean; visitCount?: number };

export default function DirectoryPage() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [links, setLinks] = useState<ResourceLink[]>(() => curatedFor('All'));

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as Record<string, SavedState>;
      setLinks(curatedFor(category).map((item) => ({
        ...item,
        isFavorite: saved[item.id]?.isFavorite === true,
        visitCount: Number.isFinite(saved[item.id]?.visitCount) ? Math.max(0, Number(saved[item.id]?.visitCount)) : 0,
      })));
    } catch {
      setLinks(curatedFor(category));
    }
  }, [category]);

  const categories = useMemo(() => {
    const available = new Set<string>();
    activeLinks().forEach((item) => item.tags.forEach((tag) => {
      if (!HIDDEN_DIRECTORY_TAGS.has(tag)) available.add(tag);
    }));
    return ['All', ...CATEGORY_ORDER.filter((tag) => available.has(tag)), ...Array.from(available).filter((tag) => !CATEGORY_ORDER.includes(tag)).sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return links.filter((link) => {
      const text = `${link.title} ${link.description || ''} ${link.tags.join(' ')}`.toLowerCase();
      return (!q || text.includes(q)) && (!favoritesOnly || link.isFavorite);
    });
  }, [links, query, favoritesOnly]);

  function persist(next: ResourceLink[]) {
    setLinks(next);
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as Record<string, SavedState>;
      next.forEach((item) => { saved[item.id] = { isFavorite: item.isFavorite, visitCount: item.visitCount }; });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {}
  }

  function toggleFavorite(id: string) {
    persist(links.map((item) => item.id === id ? { ...item, isFavorite: !item.isFavorite } : item));
  }

  function openLink(item: ResourceLink) {
    persist(links.map((link) => link.id === item.id ? { ...link, visitCount: link.visitCount + 1 } : link));
  }

  const availableCount = curatedFor(category).length;
  const title = category === 'All' ? 'Top 50 resources' : `Top 50 ${category}`;
  const subtitle = category === 'All'
    ? 'Curated, active resources across AI, development, cybersecurity, careers, business, real estate, cloud and platforms.'
    : `Curated active ${category.toLowerCase()} resources inside the StreamEarn workspace.`;

  return (
    <SidebarProvider>
      <UnifiedSidebar />
      <SidebarInset className="min-w-0 bg-[#0d0c0a]">
        <main className="min-h-screen bg-[#0d0c0a] px-4 py-8 text-[#f1ece3] sm:px-8 lg:px-12">
          <section className="mx-auto max-w-7xl">
            <header className="mb-8 border-b border-[#292622] pb-7">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ff6b5a]">Resource Directory</p>
                  <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}, <em className="font-serif font-normal">organized.</em></h1>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-[#9d978e]">{subtitle}</p>
                </div>
                <div className="text-right text-xs text-[#777168]"><strong className="text-2xl font-medium text-[#f1ece3]">{filtered.length}</strong><br />of {availableCount}</div>
              </div>
            </header>

            <div className="mb-5 flex flex-col gap-3 lg:flex-row">
              <label className="flex h-11 flex-1 items-center gap-3 rounded-xl border border-[#302c27] bg-[#151311] px-4 text-[#8e887f] focus-within:border-[#ff6b5a]">
                <Search className="h-4 w-4" />
                <input value={query} onChange={(e) => setQuery(e.target.value.slice(0, 120))} placeholder="Search resources, companies, skills..." className="w-full bg-transparent text-sm text-[#f1ece3] outline-none placeholder:text-[#625d56]" />
              </label>
              <div className="flex gap-2">
                <button onClick={() => setFavoritesOnly((value) => !value)} className={`rounded-xl border px-4 text-xs ${favoritesOnly ? 'border-[#ff6b5a] bg-[#211613] text-[#ff8b7d]' : 'border-[#302c27] bg-[#151311] text-[#9d978e]'}`}><Heart className="mr-2 inline h-3.5 w-3.5" />Favorites</button>
                <div className="flex rounded-xl border border-[#302c27] bg-[#151311] p-1">
                  <button aria-label="Grid view" onClick={() => setView('grid')} className={`rounded-lg p-2 ${view === 'grid' ? 'bg-[#29231f] text-[#f1ece3]' : 'text-[#777168]'}`}><Grid2X2 className="h-4 w-4" /></button>
                  <button aria-label="List view" onClick={() => setView('list')} className={`rounded-lg p-2 ${view === 'list' ? 'bg-[#29231f] text-[#f1ece3]' : 'text-[#777168]'}`}><List className="h-4 w-4" /></button>
                </div>
              </div>
            </div>

            <div className="mb-7 flex gap-2 overflow-x-auto pb-1">
              {categories.map((item) => <button key={item} onClick={() => { setCategory(item); setQuery(''); setFavoritesOnly(false); }} className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] ${category === item ? 'border-[#ff6b5a] bg-[#211613] text-[#ff8b7d]' : 'border-[#302c27] text-[#817b73] hover:border-[#514a43]'}`}>{item}</button>)}
            </div>

            {filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-[#302c27] px-6 py-16 text-center text-sm text-[#777168]">No active resources match these filters.</div> : view === 'grid' ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((item) => <article key={item.id} className="group rounded-2xl border border-[#292622] bg-[#141210] p-5 transition hover:-translate-y-0.5 hover:border-[#48413a]">
                  <div className="mb-5 flex items-start justify-between gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#211f1b] text-xs font-semibold text-[#ff8b7d]">{item.title.slice(0, 1)}</div><button aria-label={`${item.isFavorite ? 'Remove' : 'Add'} ${item.title} favorite`} onClick={() => toggleFavorite(item.id)} className="text-[#777168] hover:text-[#ff8b7d]"><Heart className={`h-4 w-4 ${item.isFavorite ? 'fill-current text-[#ff6b5a]' : ''}`} /></button></div>
                  <h2 className="text-base font-semibold text-[#f1ece3]">{item.title}</h2><p className="mt-2 min-h-10 text-xs leading-5 text-[#8f8981]">{item.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">{item.tags.filter((tag) => !HIDDEN_DIRECTORY_TAGS.has(tag)).slice(0, 4).map((tag) => <span key={tag} className="rounded-md bg-[#1e1b18] px-2 py-1 text-[10px] text-[#777168]">{tag}</span>)}</div>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={() => openLink(item)} className="mt-5 flex items-center justify-between border-t border-[#292622] pt-4 text-xs font-medium text-[#ff806f]">Open resource <ArrowUpRight className="h-3.5 w-3.5" /></a>
                </article>)}
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-[#292622] bg-[#141210]">{filtered.map((item) => <div key={item.id} className="flex items-center gap-4 border-b border-[#292622] p-4 last:border-0"><button onClick={() => toggleFavorite(item.id)} className="text-[#777168]"><Heart className={`h-4 w-4 ${item.isFavorite ? 'fill-current text-[#ff6b5a]' : ''}`} /></button><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{item.title}</p><p className="truncate text-xs text-[#777168]">{item.description}</p></div><a href={item.url} target="_blank" rel="noopener noreferrer" onClick={() => openLink(item)} className="text-[#ff806f]"><ExternalLink className="h-4 w-4" /></a></div>)}</div>
            )}
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
