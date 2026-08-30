'use client';

import { usePathname } from 'next/navigation';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { UnifiedSidebar } from '@/components/unified-sidebar';

// These routes already provide their own shell to avoid nested sidebars.
const SELF_SHELLED = ['/', '/directory', '/earnings', '/projects', '/category', '/opportunities', '/planner', '/planner-v4'];
const PUBLIC = ['/login'];

function matches(pathname: string, route: string) {
  return pathname === route || (route !== '/' && pathname.startsWith(`${route}/`));
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const publicRoute = PUBLIC.some((route) => matches(pathname, route));
  const selfShelled = SELF_SHELLED.some((route) => matches(pathname, route));

  if (publicRoute || selfShelled) return <>{children}</>;

  return (
    <SidebarProvider>
      <UnifiedSidebar />
      <SidebarInset className="min-w-0">{children}</SidebarInset>
    </SidebarProvider>
  );
}
