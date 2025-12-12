
'use client';

import { Breadcrumbs } from "@/components/breadcrumbs";
import { LeadAutomationCard } from "@/components/lead-automation-card";
import { leadAutomationTools } from "@/lib/lead-automation-data";

export default function AiToolsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background p-4 md:p-6">
      <div className="mx-auto w-full max-w-6xl">
        <main className="flex-1 py-12 md:py-16">
          <div className="space-y-4 mb-8">
              <Breadcrumbs path={[{ name: "AI Tools", href: "/ai-tools" }]} />
              <h1 className="text-3xl md:text-4xl font-serif tracking-tight">Lead Automation Tools</h1>
              <p className="text-lg text-muted-foreground">Explore these popular platforms to automate lead generation and data enrichment.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {leadAutomationTools.map((tool) => (
                  <LeadAutomationCard key={tool.id} tool={tool} />
              ))}
          </div>
        </main>
      </div>
    </div>
  );
}
