import Link from 'next/link';
import { ArrowRight, Layers3, Search, ShieldCheck, Sparkles, Newspaper, WalletCards, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NewsSection } from '@/components/news-section';

const destinations = [
  { href: '/ai-tools', title: 'AI Tools', description: 'Current frontier models, agents, coding systems, research and creative AI.', icon: Sparkles, image: '/visuals/ai-intelligence.svg' },
  { href: '/hub', title: 'Resource Hub', description: 'Curated learning, cybersecurity, career and technology resources.', icon: Layers3, image: '/visuals/resource-hub.svg' },
  { href: '/earnings', title: 'Earning Opportunities', description: 'Current online earning, freelance and digital-work opportunities.', icon: WalletCards, image: '/visuals/earnings.svg' },
  { href: '/projects', title: 'Projects', description: 'Track projects, contributors, progress, priorities and next actions.', icon: FolderKanban, image: '/visuals/projects.svg' },
  { href: '/directory', title: 'Directory', description: 'Browse curated platforms, businesses and opportunity resources.', icon: Search, image: '/visuals/directory.svg' },
];

export default function Home() {
  return <main className="min-h-screen overflow-x-hidden bg-[#08090b] text-white"><div className="mx-auto w-full max-w-[1580px] px-4 py-5 md:px-7 md:py-7">
    <section className="relative isolate overflow-hidden rounded-[28px] border border-white/10 bg-[#101216] shadow-[0_24px_80px_rgba(0,0,0,.35)]">
      <img src="/visuals/ai-intelligence.svg" alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_20%,rgba(255,210,55,.16),transparent_28%),linear-gradient(90deg,#101216_5%,rgba(16,18,22,.94)_48%,rgba(16,18,22,.62))]" />
      <div className="relative max-w-4xl space-y-5 p-6 md:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[10px] font-medium text-white/70 backdrop-blur"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> StreamEarn Command Center</div>
        <div><h1 className="text-4xl font-semibold tracking-[-.04em] md:text-6xl">AI, learning &amp; earning — organised.</h1><p className="mt-3 max-w-3xl text-sm leading-7 text-white/55 md:text-base">One focused workspace for current AI discovery, cybersecurity, careers, earning opportunities, projects and technology intelligence.</p></div>
        <div className="flex flex-wrap gap-2"><Button asChild size="sm" className="h-9"><Link href="/ai-tools">Explore AI Tools <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link></Button><Button asChild size="sm" variant="outline" className="h-9 border-white/15 bg-black/20 text-white hover:bg-white/10"><Link href="/news"><Newspaper className="mr-1.5 h-3.5 w-3.5" />Latest AI News</Link></Button><Button asChild size="sm" variant="outline" className="h-9 border-white/15 bg-black/20 text-white hover:bg-white/10"><Link href="/cybersecurity">Practice Security</Link></Button></div>
      </div>
    </section>
    <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {destinations.map(({ href, title, description, icon: Icon, image }) => <Link key={href} href={href} className="group block">
        <Card className="h-full overflow-hidden rounded-2xl border-white/10 bg-[#0f1114] shadow-[0_12px_35px_rgba(0,0,0,.2)] transition duration-200 group-hover:-translate-y-0.5 group-hover:border-white/20 group-hover:bg-[#12151a]">
          <div className="relative h-36 overflow-hidden"><img src={image} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100" /><div className="absolute inset-0 bg-gradient-to-t from-[#0f1114] via-transparent to-transparent" /><div className="absolute bottom-3 left-3 rounded-xl border border-white/10 bg-black/40 p-2 backdrop-blur"><Icon className="h-4 w-4 text-primary" /></div></div>
          <CardHeader className="p-4 pb-1"><CardTitle className="text-[15px] tracking-tight text-white">{title}</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4 pt-0 text-[11px] leading-5 text-white/50">{description}</CardContent>
        </Card>
      </Link>)}
    </section>
    <section className="mt-7"><NewsSection compact /></section>
  </div></main>;
}
