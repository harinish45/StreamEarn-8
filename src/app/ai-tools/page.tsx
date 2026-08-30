import { Header } from '@/components/header';
import { EnhancedAiToolsContent } from '@/components/enhanced-ai-tools-content';

export const metadata = { title: 'AI Tools Directory | StreamEarn', description: 'Current workflow-organised AI tools with visual navigation and working external links.' };

export default function AiToolsPage() {
  return <><Header showSidebarTrigger /><EnhancedAiToolsContent /></>;
}
