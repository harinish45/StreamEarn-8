
import { Header } from '@/components/header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { earningOpportunities, type EarningCategory } from '@/lib/data';
import { AiToolsContent } from "@/components/ai-tools-content";
import { productivityTools, type ProductivityTool } from '@/lib/productivity-tools-data';
import { jobsAndCareersTools, type JobsAndCareersTool } from '@/lib/jobs-and-careers-data';
import { financeAndMoneyTools, type FinanceAndMoneyTool } from '@/lib/finance-and-money-data';
import { illegalAiTools, type AiToolCategory } from '@/lib/illegal-ai-tools-data';
import { googleAiTools, type GoogleAiTool } from '@/lib/google-ai-ecosystem-data';
import { aiToolsPyramid } from '@/lib/ai-tools-data';

async function getPageData() {
  const categories: EarningCategory[] = earningOpportunities;
  const pTools: ProductivityTool[] = productivityTools;
  const jcTools: JobsAndCareersTool[] = jobsAndCareersTools;
  const fmTools: FinanceAndMoneyTool[] = financeAndMoneyTools;
  const illegal: AiToolCategory[] = illegalAiTools;
  const pyramid: AiToolCategory[] = aiToolsPyramid;
  const googleTools: GoogleAiTool[] = googleAiTools;
  
  return {
    categories,
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
