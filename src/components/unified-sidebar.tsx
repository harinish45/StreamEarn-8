'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, Compass, GraduationCap, LayoutDashboard, Library, Newspaper, Search, ShieldCheck, Sparkles, WalletCards, BriefcaseBusiness, ClipboardList } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from '@/components/ui/sidebar';

const groups = [
  { label: 'Overview', items: [
    { href: '/', label: 'Command Center', icon: LayoutDashboard },
    { href: '/news', label: 'AI Tech News', icon: Newspaper },
  ]},
  { label: 'AI Intelligence', items: [
    { href: '/ai-tools', label: 'AI Tools', icon: Sparkles },
    { href: '/hub', label: 'Resource Hub', icon: Library },
    { href: '/courses', label: 'Learning & Courses', icon: GraduationCap },
  ]},
  { label: 'Build & Earn', items: [
    { href: '/ai-work', label: 'AI Work', icon: Bot },
    { href: '/earnings', label: 'Earning Opportunities', icon: WalletCards },
    { href: '/directory', label: 'Directory', icon: Compass },
  ]},
  { label: 'Opportunities', items: [
    { href: '/internships', label: 'Internships', icon: BriefcaseBusiness },
    { href: '/scholarships', label: 'Scholarships', icon: GraduationCap },
  ]},
  { label: 'Personal', items: [
    { href: '/planner-v4', label: 'Planner', icon: ClipboardList },
  ]},
  { label: 'Security', items: [
    { href: '/cybersecurity', label: 'Cybersecurity', icon: ShieldCheck },
  ]},
];

export function UnifiedSidebar() {
  const pathname = usePathname();
  return <Sidebar variant="inset" collapsible="icon">
    <SidebarHeader className="p-2"><Link href="/" className="flex items-center gap-2 rounded-lg px-2 py-1.5 font-bold"><div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="h-3.5 w-3.5" /></div><span className="group-data-[collapsible=icon]:hidden">StreamEarn</span></Link></SidebarHeader>
    <SidebarContent className="px-1.5">
      <div className="mb-2 flex items-center gap-2 rounded-lg border bg-card px-2.5 py-1.5 text-[11px] text-muted-foreground"><Search className="h-3 w-3" /><span className="group-data-[collapsible=icon]:hidden">Search StreamEarn</span></div>
      {groups.map(group => <div key={group.label} className="mb-2"><p className="mb-0.5 px-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground group-data-[collapsible=icon]:hidden">{group.label}</p><SidebarMenu>{group.items.map(item => { const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href.split('?')[0])); return <SidebarMenuItem key={item.href}><SidebarMenuButton asChild isActive={active} tooltip={item.label} className="h-8"><Link href={item.href}><item.icon className="h-3.5 w-3.5" /><span>{item.label}</span></Link></SidebarMenuButton></SidebarMenuItem>; })}</SidebarMenu></div>)}
    </SidebarContent>
    <SidebarSeparator />
    <SidebarFooter className="p-1.5"><div className="px-2 py-1 text-[9px] text-muted-foreground group-data-[collapsible=icon]:hidden">AI ecosystem • 2026</div></SidebarFooter>
  </Sidebar>;
}
