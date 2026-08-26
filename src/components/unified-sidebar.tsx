'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, BriefcaseBusiness, Compass, GraduationCap, LayoutDashboard, Library, Newspaper, Search, Settings2, ShieldCheck, Sparkles, WalletCards, Globe2 } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from '@/components/ui/sidebar';

const groups = [
  { label: 'Overview', items: [
    { href: '/', label: 'Command Center', icon: LayoutDashboard },
    { href: '/news', label: 'AI Tech News', icon: Newspaper },
  ]},
  { label: 'AI Intelligence', items: [
    { href: '/ai-tools', label: 'AI Tools', icon: Sparkles },
    { href: '/browser', label: 'AI Browser', icon: Globe2 },
    { href: '/hub', label: 'Resource Hub', icon: Library },
    { href: '/courses', label: 'Learning & Courses', icon: GraduationCap },
  ]},
  { label: 'Build & Earn', items: [
    { href: '/ai-work', label: 'AI Work', icon: Bot },
    { href: '/earnings', label: 'Earning Opportunities', icon: WalletCards },
    { href: '/leads', label: 'Leads & GTM', icon: BriefcaseBusiness },
    { href: '/directory', label: 'Directory', icon: Compass },
  ]},
  { label: 'Security & Operations', items: [
    { href: '/cybersecurity', label: 'Cybersecurity', icon: ShieldCheck },
    { href: '/workspace', label: 'Workspace', icon: Settings2 },
  ]},
];

export function UnifiedSidebar() {
  const pathname = usePathname();
  return <Sidebar variant="inset" collapsible="icon">
    <SidebarHeader className="p-3"><Link href="/" className="flex items-center gap-2 rounded-lg px-2 py-2 font-bold"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="h-4 w-4" /></div><span className="group-data-[collapsible=icon]:hidden">StreamEarn</span></Link></SidebarHeader>
    <SidebarContent className="px-2">
      <div className="mb-3 flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-xs text-muted-foreground"><Search className="h-3.5 w-3.5" /><span className="group-data-[collapsible=icon]:hidden">Search workspace</span></div>
      {groups.map(group => <div key={group.label} className="mb-4"><p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground group-data-[collapsible=icon]:hidden">{group.label}</p><SidebarMenu>{group.items.map(item => { const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)); return <SidebarMenuItem key={item.href}><SidebarMenuButton asChild isActive={active} tooltip={item.label}><Link href={item.href}><item.icon className="h-4 w-4" /><span>{item.label}</span></Link></SidebarMenuButton></SidebarMenuItem>; })}</SidebarMenu></div>)}
    </SidebarContent>
    <SidebarSeparator />
    <SidebarFooter><div className="px-2 py-2 text-[10px] text-muted-foreground group-data-[collapsible=icon]:hidden">AI ecosystem • 2026</div></SidebarFooter>
  </Sidebar>;
}
