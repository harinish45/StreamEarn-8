import Link from 'next/link';
import { ArrowRight, Bot, BookOpen, BriefcaseBusiness, Layers3, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const destinations = [
  { href: '/ai-tools', title: 'AI Tools', description: 'Current AI ecosystem across assistants, agents, coding, browser automation, research, creative, security and infrastructure.', icon: Sparkles },
  { href: '/hub', title: 'Resource Hub', description: 'Integrated learning, cybersecurity, careers, platforms, freelancing and business resources from the second project.', icon: Layers3 },
  { href: '/earnings', title: 'Earning Opportunities', description: 'Explore online earning and digital-work opportunities in one workspace.', icon: BriefcaseBusiness },
  { href: '/courses', title: 'Courses', description: 'Browse the existing learning library for AI and online work.', icon: BookOpen },
  { href: '/directory', title: 'Directory', description: 'Browse the business and opportunity directory with searchable listings.', icon: Search },
  { href: '/leads', title: 'Leads', description: 'Manage leads and explore lead-automation resources.', icon: Bot },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="font-bold tracking-tight">StreamEarn</Link>
          <nav className="hidden items-center gap-5 text-sm md:flex">
            <Link href="/ai-tools" className="text-muted-foreground hover:text-foreground">AI Tools</Link>
            <Link href="/hub" className="text-muted-foreground hover:text-foreground">Resource Hub</Link>
            <Link href="/earnings" className="text-muted-foreground hover:text-foreground">Earnings</Link>
            <Link href="/courses" className="text-muted-foreground hover:text-foreground">Courses</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <section className="max-w-4xl space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4" /> One unified workspace</div>
          <h1 className="text-5xl font-serif tracking-tight md:text-7xl">Your AI, learning & earning command center.</h1>
          <p className="max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">Both supplied project surfaces are now combined into StreamEarn: the AI discovery platform plus the original learning, cybersecurity, career, platform and business resource hub.</p>
          <div className="flex flex-wrap gap-3"><Button asChild size="lg"><Link href="/ai-tools">Explore AI Tools <ArrowRight className="ml-2 h-4 w-4" /></Link></Button><Button asChild size="lg" variant="outline"><Link href="/hub">Open Resource Hub</Link></Button></div>
        </section>

        <section className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map(({ href, title, description, icon: Icon }) => <Link key={href} href={href} className="group"><Card className="h-full transition group-hover:-translate-y-1 group-hover:border-primary/50"><CardHeader><Icon className="mb-2 h-6 w-6 text-accent" /><CardTitle>{title}</CardTitle></CardHeader><CardContent className="text-sm leading-6 text-muted-foreground">{description}</CardContent></Card></Link>)}
        </section>
      </main>
    </div>
  );
}
