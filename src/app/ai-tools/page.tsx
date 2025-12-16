
import { Header } from '@/components/header';
import { AppSidebar } from '@/components/app-sidebar';
import { type EarningCategory } from '@/lib/data';
import { AiToolsContent } from "@/components/ai-tools-content";
import { productivityTools, type ProductivityTool } from '@/lib/productivity-tools-data';
import { jobsAndCareersTools, type JobsAndCareersTool } from '@/lib/jobs-and-careers-data';
import { financeAndMoneyTools, type FinanceAndMoneyTool } from '@/lib/finance-and-money-data';
import { illegalAiTools, type AiToolCategory as IllegalAiToolCategory } from '@/lib/illegal-ai-tools-data';
import { aiToolsPyramid, type AiToolCategory as AiToolsPyramidCategory } from '@/lib/ai-tools-data';
import { googleAiTools, type GoogleAiTool } from '@/lib/google-ai-ecosystem-data';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

async function getPageData() {
  const pTools: ProductivityTool[] = productivityTools;
  const jcTools: JobsAndCareersTool[] = jobsAndCareersTools;
  const fmTools: FinanceAndMoneyTool[] = financeAndMoneyTools;
  const illegal: IllegalAiToolCategory[] = illegalAiTools;
  const pyramid: AiToolsPyramidCategory[] = aiToolsPyramid;
  const googleTools: GoogleAiTool[] = googleAiTools;
  
  const aiToolCategories: EarningCategory[] = [
    ...pyramid.map(category => ({
      id: category.name.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-'),
      name: category.name,
      icon: 'Bot', // A generic icon for AI categories
      description: `AI tools for ${category.name}`,
      opportunities: category.tools.map(tool => ({
        id: tool.name.toLowerCase().replace(/\s+/g, '-'),
        title: tool.name,
        description: `Link to ${tool.name}`,
        link: tool.link,
        logo: tool.logo,
        image: '', // No main image for these
        aiHint: 'logo',
      })),
    })),
    ...illegal.map(category => ({
        id: category.name.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-'),
        name: category.name,
        icon: 'Bot', // A generic icon for AI categories
        description: `AI tools for ${category.name}`,
        opportunities: category.tools.map(tool => ({
          id: tool.name.toLowerCase().replace(/\s+/g, '-'),
          title: tool.name,
          description: `Link to ${tool.name}`,
          link: tool.link,
          logo: tool.logo,
          image: '', // No main image for these
          aiHint: 'logo',
        })),
      })),
  ];

  return {
    categories: aiToolCategories,
    pTools,
    jcTools,
    fmTools,
    illegal,
    pyramid,
    googleTools,
  };
}

export default async function AiToolsPage() {
  const data = await getPageData();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <AppSidebar categories={data.categories} />
        <AiToolsContent 
          productivityTools={data.pTools}
          jobsAndCareersTools={data.jcTools}
          financeAndMoneyTools={data.fmTools}
          illegalAiTools={data.illegal}
          aiToolsPyramid={data.pyramid}
          googleAiTools={data.googleTools}
        />
      </div>
    </SidebarProvider>
  );
}
