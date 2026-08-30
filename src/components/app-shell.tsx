'use client';

import { usePathname } from 'next/navigation';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { UnifiedSidebar } from '@/components/unified-sidebar';

// Only the login page lives outside the persistent StreamEarn shell.
// Every other route gets the same SidebarProvider context, the same
// UnifiedSidebar and the same SidebarInset. This eliminates sidebar
// remounts, state resets on navigation and visual alignment mismatches.
const PUBLIC = ['/login'];

function matches(pathname: string, route: string) {
  return pathname === route || (route !== '/' && pathname.startsWith(`${route}/`));
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const publicRoute = PUBLIC.some((route) => matches(pathname, route));

  if (publicRoute) return <>{children}</>;

  return (
    <SidebarProvider>
      <UnifiedSidebar />
      <SidebarInset className="min-w-0">{children}</SidebarInset>
    </SidebarProvider>
  );
}
