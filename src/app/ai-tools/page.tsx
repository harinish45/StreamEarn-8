
'use client';

import { useState } from 'react';
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GoogleAiEcosystem } from "@/components/google-ai-ecosystem";
import { IllegalAiTools } from "@/components/illegal-ai-tools";
import { JobsAndCareers } from "@/components/jobs-and-careers";
import { FinanceAndMoney } from "@/components/finance-and-money";
import { ProductivityTools } from "@/components/productivity-tools";
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function AiToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <main className="flex-1 space-y-16">
          <div className="space-y-4 text-center">
              <h1 className="text-4xl md:text-5xl font-serif tracking-tight">INSIDE GOOGLE'S AI ECOSYSTEM</h1>
              <p className="text-lg text-muted-foreground">THE TOOLS REDEFINING CREATIVITY IN 2025</p>
          </div>
          
          <div className="relative mx-auto w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for AI tools..."
              className="w-full rounded-full bg-card py-6 pl-12 pr-4 text-lg shadow-lg focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <GoogleAiEcosystem searchQuery={searchQuery} />

          <IllegalAiTools searchQuery={searchQuery} />

           <div className="space-y-8 pt-12 border-t border-border">
              <div className="space-y-4">
                  <Breadcrumbs path={[{ name: "AI Tools", href: "/ai-tools" }]} />
              </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                 <ProductivityTools searchQuery={searchQuery} />
                 <JobsAndCareers searchQuery={searchQuery} />
                 <FinanceAndMoney searchQuery={searchQuery} />
             </div>
           </div>
        </main>
      </div>
    </div>
  );
}
