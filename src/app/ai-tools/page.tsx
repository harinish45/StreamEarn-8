import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { UnifiedSidebar } from '@/components/unified-sidebar';
import { Header } from '@/components/header';
import { EnhancedAiToolsContent } from '@/components/enhanced-ai-tools-content';

export const metadata = { title: 'AI Tools Directory | StreamEarn', description: 'Current workflow-organised AI tools with visual navigation and working external links.' };

export default function AiToolsPage() {
  return <SidebarProvider><UnifiedSidebar /><SidebarInset><Header showSidebarTrigger /><EnhancedAiToolsContent /></SidebarInset></SidebarProvider>;
}
