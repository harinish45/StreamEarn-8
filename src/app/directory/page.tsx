'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, CheckCircle2, ExternalLink, Grid2X2, Heart, List, Search } from 'lucide-react';
import { businessDirectoryResources, type BusinessDirectoryResource } from '@/lib/business-directory-data';
import { Header } from '@/components/header';

const STORAGE_KEY = 'streamearn-business-directory-v1';
const DIRECTORY_LIMIT = 50;
const PRIMARY_CATEGORIES = ['All', 'Business', 'Real Estate', 'Franchise', 'Jobs', 'Import/Export'];
const SECONDARY_FILTERS = ['India', 'Global', 'Government', 'Industry Body', 'Established platform', 'Remote', 'Internships', 'MSME', 'Startups', 'Commercial', 'Export', 'Import'];

type SavedState = { isFavorite?: boolean; visitCount?: number };

export default function DirectoryPage() {
  const [primaryCategory, setPrimaryCategory] = useState('All');
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [savedState, setSavedState] = useState<Record<string, SavedState>>({});

  useEffect(() => {
    try {
      setSavedState(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as Record<string, SavedState>);
    } catch {}
  }, []);

  const curated = useMemo(() => {
    let pool = businessDirectoryResources;
    if (primaryCategory !== 'All') pool = pool.filter((item) => item.tags.includes(primaryCategory));
    if (activeFilters.size > 0) pool = pool.filter((item) => Array.from(activeFilters).every((filter) => item.tags.includes(filter)));
    return pool.slice(0, DIRECTORY_LIMIT);
  }, [primaryCategory, activeFilters]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return curated.filter((item) => {
      const text = `${item.title} ${item.description} ${item.tags.join(' ')}`.toLowerCase();
      const favorite = savedState[item.id]?.isFavorite === true;
      return (!q || text.includes(q)) && (!favoritesOnly || favorite);
    });
  }, [curated, query, favoritesOnly, savedState]);

  const links = useMemo<BusinessDirectoryResource[]>(() => filtered.map((item) => ({
    ...item,
    isFavorite: savedState[item.id]?.isFavorite === true,
    visitCount: Number.isFinite(savedState[item.id]?.visitCount) ? Math.max(0, Number(savedState[item.id]?.visitCount)) : 0,
  })), [filtered, savedState]);

  function persist(item: BusinessDirectoryResource, patch: SavedState) {
    try {
      const next = { ...savedState, [item.id]: { ...savedState[item.id], ...patch } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSavedState(next);
    } catch {}
  }

  function toggleFavorite(item: BusinessDirectoryResource) {
    persist(item, { isFavorite: !item.isFavorite });
  }

  function openLink(item: BusinessDirectoryResource) {
    persist(item, { visitCount: item.visitCount + 1 });
  }

  function toggleSecondaryFilter(filter: string) {
    setActiveFilters((previous) => {
      const next = new Set(previous);
      if (next.has(filter)) next.delete(filter); else next.add(filter);
      return next;
    });
  }

  const title = primaryCategory === 'All' ? 'Trusted business resources' : `${primaryCategory} resources`;
  const subtitle = primaryCategory === 'All'
    ? 'Only business, real estate, franchise, jobs and import/export platforms — prioritising government portals, recognised industry bodies and established services.'
    : `Active ${primaryCategory.toLowerCase()} platforms, curated for practical use and verified source quality.`;

  return (
    <>
      <Header showSidebarTrigger />
      <div className="px-4 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <header className="mb-6 border-b border-[#292622] pb-6">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ff6b5a]">Resource Directory</p>
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}, <em className="font-serif font-normal">organized.</em></h1>
                <p className="mt-2 max-w-4xl text-sm leading-6 text-[#9d978e]">{subtitle}</p>
              </div>
              <div className="text-right text-xs text-[#777168]">
                <strong className="text-2xl font-medium text-[#f1ece3]">{filtered.length}</strong><br />of {curated.length} active
              </div>
            </div>
          </header>

          <div className="mb-5 flex flex-col gap-3 lg:flex-row">
            <label className="flex h-11 flex-1 items-center gap-3 rounded-xl border border-[#302c27] bg-[#151311] px-4 text-[#8e887f] focus-within:border-[#ff6b5a]">
              <Search className="h-4 w-4" />
              <input value={query} onChange={(event) => setQuery(event.target.value.slice(0, 120))} placeholder="Search businesses, platforms, jobs, property, trade..." className="w-full bg-transparent text-sm text-[#f1ece3] outline-none placeholder:text-[#625d56]" />
            </label>
            <div className="flex gap-2">
              <button onClick={() => setFavoritesOnly((value) => !value)} className={`rounded-xl border px-4 text-xs ${favoritesOnly ? 'border-[#ff6b5a] bg-[#211613] text-[#ff8b7d]' : 'border-[#302c27] bg-[#151311] text-[#9d978e]'}`}>
                <Heart className="mr-2 inline h-3.5 w-3.5" />Favorites
              </button>
              <div className="flex rounded-xl border border-[#302c27] bg-[#151311] p-1">
                <button aria-label="Grid view" onClick={() => setView('grid')} className={`rounded-lg p-2 ${view === 'grid' ? 'bg-[#29231f] text-[#f1ece3]' : 'text-[#777168]'}`}><Grid2X2 className="h-4 w-4" /></button>
                <button aria-label="List view" onClick={() => setView('list')} className={`rounded-lg p-2 ${view === 'list' ? 'bg-[#29231f] text-[#f1ece3]' : 'text-[#777168]'}`}><List className="h-4 w-4" /></button>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#777168]">Directory categories</p>
            <div className="flex flex-wrap gap-2">
              {PRIMARY_CATEGORIES.map((item) => (
                <button key={item} onClick={() => { setPrimaryCategory(item); setQuery(''); setFavoritesOnly(false); setActiveFilters(new Set()); }} className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors ${primaryCategory === item ? 'border-[#ff6b5a] bg-[#211613] text-[#ff8b7d]' : 'border-[#302c27] text-[#817b73] hover:border-[#514a43]'}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-7">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#777168]">Useful filters</p>
            <div className="flex flex-wrap gap-2">
              {SECONDARY_FILTERS.map((item) => (
                <button key={item} onClick={() => toggleSecondaryFilter(item)} className={`whitespace-nowrap rounded-md border px-2.5 py-1 text-[10px] transition-colors ${activeFilters.has(item) ? 'border-[#ff6b5a] bg-[#211613] text-[#ff8b7d]' : 'border-[#302c27] text-[#817b73] hover:border-[#514a43]'}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#302c27] px-6 py-16 text-center text-sm text-[#777168]">No active resources match these filters.</div>
          ) : view === 'grid' ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {links.map((item) => (
                <article key={item.id} className="group flex min-h-[250px] flex-col rounded-2xl border border-[#292622] bg-[#141210] p-5 transition hover:-translate-y-0.5 hover:border-[#48413a]">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#211f1b] text-xs font-semibold text-[#ff8b7d]">{item.title.slice(0, 1)}</div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#1d211b] px-2 py-1 text-[9px] text-[#9fb18f]"><CheckCircle2 className="h-3 w-3" />{item.sourceType}</span>
                    </div>
                    <button aria-label={`${item.isFavorite ? 'Remove' : 'Add'} ${item.title} favorite`} onClick={() => toggleFavorite(item)} className="text-[#777168] hover:text-[#ff8b7d]"><Heart className={`h-4 w-4 ${item.isFavorite ? 'fill-current text-[#ff6b5a]' : ''}`} /></button>
                  </div>
                  <h2 className="text-base font-semibold text-[#f1ece3]">{item.title}</h2>
                  <p className="mt-2 text-xs leading-5 text-[#8f8981]">{item.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.tags.slice(0, 4).map((tag) => <span key={tag} className="rounded-md bg-[#1e1b18] px-2 py-1 text-[10px] text-[#777168]">{tag}</span>)}
                  </div>
                  {(item.contactEmail || item.contactPhone) && (
                    <div className="mt-4 space-y-1 border-t border-[#292622] pt-3 text-[10px] text-[#777168]">
                      {item.contactEmail && <div className="truncate">Email: {item.contactEmail}</div>}
                      {item.contactPhone && <div>Phone: {item.contactPhone}</div>}
                    </div>
                  )}
                  <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={() => openLink(item)} className="mt-auto flex items-center justify-between border-t border-[#292622] pt-4 text-xs font-medium text-[#ff806f]">
                    Open official platform <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-[#292622] bg-[#141210]">
              {links.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border-b border-[#292622] p-4 last:border-0">
                  <button onClick={() => toggleFavorite(item)} className="text-[#777168]"><Heart className={`h-4 w-4 ${item.isFavorite ? 'fill-current text-[#ff6b5a]' : ''}`} /></button>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2"><p className="truncate text-sm font-medium">{item.title}</p><CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#8fa07f]" /></div>
                    <p className="truncate text-xs text-[#777168]">{item.description}</p>
                  </div>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={() => openLink(item)} className="text-[#ff806f]" aria-label={`Open ${item.title}`}><ExternalLink className="h-4 w-4" /></a>
                </div>
              ))}
            </div>
          )}

          <p className="mt-6 text-[10px] text-[#625d56]">Directory scope is intentionally limited to business, real estate, franchise, jobs and import/export. Listings are platforms and official resources, not individual opportunities.</p>
        </div>
      </div>
    </>
  );
}
