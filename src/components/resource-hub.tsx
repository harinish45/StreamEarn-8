'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { BookOpen, BriefcaseBusiness, ExternalLink, Heart, LayoutGrid, List, Search, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { initialLinks } from '@/lib/resource-data';

type ResourceLink = typeof initialLinks[number];
type ViewMode = 'grid' | 'list';

const sections = [
  { id: 'all', label: 'All Resources', icon: LayoutGrid },
  { id: 'Monday', label: 'AI Foundations', icon: BookOpen },
  { id: 'Cybersecurity', label: 'Cybersecurity', icon: ShieldCheck },
  { id: 'Careers', label: 'Careers & Jobs', icon: BriefcaseBusiness },
  { id: 'Favorites', label: 'Favorites', icon: Heart },
];
const imageFor = (id: string, index: number) => `https://picsum.photos/seed/streamearn-resource-${encodeURIComponent(id)}-${index}/900/600`;
const logoFor = (url: string) => { try { return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`; } catch { return ''; } };

function ResourceCard({ link, index, onFavorite, view }: { link: ResourceLink; index: number; onFavorite: () => void; view: ViewMode }) {
  const list = view === 'list'; const logo = logoFor(link.url);
  return <Card className={`group overflow-hidden transition hover:-translate-y-0.5 hover:border-primary/50 ${list ? 'flex min-h-[88px]' : ''}`}>
    <div className={`relative overflow-hidden bg-muted ${list ? 'w-28 shrink-0' : 'aspect-[16/6]'}`}><img src={imageFor(link.id, index)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-background/75 to-transparent" /></div>
    <CardHeader className="p-3 pb-1.5"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><div className="flex items-center gap-1.5">{logo && <img src={logo} alt="" className="h-4 w-4 rounded bg-white p-0.5" loading="lazy" />}<CardTitle className="truncate text-sm leading-5">{link.title}</CardTitle></div><p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-muted-foreground">{link.description}</p></div><div className="flex shrink-0 items-center gap-1"><a href={link.url} target="_blank" rel="noreferrer" aria-label={`Open ${link.title}`} className="rounded-md p-1 text-muted-foreground hover:text-foreground"><ExternalLink className="h-3.5 w-3.5" /></a><button aria-label={`Favorite ${link.title}`} onClick={onFavorite} className="rounded-md p-1 text-muted-foreground hover:text-primary"><Heart className={`h-3.5 w-3.5 ${link.isFavorite ? 'fill-current text-primary' : ''}`} /></button></div></div></CardHeader>
    <CardContent className="p-3 pt-0"><div className="flex flex-wrap gap-1">{link.tags.slice(0, 4).map(tag => <Badge key={tag} variant="secondary" className="px-1.5 py-0 text-[9px]">{tag}</Badge>)}</div></CardContent>
  </Card>;
}

export default function ResourceHub() {
  const [section, setSection] = useState('all'); const [query, setQuery] = useState(''); const [view, setView] = useState<ViewMode>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set(initialLinks.filter(link => link.isFavorite).map(link => link.id)));
  const links = useMemo(() => { const q = query.trim().toLowerCase(); return initialLinks.filter(link => { const sectionMatch = section === 'all' || (section === 'Favorites' ? favorites.has(link.id) : link.tags.some(tag => tag.toLowerCase() === section.toLowerCase())); const queryMatch = !q || [link.title, link.description, ...link.tags].join(' ').toLowerCase().includes(q); return sectionMatch && queryMatch; }).slice(0, 120); }, [section, query, favorites]);
  const toggleFavorite = (id: string) => setFavorites(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  return <main className="mx-auto w-full max-w-[1500px] space-y-4 px-3 py-4 md:px-5 md:py-6">
    <div className="space-y-2"><div className="flex items-center gap-1.5 text-accent"><LayoutGrid className="h-3.5 w-3.5" /><span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Integrated Resource Hub</span></div><div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between"><div><h1 className="text-3xl font-serif tracking-tight md:text-4xl">Learning, cybersecurity & career resources</h1><p className="mt-1 max-w-3xl text-xs leading-5 text-muted-foreground">A compact library of learning, cybersecurity, careers and platform resources.</p></div><Link href="/ai-tools" className="text-[10px] text-primary hover:underline">AI Directory →</Link></div></div>
    <div className="relative max-w-2xl"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" /><Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search the resource library..." className="h-9 rounded-full pl-9 text-xs" /></div>
    <div className="flex flex-wrap items-center gap-1.5"><div className="flex flex-wrap gap-1.5">{sections.map(({ id, label, icon: Icon }) => <Button key={id} variant={section === id ? 'default' : 'outline'} size="sm" className="h-8 rounded-full px-2.5 text-[10px]" onClick={() => setSection(id)}><Icon className="mr-1.5 h-3 w-3" />{label}</Button>)}</div><div className="ml-auto flex rounded-md border bg-card p-0.5"><Button size="sm" variant={view === 'grid' ? 'default' : 'ghost'} onClick={() => setView('grid')} className="h-7 px-2"><LayoutGrid className="h-3 w-3" /></Button><Button size="sm" variant={view === 'list' ? 'default' : 'ghost'} onClick={() => setView('list')} className="h-7 px-2"><List className="h-3 w-3" /></Button></div></div>
    <div className="flex items-center justify-between text-[10px] text-muted-foreground"><span>{links.length} resources</span><span>Verified library</span></div>
    <div className={view === 'list' ? 'space-y-2' : 'grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}>{links.map((link, i) => <ResourceCard key={link.id} link={{ ...link, isFavorite: favorites.has(link.id) }} index={i} onFavorite={() => toggleFavorite(link.id)} view={view} />)}</div>
    {!links.length && <div className="rounded-xl border border-dashed p-10 text-center text-xs text-muted-foreground">No resources match that filter.</div>}
  </main>;
}
