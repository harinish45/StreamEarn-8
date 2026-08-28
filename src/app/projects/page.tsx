import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { UnifiedSidebar } from '@/components/unified-sidebar';
import CommandCenter from '@/components/projects/CommandCenter';

export default function ProjectsPage() {
  return (
    <SidebarProvider>
      <UnifiedSidebar />
      <SidebarInset className="min-w-0 bg-[#0d0c0a]">
        <CommandCenter />
      </SidebarInset>
    </SidebarProvider>
  );
}
