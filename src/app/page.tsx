import Link from 'next/link';
import { ArrowRight, Bot, BookOpen, BriefcaseBusiness, Layers3, Search, ShieldCheck, Sparkles, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { UnifiedSidebar } from '@/components/unified-sidebar';
import { NewsSection } from '@/components/news-section';

const imageFor = (id: string) => `https://picsum.photos/seed/streamearn-home-${encodeURIComponent(id)}/1000/600`;
const destinations = [
  { href: '/ai-tools', title: 'AI Tools', description: 'Current AI ecosystem across assistants, agents, coding, research, automation, creative, security and infrastructure.', icon: Sparkles },
  { href: '/hub', title: 'Resource Hub', description: 'Integrated learning, cybersecurity, careers, platforms, freelancing and business resources.', icon: Layers3 },
  { href: '/earnings', title: 'Earning Opportunities', description: 'Explore online earning and digital-work opportunities in one place.', icon: BriefcaseBusiness },
  { href: '/courses', title: 'Courses', description: 'Browse current learning paths for AI, technology and online work.', icon: BookOpen },
  { href: '/directory', title: 'Directory', description: 'Browse business, platform and opportunity listings with search.', icon: Search },
  { href: '/leads', title: 'Leads', description: 'Manage leads and explore practical lead-generation resources.', icon: Bot },
];

export default function Home(){
 return <SidebarProvider><UnifiedSidebar /><SidebarInset><main className="min-h-screen overflow-x-hidden bg-background"><div className="mx-auto max-w-[1500px] px-3 py-5 md:px-6 md:py-7">
  <section className="relative overflow-hidden rounded-2xl border bg-card shadow-sm"><img src={imageFor('hero-command-center')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-15" /><div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/35" /><div className="relative max-w-4xl space-y-4 p-6 md:p-8"><div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1.5 text-xs text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Unified command center</div><h1 className="text-4xl font-semibold tracking-tight md:text-6xl">AI, learning & earning — organised.</h1><p className="max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">Current AI discovery, advanced learning, cybersecurity practice, careers, earning opportunities, business resources and AI technology news behind one sidebar.</p><div className="flex flex-wrap gap-2"><Button asChild size="sm"><Link href="/ai-tools">Explore AI Tools <ArrowRight className="ml-2 h-3.5 w-3.5" /></Link></Button><Button asChild size="sm" variant="outline"><Link href="/news"><Newspaper className="mr-2 h-3.5 w-3.5" />Latest AI News</Link></Button><Button asChild size="sm" variant="outline"><Link href="/cybersecurity">Practice Security</Link></Button></div></div></section>
  <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{destinations.map(({href,title,description,icon:Icon})=><Link key={href} href={href} className="group"><Card className="h-full overflow-hidden rounded-xl transition group-hover:-translate-y-0.5 group-hover:border-primary/50 group-hover:shadow-md"><div className="relative aspect-[16/6] overflow-hidden"><img src={imageFor(title)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /></div><CardHeader className="p-4"><Icon className="mb-1 h-5 w-5 text-primary" /><CardTitle className="text-base">{title}</CardTitle></CardHeader><CardContent className="px-4 pb-4 pt-0 text-xs leading-5 text-muted-foreground">{description}</CardContent></Card></Link>)}</section>
  <section className="mt-8"><NewsSection compact /></section>
 </div></main></SidebarInset></SidebarProvider>;
}
