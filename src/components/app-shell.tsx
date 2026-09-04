'use client';

import { usePathname } from 'next/navigation';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { UnifiedSidebar } from '@/components/unified-sidebar';

// Login, the two-factor step-up page, and the canonical Planner route. Planner owns its own shell.
const PUBLIC = ['/login', '/mfa'];
const SELF_SHELL_ROUTES = ['/planner'];

function matches(pathname: string, route: string) {
  return pathname === route || (route !== '/' && pathname.startsWith(`${route}/`));
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const publicRoute = PUBLIC.some((route) => matches(pathname, route));
  const selfShellRoute = SELF_SHELL_ROUTES.some((route) => matches(pathname, route));

  if (publicRoute || selfShellRoute) return <>{children}</>;

  return (
    <SidebarProvider>
      <UnifiedSidebar />
      <SidebarInset className="min-w-0">{children}</SidebarInset>
    </SidebarProvider>
  );
}
