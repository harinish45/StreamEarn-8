
'use client';

import { Breadcrumbs } from "@/components/breadcrumbs";
import { LeadAutomationCard } from "@/components/lead-automation-card";
import { leadAutomationTools } from "@/lib/lead-automation-data";
import { AiToolsPyramid } from "@/components/ai-tools-pyramid";
import { GoogleAiEcosystem } from "@/components/google-ai-ecosystem";
import { IllegalAiTools } from "@/components/illegal-ai-tools";

export default function AiToolsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background p-4 md:p-6">
      <div className="mx-auto w-full max-w-6xl">
        <main className="flex-1 py-12 md:py-16">
          <div className="space-y-4 mb-16 text-center">
              <h1 className="text-3xl md:text-4xl font-serif tracking-tight">INSIDE GOOGLE'S AI ECOSYSTEM</h1>
              <p className="text-lg text-muted-foreground">THE TOOLS REDEFINING CREATIVITY IN 2025</p>
          </div>

          <GoogleAiEcosystem />

          <div className="space-y-4 my-16 pt-12 border-t border-border">
            <h2 className="text-3xl md:text-4xl font-serif tracking-tight text-center">15 AI tools every solo founder needs to know about</h2>
          </div>

          <AiToolsPyramid />

          <IllegalAiTools />

          <div className="space-y-4 my-16 pt-12 border-t border-border">
              <Breadcrumbs path={[{ name: "AI Tools", href: "/ai-tools" }]} />
              <h2 className="text-3xl md:text-4xl font-serif tracking-tight">Lead Automation Tools</h2>
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
