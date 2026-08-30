'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  BriefcaseBusiness,
  Cloud,
  ExternalLink,
  Grid2X2,
  Heart,
  LayoutGrid,
  List,
  Palette,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
  Rocket,
  Github,
  Database,
  MessageCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/header';
import { communityResources, curatedResources, featuredCourses, freeProjects, type CuratedResource, type FreeProject, type CommunityResource } from '@/lib/resource-hub-curated';

type FilterId = 'all' | CuratedResource['category'] | 'featured' | 'projects' | 'community' | 'courses';

const filters: { id: FilterId; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'all', label: 'All Platforms', icon: LayoutGrid },
  { id: 'AI Learning', label: 'AI Learning', icon: Sparkles },
  { id: 'Developer', label: 'Developer', icon: Terminal },
  { id: 'Cybersecurity', label: 'Cybersecurity', icon: ShieldCheck },
  { id: 'Cloud & Data', label: 'Cloud & Data', icon: Cloud },
  { id: 'Design', label: 'Design', icon: Palette },
  { id: 'Career', label: 'Career', icon: BriefcaseBusiness },
  { id: 'projects', label: 'Free Projects', icon: Rocket },
  { id: 'community', label: 'Communities', icon: Users },
  { id: 'courses', label: 'Flagship Courses', icon: BookOpen },
];

const visualFor = (title: string, category: string, variant = 0) => {
  const palettes: Record<string, [string, string, string]> = {
    'AI Learning': ['#111827', '#4f46e5', '#06b6d4'],
    Developer: ['#111827', '#2563eb', '#22c55e'],
    Cybersecurity: ['#111827', '#7c3aed', '#ec4899'],
    'Cloud & Data': ['#111827', '#0f766e', '#38bdf8'],
    Design: ['#111827', '#db2777', '#f59e0b'],
    Career: ['#111827', '#b45309', '#84cc16'],
    Project: ['#111827', '#0891b2', '#6366f1'],
    Community: ['#111827', '#059669', '#14b8a6'],
  };
  const [a, b, c] = palettes[category] ?? palettes['AI Learning'];
  const safe = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const initials = title.split(/\s+/).map((word) => word[0]).join('').slice(0, 3).toUpperCase();
  const offset = (variant * 37) % 100;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient><filter id="blur"><feGaussianBlur stdDeviation="34"/></filter></defs><rect width="1200" height="500" fill="url(#g)"/><circle cx="${190 + offset * 3}" cy="100" r="150" fill="white" opacity=".10" filter="url(#blur)"/><circle cx="980" cy="390" r="210" fill="white" opacity=".08" filter="url(#blur)"/><path d="M0 420 C240 280 380 520 650 360 S980 180 1200 300 V500 H0Z" fill="white" opacity=".07"/><text x="70" y="275" fill="white" font-family="Inter,Arial,sans-serif" font-size="92" font-weight="700" letter-spacing="6">${initials}</text><text x="70" y="345" fill="white" opacity=".82" font-family="Inter,Arial,sans-serif" font-size="27" font-weight="600">${safe}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

function ResourceCard({ resource, index, list, favorite, toggle }: { resource: CuratedResource; index: number; list: boolean; favorite: boolean; toggle: (id: string) => void }) {
  return (
    <Card className={`group overflow-hidden border-border/70 bg-card/80 transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg ${list ? 'flex' : ''}`}>
      <div className={`relative shrink-0 overflow-hidden ${list ? 'h-[92px] w-[150px] sm:h-[112px] sm:w-[180px]' : 'h-[118px] sm:h-[132px]'}`}>
        <img src={visualFor(resource.title, resource.category, index)} alt={`${resource.title} visual`} className="h-full w-full object-cover" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        {resource.featured && <Badge className="absolute bottom-2 left-2 border-0 bg-primary text-primary-foreground">Featured</Badge>}
      </div>
      <div className="min-w-0 flex-1">
        <CardHeader className="space-y-2 px-4 pb-2 pt-3 sm:px-5">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="min-w-0 text-[15px] font-semibold leading-5" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{resource.title}</CardTitle>
            <button aria-label={`Favorite ${resource.title}`} onClick={() => toggle(resource.id)} className="shrink-0 rounded-md p-1.5 text-muted-foreground transition hover:text-primary"><Heart className={`h-4 w-4 ${favorite ? 'fill-current text-primary' : ''}`} /></button>
          </div>
          <p className="text-xs leading-5 text-muted-foreground" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{resource.description}</p>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-1 sm:px-5">
          <div className="mb-3 flex min-h-6 flex-wrap gap-1.5">{resource.tags.slice(0, 3).map((tag) => <Badge key={tag} variant="secondary" className="text-[10px] font-medium">{tag}</Badge>)}</div>
          <Button asChild variant="outline" size="sm" className="h-9 w-full rounded-lg"><a href={resource.url} target="_blank" rel="noopener noreferrer">Open Platform <ExternalLink className="ml-2 h-3.5 w-3.5" /></a></Button>
        </CardContent>
      </div>
    </Card>
  );
}

function ProjectCard({ project, index }: { project: FreeProject; index: number }) {
  return (
    <Card className="group overflow-hidden border-border/70 bg-card/80 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
      <div className="relative h-[112px] overflow-hidden sm:h-[124px]"><img src={visualFor(project.title, 'Project', index + 100)} alt={`${project.title} visual`} className="h-full w-full object-cover" loading="lazy" decoding="async" /><Badge className="absolute left-3 top-3 border-0 bg-emerald-500/90 text-white">Free / $0 start</Badge></div>
      <CardContent className="p-5">
        <h3 className="line-clamp-2 text-base font-semibold leading-5">{project.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{project.description}</p>
        <div className="mt-3 flex min-h-6 flex-wrap gap-1.5">{project.tags.slice(0, 3).map((tag) => <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>)}</div>
        <p className="mt-3 text-xs font-medium text-foreground/80">Best for: {project.bestFor}</p>
        <Button asChild variant="outline" size="sm" className="mt-4 h-9 w-full"><a href={project.url} target="_blank" rel="noopener noreferrer">Start Project <ExternalLink className="ml-2 h-3.5 w-3.5" /></a></Button>
      </CardContent>
    </Card>
  );
}

function CommunityCard({ community, index }: { community: CommunityResource; index: number }) {
  return (
    <Card className="group overflow-hidden border-border/70 bg-card/80 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
      <div className="relative h-[104px] overflow-hidden sm:h-[116px]"><img src={visualFor(community.title, 'Community', index + 200)} alt={`${community.title} visual`} className="h-full w-full object-cover" loading="lazy" decoding="async" /><Badge variant="outline" className="absolute left-3 top-3 border-white/30 bg-black/35 text-white">{community.type}</Badge></div>
      <CardContent className="p-5">
        <div className="flex items-start gap-3"><div className="mt-0.5 rounded-lg border bg-muted/40 p-2"><MessageCircle className="h-4 w-4" /></div><div className="min-w-0"><h3 className="line-clamp-2 text-base font-semibold leading-5">{community.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{community.description}</p></div></div>
        <div className="mt-3 flex min-h-6 flex-wrap gap-1.5">{community.tags.slice(0, 3).map((tag) => <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>)}</div>
        <Button asChild variant="outline" size="sm" className="mt-4 h-9 w-full"><a href={community.url} target="_blank" rel="noopener noreferrer">Join Community <ExternalLink className="ml-2 h-3.5 w-3.5" /></a></Button>
      </CardContent>
    </Card>
  );
}

function CourseCard({ course, index }: { course: (typeof featuredCourses)[number]; index: number }) {
  return (
    <Card className="overflow-hidden border-primary/20 bg-card/80">
      <div className="h-[108px] overflow-hidden"><img src={visualFor(course.title, 'AI Learning', index + 40)} alt={`${course.title} visual`} className="h-full w-full object-cover" loading="lazy" decoding="async" /></div>
      <CardContent className="p-5"><Badge variant="outline" className="mb-3">Flagship course</Badge><h3 className="line-clamp-2 text-base font-semibold leading-5">{course.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{course.description}</p><Button asChild variant="outline" size="sm" className="mt-4 w-full"><a href={course.url} target="_blank" rel="noopener noreferrer">View course <ExternalLink className="ml-2 h-3.5 w-3.5" /></a></Button></CardContent>
    </Card>
  );
}

export default function EnhancedResourceHub() {
  const [section, setSection] = useState<FilterId>('all');
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const q = query.trim().toLowerCase();

  const matches = (values: string[]) => !q || values.join(' ').toLowerCase().includes(q);
  const resources = useMemo(() => curatedResources.filter((resource) => {
    if (section === 'projects' || section === 'community' || section === 'courses') return false;
    if (section !== 'all' && section !== 'featured' && resource.category !== section) return false;
    if (section === 'featured' && !resource.featured) return false;
    return matches([resource.title, resource.description, resource.category, ...resource.tags]);
  }), [q, section]);
  const projects = useMemo(() => freeProjects.filter((project) => matches([project.title, project.description, project.bestFor, ...project.tags])), [q]);
  const communities = useMemo(() => communityResources.filter((community) => matches([community.title, community.description, community.type, ...community.tags])), [q]);
  const courses = useMemo(() => featuredCourses.filter((course) => matches([course.title, course.provider, course.description])), [q]);
  const toggle = (id: string) => setFavorites((previous) => { const next = new Set(previous); next.has(id) ? next.delete(id) : next.add(id); return next; });

  return (
    <>
      <Header showSidebarTrigger />
      <main className="mx-auto w-full max-w-[1500px] px-4 py-6 md:px-8 md:py-8">
        <div className="space-y-7">
          <section className="relative min-h-[230px] overflow-hidden rounded-3xl border border-border/80 bg-card px-6 py-7 sm:min-h-[250px] sm:px-8 sm:py-8 lg:px-10">
            <img src={visualFor('Resource Hub', 'AI Learning', 77)} alt="" aria-hidden="true" className="absolute right-0 top-0 h-full w-[42%] object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
            <div className="relative max-w-3xl space-y-4">
              <div className="flex items-center gap-2 text-primary"><Sparkles className="h-4 w-4" /><span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Resource Hub</span></div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">Learn. Build. Connect.</h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">First-party learning platforms, high-value $0-start project stacks and communities worth joining — with only a few genuinely important flagship courses.</p>
              <div className="relative max-w-2xl"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search platforms, projects, communities..." className="h-11 rounded-xl border-border bg-background/90 pl-11" /></div>
            </div>
          </section>

          <div className="flex gap-2 overflow-x-auto pb-1">{filters.map(({ id, label, icon: Icon }) => <Button key={id} variant={section === id ? 'default' : 'outline'} className="shrink-0 rounded-full" onClick={() => setSection(id)}><Icon className="mr-2 h-4 w-4" />{label}</Button>)}</div>

          {section === 'projects' ? (
            <section className="space-y-4"><div><div className="flex items-center gap-2"><Rocket className="h-5 w-5 text-primary" /><h2 className="text-xl font-semibold">Free Project Stack</h2></div><p className="mt-1 text-sm text-muted-foreground">Practical platforms where you can start valuable student, portfolio and AI projects without paying to begin. Free tiers have limits; check the current plan before scaling.</p></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div></section>
          ) : section === 'community' ? (
            <section className="space-y-4"><div><div className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /><h2 className="text-xl font-semibold">Communities Worth Joining</h2></div><p className="mt-1 text-sm text-muted-foreground">A deliberately short list of active, high-signal communities for asking, building, sharing and finding collaborators.</p></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{communities.map((community, index) => <CommunityCard key={community.id} community={community} index={index} />)}</div></section>
          ) : section === 'courses' ? (
            <section className="space-y-4"><div><h2 className="text-xl font-semibold">Flagship courses only</h2><p className="text-sm text-muted-foreground">Kept separate so the platform directory stays clean.</p></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{courses.map((course, index) => <CourseCard key={course.id} course={course} index={index} />)}</div></section>
          ) : (
            <>
              {section === 'all' && <div className="grid gap-4 md:grid-cols-3"><button onClick={() => setSection('projects')} className="rounded-2xl border bg-card p-5 text-left transition hover:-translate-y-0.5 hover:border-primary/40"><Rocket className="h-5 w-5 text-primary" /><h2 className="mt-3 font-semibold">Free Project Stack</h2><p className="mt-1 text-sm text-muted-foreground">{freeProjects.length} high-value places to build at $0 to start.</p></button><button onClick={() => setSection('community')} className="rounded-2xl border bg-card p-5 text-left transition hover:-translate-y-0.5 hover:border-primary/40"><Users className="h-5 w-5 text-primary" /><h2 className="mt-3 font-semibold">Communities</h2><p className="mt-1 text-sm text-muted-foreground">{communityResources.length} high-signal communities worth joining.</p></button><button onClick={() => setSection('courses')} className="rounded-2xl border bg-card p-5 text-left transition hover:-translate-y-0.5 hover:border-primary/40"><BookOpen className="h-5 w-5 text-primary" /><h2 className="mt-3 font-semibold">Flagship Courses</h2><p className="mt-1 text-sm text-muted-foreground">Only the few courses important enough to stand alone.</p></button></div>}
              <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground"><span>{resources.length} curated platforms</span><div className="flex gap-1 rounded-lg border bg-card p-1"><Button size="sm" variant={view === 'grid' ? 'default' : 'ghost'} onClick={() => setView('grid')} aria-label="Grid view"><Grid2X2 className="h-4 w-4" /></Button><Button size="sm" variant={view === 'list' ? 'default' : 'ghost'} onClick={() => setView('list')} aria-label="List view"><List className="h-4 w-4" /></Button></div></div>
              <div className={view === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-3'}>{resources.map((resource, index) => <ResourceCard key={resource.id} resource={resource} index={index} list={view === 'list'} favorite={favorites.has(resource.id)} toggle={toggle} />)}</div>
              {!resources.length && <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">No platforms match that search.</div>}
            </>
          )}

          <div className="flex flex-wrap items-center gap-2 border-t pt-5"><span className="text-sm text-muted-foreground">Need the broader ecosystem?</span><Button asChild variant="outline" size="sm"><Link href="/ai-tools"><Sparkles className="mr-2 h-4 w-4" />AI Directory</Link></Button><Button asChild variant="outline" size="sm"><Link href="/news">AI News</Link></Button></div>
        </div>
      </main>
    </>
  );
}
