
'use client';

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { EarningCategory, earningOpportunities as initialEarningOpportunities } from "@/lib/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LeadAutomationCard } from "@/components/lead-automation-card";
import { leadAutomationTools } from "@/lib/lead-automation-data";

export default function AiToolsPage() {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [earningOpportunities, setEarningOpportunities] = React.useState(initialEarningOpportunities);
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [categorySearchQuery, setCategorySearchQuery] = React.useState('');
  const [opportunitySearchQuery, setOpportunitySearchQuery] = React.useState('');

  const handleSortCategories = React.useCallback(() => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  const handlePinCategory = React.useCallback((categoryId: string) => {
    setEarningOpportunities(prev => {
      const category = prev.find(c => c.id === categoryId);
      if (!category) return prev;

      const isPinned = !category.pinned;
      const updatedCategory = { ...category, pinned: isPinned };

      const otherCategories = prev.filter(c => c.id !== categoryId);
      
      const allCategories = [updatedCategory, ...otherCategories];

      const pinned = allCategories.filter(c => c.pinned);
      const unpinned = allCategories.filter(c => !c.pinned).sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });

      return [...pinned, ...unpinned];
    });
  }, [sortOrder]);
  
  const filteredAndSortedCategories = React.useMemo(() => {
    let categories = [...earningOpportunities];

    // Filter categories by category search query
    if (categorySearchQuery) {
      categories = categories.filter(category =>
        category.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
      );
    }
    
    // Process opportunities within categories
    let categoriesWithFilteredOpportunities = categories.map(category => {
      let opportunities = category.opportunities;
      // Filter opportunities within categories by opportunity search query
      if (opportunitySearchQuery) {
        opportunities = opportunities.filter(op =>
          op.title.toLowerCase().includes(opportunitySearchQuery.toLowerCase())
        );
      }
      return { ...category, opportunities };
    }).filter(category => category.opportunities.length > 0);
    
    
    // Separate pinned and unpinned categories
    const pinned = categoriesWithFilteredOpportunities.filter(c => c.pinned);
    const unpinned = categoriesWithFilteredOpportunities.filter(c => !c.pinned);

    // Sort unpinned categories
    unpinned.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    // Combine pinned and sorted unpinned categories
    return [...pinned, ...unpinned];
  }, [earningOpportunities, sortOrder, categorySearchQuery, opportunitySearchQuery]);


  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <AppSidebar 
          categories={filteredAndSortedCategories} 
          onSortClick={handleSortCategories} 
          sortOrder={sortOrder}
          onPinClick={handlePinCategory}
          searchQuery={categorySearchQuery}
          setSearchQuery={setCategorySearchQuery}
        />
        <SidebarInset>
          <Header 
            viewMode={viewMode} 
            setViewMode={setViewMode} 
            searchQuery={opportunitySearchQuery}
            setSearchQuery={setOpportunitySearchQuery}
          />
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <main className="flex-1 p-4 md:p-6">
              <div className="space-y-4 mb-8">
                  <Breadcrumbs path={[{ name: "AI Tools", href: "/ai-tools" }]} />
                  <h1 className="text-3xl md:text-4xl font-serif tracking-tight font-bungee">Lead Automation Tools</h1>
                  <p className="text-lg text-muted-foreground">Explore these popular platforms to automate lead generation and data enrichment.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {leadAutomationTools.map((tool) => (
                      <LeadAutomationCard key={tool.id} tool={tool} />
                  ))}
              </div>
            </main>
          </ScrollArea>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
