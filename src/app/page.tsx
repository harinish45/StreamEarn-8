import Link from 'next/link';
import { ArrowRight, Bot, BookOpen, BriefcaseBusiness, Layers3, Search, ShieldCheck, Sparkles, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { UnifiedSidebar } from '@/components/unified-sidebar';
import { NewsSection } from '@/components/news-section';

const imageFor = (id: string) => `https://picsum.photos/seed/streamearn-home-${encodeURIComponent(id)}/1000/600`;
const destinations = [
  { href: '/ai-tools', title: 'AI Tools', description: 'Current AI ecosystem across assistants, agents, coding, research, creative, security and infrastructure.', icon: Sparkles },
  { href: '/hub', title: 'Resource Hub', description: 'Integrated learning, cybersecurity, careers, platforms, freelancing and business resources.', icon: Layers3 },
  { href: '/earnings', title: 'Earning Opportunities', description: 'Explore online earning and digital-work opportunities in one workspace.', icon: BriefcaseBusiness },
  { href: '/courses', title: 'Courses', description: 'Browse the learning library for AI, technology and online work.', icon: BookOpen },
  { href: '/directory', title: 'Directory', description: 'Browse business, platform and opportunity listings with search.', icon: Search },
  { href: '/leads', title: 'Leads', description: 'Manage leads and explore practical lead-generation resources.', icon: Bot },
];
const heroImage=imageFor('hero-command-center');

export default function Home(){
 return <SidebarProvider><UnifiedSidebar /><SidebarInset><main className="min-h-screen bg-background"><div className="mx-auto max-w-[1500px] px-4 py-7 md:px-8 md:py-10">
  <section className="relative overflow-hidden rounded-3xl border bg-card shadow-sm"><img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" /><div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30" /><div className="relative max-w-4xl space-y-6 p-7 md:p-12"><div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-4 py-2 text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary" /> One unified platform</div><h1 className="text-5xl font-semibold tracking-tight md:text-7xl">Your AI, learning & earning command center.</h1><p className="max-w-3xl text-lg leading-8 text-muted-foreground">AI discovery, learning, cybersecurity, careers, earning opportunities, business resources and current AI technology news — organised behind one sidebar.</p><div className="flex flex-wrap gap-3"><Button asChild size="lg"><Link href="/ai-tools">Explore AI Tools <ArrowRight className="ml-2 h-4 w-4" /></Link></Button><Button asChild size="lg" variant="outline"><Link href="/news"><Newspaper className="mr-2 h-4 w-4" />Latest AI News</Link></Button><Button asChild size="lg" variant="outline"><Link href="/hub">Open Resource Hub</Link></Button></div></div></section>
  <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{destinations.map(({href,title,description,icon:Icon})=><Link key={href} href={href} className="group"><Card className="h-full overflow-hidden transition group-hover:-translate-y-1 group-hover:border-primary/50 group-hover:shadow-lg"><div className="relative aspect-[16/8] overflow-hidden"><img src={imageFor(title)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" /></div><CardHeader><Icon className="mb-2 h-6 w-6 text-primary" /><CardTitle>{title}</CardTitle></CardHeader><CardContent className="text-sm leading-6 text-muted-foreground">{description}</CardContent></Card></Link>)}</section>
  <section className="mt-14"><NewsSection compact /></section>
 </div></main></SidebarInset></SidebarProvider>;
}
