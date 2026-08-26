'use client';
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Bot, BookOpen, BriefcaseBusiness, Layers3, Sparkles, WalletCards } from 'lucide-react';

const menuItems = [
  { href: '/ai-tools', label: 'AI Tools', icon: Sparkles },
  { href: '/hub', label: 'Resource Hub', icon: Layers3 },
  { href: '/leads', label: 'Leads', icon: Bot },
  { href: '/directory', label: 'Directory', icon: BookOpen },
  { href: '/earnings', label: 'Earnings', icon: WalletCards },
  { href: '/courses', label: 'Courses', icon: BriefcaseBusiness },
];

export function CoursesSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));
            return <SidebarMenuItem key={href}><SidebarMenuButton asChild tooltip={label} isActive={active}><Link href={href}><Icon /><span>{label}</span></Link></SidebarMenuButton></SidebarMenuItem>;
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
