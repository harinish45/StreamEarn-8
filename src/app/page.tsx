import Link from 'next/link';
import { ArrowRight, Bot, BookOpen, BriefcaseBusiness, Layers3, Search, ShieldCheck, Sparkles, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { UnifiedSidebar } from '@/components/unified-sidebar';
import { NewsSection } from '@/components/news-section';

const destinations = [
  { href: '/ai-tools', title: 'AI Tools', description: 'Current AI ecosystem across assistants, agents, coding, browser automation, research, creative, security and infrastructure.', icon: Sparkles },
  { href: '/hub', title: 'Resource Hub', description: 'Integrated learning, cybersecurity, careers, platforms, freelancing and business resources from the second project.', icon: Layers3 },
  { href: '/earnings', title: 'Earning Opportunities', description: 'Explore online earning and digital-work opportunities in one workspace.', icon: BriefcaseBusiness },
  { href: '/courses', title: 'Courses', description: 'Browse the learning library for AI and online work.', icon: BookOpen },
  { href: '/directory', title: 'Directory', description: 'Browse business and opportunity listings with search.', icon: Search },
  { href: '/leads', title: 'Leads', description: 'Manage leads and explore lead-automation resources.', icon: Bot },
];
const heroImage='https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1600&q=85';

export default function Home(){
 return <SidebarProvider><UnifiedSidebar /><SidebarInset><main className="min-h-screen bg-background"><div className="mx-auto max-w-[1500px] px-4 py-7 md:px-8 md:py-10">
  <section className="relative overflow-hidden rounded-3xl border bg-card shadow-sm"><img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" /><div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30" /><div className="relative max-w-4xl space-y-6 p-7 md:p-12"><div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-4 py-2 text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary" /> One unified workspace</div><h1 className="text-5xl font-semibold tracking-tight md:text-7xl">Your AI, learning & earning command center.</h1><p className="max-w-3xl text-lg leading-8 text-muted-foreground">AI discovery, learning, cybersecurity, careers, earning opportunities, business resources and current AI technology news — organised behind one sidebar.</p><div className="flex flex-wrap gap-3"><Button asChild size="lg"><Link href="/ai-tools">Explore AI Tools <ArrowRight className="ml-2 h-4 w-4" /></Link></Button><Button asChild size="lg" variant="outline"><Link href="/news"><Newspaper className="mr-2 h-4 w-4" />Latest AI News</Link></Button><Button asChild size="lg" variant="outline"><Link href="/hub">Open Resource Hub</Link></Button></div></div></section>
  <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{destinations.map(({href,title,description,icon:Icon})=><Link key={href} href={href} className="group"><Card className="h-full transition group-hover:-translate-y-1 group-hover:border-primary/50 group-hover:shadow-lg"><CardHeader><Icon className="mb-2 h-6 w-6 text-primary" /><CardTitle>{title}</CardTitle></CardHeader><CardContent className="text-sm leading-6 text-muted-foreground">{description}</CardContent></Card></Link>)}</section>
  <section className="mt-14"><NewsSection compact /></section>
 </div></main></SidebarInset></SidebarProvider>;
}
