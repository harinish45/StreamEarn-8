
'use client';

import { Breadcrumbs } from "@/components/breadcrumbs";
import { LeadAutomationCard } from "@/components/lead-automation-card";
import { leadAutomationTools } from "@/lib/lead-automation-data";
import { AiToolsPyramid } from "@/components/ai-tools-pyramid";
import { GoogleAiEcosystem } from "@/components/google-ai-ecosystem";
import { IllegalAiTools } from "@/components/illegal-ai-tools";
import { JobsAndCareers } from "@/components/jobs-and-careers";
import { FinanceAndMoney } from "@/components/finance-and-money";
import { ProductivityTools } from "@/components/productivity-tools";

export default function AiToolsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <main className="flex-1 space-y-16">
          <div className="space-y-4 text-center">
              <h1 className="text-4xl md:text-5xl font-serif tracking-tight">INSIDE GOOGLE'S AI ECOSYSTEM</h1>
              <p className="text-lg text-muted-foreground">THE TOOLS REDEFINING CREATIVITY IN 2025</p>
          </div>

          <GoogleAiEcosystem />

          <div className="space-y-4 pt-12 border-t border-border text-center">
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight">15 AI tools every solo founder needs to know about</h2>
          </div>

          <AiToolsPyramid />

          <IllegalAiTools />

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-border">
                <div className="space-y-4">
                    <Breadcrumbs path={[{ name: "AI Tools", href: "/ai-tools" }]} />
                    <h2 className="text-3xl md:text-4xl font-serif tracking-tight">Lead Automation Tools</h2>
                    <p className="text-lg text-muted-foreground">Explore these popular platforms to automate lead generation and data enrichment.</p>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {leadAutomationTools.map((tool) => (
                            <LeadAutomationCard key={tool.id} tool={tool} />
                        ))}
                    </div>
                </div>
               <div className="space-y-8">
                   <ProductivityTools />
                   <JobsAndCareers />
                   <FinanceAndMoney />
               </div>
           </div>
        </main>
      </div>
    </div>
  );
}
