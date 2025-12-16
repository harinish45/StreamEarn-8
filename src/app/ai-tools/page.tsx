
import { Header } from '@/components/header';
import { type EarningCategory } from '@/lib/data';
import { AiToolsContent } from "@/components/ai-tools-content";
import { productivityTools, type ProductivityTool } from '@/lib/productivity-tools-data';
import { jobsAndCareersTools, type JobsAndCareersTool } from '@/lib/jobs-and-careers-data';
import { financeAndMoneyTools, type FinanceAndMoneyTool } from '@/lib/finance-and-money-data';
import { illegalAiTools, type AiToolCategory as IllegalAiToolCategory } from '@/lib/illegal-ai-tools-data';
import { aiToolsPyramid, type AiToolCategory as AiToolsPyramidCategory } from '@/lib/ai-tools-data';
import { googleAiTools, type GoogleAiTool } from '@/lib/google-ai-ecosystem-data';
import { ScrollArea } from '@/components/ui/scroll-area';

async function getPageData() {
  const pTools: ProductivityTool[] = productivityTools;
  const jcTools: JobsAndCareersTool[] = jobsAndCareersTools;
  const fmTools: FinanceAndMoneyTool[] = financeAndMoneyTools;
  const illegal: IllegalAiToolCategory[] = illegalAiTools;
  const pyramid: AiToolsPyramidCategory[] = aiToolsPyramid;
  const googleTools: GoogleAiTool[] = googleAiTools;
  
  return {
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
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <AiToolsContent 
          productivityTools={data.pTools}
          jobsAndCareersTools={data.jcTools}
          financeAndMoneyTools={data.fmTools}
          illegalAiTools={data.illegal}
          aiToolsPyramid={data.pyramid}
          googleAiTools={data.googleTools}
        />
      </div>
  );
}
