import EnhancedResourceHub from '@/components/enhanced-resource-hub';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { UnifiedSidebar } from '@/components/unified-sidebar';

export const metadata = { title: 'Resource Hub | StreamEarn', description: 'Integrated AI, learning, cybersecurity, career and business resource library.' };

export default function HubPage() {
  return <SidebarProvider><UnifiedSidebar /><SidebarInset><EnhancedResourceHub /></SidebarInset></SidebarProvider>;
}
