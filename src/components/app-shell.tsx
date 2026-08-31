'use client';

import { usePathname } from 'next/navigation';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { UnifiedSidebar } from '@/components/unified-sidebar';

// Login, and the canonical Planner route (whose implementation owns its
// own sidebar shell), are rendered without a second outer shell.
const PUBLIC = ['/login'];
const SELF_SHELL_ROUTES = ['/planner', '/planner-v4'];

function matches(pathname: string, route: string) {
  return pathname === route || (route !== '/' && pathname.startsWith(`${route}/`));
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const publicRoute = PUBLIC.some((route) => matches(pathname, route));
  const selfShellRoute = SELF_SHELL_ROUTES.includes(pathname);

  if (publicRoute || selfShellRoute) return <>{children}</>;

  return (
    <SidebarProvider>
      <UnifiedSidebar />
      <SidebarInset className="min-w-0">{children}</SidebarInset>
    </SidebarProvider>
  );
}
