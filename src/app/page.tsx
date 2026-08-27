import Link from 'next/link';
import { ArrowRight, BookOpen, Layers3, Search, ShieldCheck, Sparkles, Newspaper, WalletCards, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { UnifiedSidebar } from '@/components/unified-sidebar';
import { NewsSection } from '@/components/news-section';

const imageFor = (id: string) => `https://picsum.photos/seed/streamearn-home-${encodeURIComponent(id)}/1000/600`;
const destinations = [
  { href: '/ai-tools', title: 'AI Tools', description: 'Current AI ecosystem across assistants, agents, coding, research, automation and creative production.', icon: Sparkles },
  { href: '/hub', title: 'Resource Hub', description: 'Integrated learning, cybersecurity, careers and platform resources.', icon: Layers3 },
  { href: '/earnings', title: 'Earning Opportunities', description: 'Explore current online earning and digital-work opportunities.', icon: WalletCards },
  { href: '/courses', title: 'Learning & Courses', description: 'Advanced current learning paths for AI and technology.', icon: BookOpen },
  { href: '/projects', title: 'Projects', description: 'Track what you are building, who you are working with, priorities, progress and next actions.', icon: FolderKanban },
  { href: '/directory', title: 'Directory', description: 'Browse useful businesses, platforms and opportunity listings.', icon: Search },
];

export default function Home(){
 return <SidebarProvider><UnifiedSidebar /><SidebarInset><main className="min-h-screen overflow-x-hidden bg-background"><div className="mx-auto max-w-[1500px] px-3 py-4 md:px-5 md:py-5">
  <section className="relative overflow-hidden rounded-2xl border bg-card shadow-sm"><img src={imageFor('hero-command-center')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-10" /><div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/40" /><div className="relative max-w-4xl space-y-2.5 p-4 md:p-6"><div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-2.5 py-1 text-[10px] text-muted-foreground"><ShieldCheck className="h-3 w-3 text-primary" /> Unified command center</div><h1 className="text-3xl font-semibold tracking-tight md:text-5xl">AI, learning & earning — organised.</h1><p className="max-w-3xl text-xs leading-5 text-muted-foreground md:text-sm">Current AI discovery, advanced learning, cybersecurity practice, careers, earning opportunities and AI technology news behind one compact sidebar.</p><div className="flex flex-wrap gap-1.5"><Button asChild size="sm" className="h-8 text-xs"><Link href="/ai-tools">Explore AI Tools <ArrowRight className="ml-1.5 h-3 w-3" /></Link></Button><Button asChild size="sm" variant="outline" className="h-8 text-xs"><Link href="/news"><Newspaper className="mr-1.5 h-3 w-3" />Latest AI News</Link></Button><Button asChild size="sm" variant="outline" className="h-8 text-xs"><Link href="/cybersecurity">Practice Security</Link></Button></div></div></section>
  <section className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">{destinations.map(({href,title,description,icon:Icon})=><Link key={href} href={href} className="group"><Card className="h-full overflow-hidden rounded-xl transition group-hover:-translate-y-0.5 group-hover:border-primary/50 group-hover:shadow-md"><div className="relative aspect-[16/4] overflow-hidden"><img src={imageFor(title)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" /></div><CardHeader className="p-3 pb-1"><div className="flex items-center gap-2"><Icon className="h-4 w-4 text-primary" /><CardTitle className="text-sm">{title}</CardTitle></div></CardHeader><CardContent className="px-3 pb-3 pt-0 text-[11px] leading-4 text-muted-foreground">{description}</CardContent></Card></Link>)}</section>
  <section className="mt-5"><NewsSection compact /></section>
 </div></main></SidebarInset></SidebarProvider>;
}
