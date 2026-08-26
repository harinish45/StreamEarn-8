import { Header } from '@/components/header';
import { EnhancedAiToolsContent } from '@/components/enhanced-ai-tools-content';

export const metadata = { title: 'AI Tools Directory | StreamEarn', description: 'Current workflow-organised AI tools with visual category navigation.' };

export default function AiToolsPage() {
  return <div className="min-h-screen bg-background"><Header /><EnhancedAiToolsContent /></div>;
}
