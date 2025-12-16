
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GoogleAiEcosystem } from "@/components/google-ai-ecosystem";
import { IllegalAiTools } from "@/components/illegal-ai-tools";
import { JobsAndCareers } from "@/components/jobs-and-careers";
import { FinanceAndMoney } from "@/components/finance-and-money";
import { ProductivityTools } from "@/components/productivity-tools";
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { earningOpportunities, type EarningCategory } from '@/lib/data';
import { AiToolsContent } from "@/components/ai-tools-content";

async function getCategoryData() {
  const categories: EarningCategory[] = earningOpportunities;
  return categories;
}

export default async function AiToolsPage() {
  const categories = await getCategoryData();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <AppSidebar categories={categories} />
        <AiToolsContent />
      </div>
    </SidebarProvider>
  );
}
