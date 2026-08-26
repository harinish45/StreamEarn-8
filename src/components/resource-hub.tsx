'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { BookOpen, BriefcaseBusiness, ExternalLink, Heart, LayoutGrid, Search, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { initialLinks } from '@/lib/resource-data';

type ResourceLink = typeof initialLinks[number];

const sections = [
  { id: 'all', label: 'All Resources', icon: LayoutGrid },
  { id: 'Monday', label: 'AI Foundations', icon: BookOpen },
  { id: 'Cybersecurity', label: 'Cybersecurity', icon: ShieldCheck },
  { id: 'Careers', label: 'Careers', icon: BriefcaseBusiness },
  { id: 'Favorites', label: 'Favorites', icon: Heart },
];

function ResourceCard({ link, onFavorite }: { link: ResourceLink; onFavorite: () => void }) {
  return (
    <Card className="h-full transition hover:-translate-y-0.5 hover:border-primary/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base leading-6">{link.title}</CardTitle>
          <button aria-label={`Favorite ${link.title}`} onClick={onFavorite} className="rounded-md p-1 text-muted-foreground hover:text-primary">
            <Heart className={`h-4 w-4 ${link.isFavorite ? 'fill-current text-primary' : ''}`} />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">{link.description}</p>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {link.tags.slice(0, 4).map(tag => <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>)}
        </div>
        <Button asChild variant="outline" size="sm" className="w-full">
          <a href={link.url} target="_blank" rel="noreferrer">Open Resource <ExternalLink className="ml-2 h-3.5 w-3.5" /></a>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ResourceHub() {
  const [section, setSection] = useState('all');
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set(initialLinks.filter(link => link.isFavorite).map(link => link.id)));

  const links = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialLinks.filter(link => {
      const sectionMatch = section === 'all' || (section === 'Favorites' ? favorites.has(link.id) : link.tags.some(tag => tag.toLowerCase() === section.toLowerCase()));
      const queryMatch = !q || [link.title, link.description, ...link.tags].join(' ').toLowerCase().includes(q);
      return sectionMatch && queryMatch;
    }).slice(0, 120);
  }, [section, query, favorites]);

  const toggleFavorite = (id: string) => setFavorites(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 md:px-6 md:py-12">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-accent"><LayoutGrid className="h-5 w-5" /><span className="text-sm font-semibold uppercase tracking-[0.2em]">Integrated Resource Hub</span></div>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-serif tracking-tight md:text-5xl">Learning, cybersecurity & career resources</h1>
            <p className="mt-3 max-w-3xl text-muted-foreground">The resource library from the second project is now part of StreamEarn, alongside the AI directory, earning tools, leads and business directory.</p>
          </div>
          <Link href="/ai-tools" className="text-sm text-primary hover:underline">Open 2026 AI Directory →</Link>
        </div>
      </div>

      <div className="relative max-w-2xl"><Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search the integrated resource library..." className="h-12 rounded-full pl-11" /></div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {sections.map(({ id, label, icon: Icon }) => <Button key={id} variant={section === id ? 'default' : 'outline'} className="shrink-0 rounded-full" onClick={() => setSection(id)}><Icon className="mr-2 h-4 w-4" />{label}</Button>)}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground"><span>{links.length} resources shown</span><span>100 source resources integrated</span></div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {links.map(link => <ResourceCard key={link.id} link={{ ...link, isFavorite: favorites.has(link.id) }} onFavorite={() => toggleFavorite(link.id)} />)}
      </div>

      {links.length === 0 && <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">No resources match that filter.</div>}
    </main>
  );
}
