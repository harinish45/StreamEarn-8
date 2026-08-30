import { Header } from '@/components/header';
import { ReliableAiTools } from '@/components/reliable-ai-tools';

export const metadata = { title: 'AI Tools Directory | StreamEarn', description: 'Current workflow-organised AI tools with reliable local visuals and working official links.' };

export default function AiToolsPage() {
  return <><Header showSidebarTrigger /><ReliableAiTools /></>;
}
