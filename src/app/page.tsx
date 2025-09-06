
'use client';

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { earningOpportunities as initialEarningOpportunities } from "@/lib/data";
import { CategoryCarousel } from "@/components/category-carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState, useCallback } from "react";
import { CategoryList } from "@/components/category-list";

export default function Home() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [earningOpportunities, setEarningOpportunities] = useState(initialEarningOpportunities);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSortCategories = useCallback(() => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    const sorted = [...earningOpportunities].sort((a, b) => {
      if (a.name < b.name) return newSortOrder === 'asc' ? -1 : 1;
      if (a.name > b.name) return newSortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    setEarningOpportunities(sorted);
    setSortOrder(newSortOrder);
  }, [earningOpportunities, sortOrder]);


  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <AppSidebar onSortClick={handleSortCategories} />
        <SidebarInset>
          <Header viewMode={viewMode} setViewMode={setViewMode} />
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <main className="flex-1">
              <div className="p-4 md:p-6 space-y-8">
                <Hero />
              </div>
              {viewMode === 'grid' ? (
                earningOpportunities.map((category) => (
                  <CategoryCarousel key={category.id} category={category} />
                ))
              ) : (
                 earningOpportunities.map((category) => (
                  <CategoryList key={category.id} category={category} />
                ))
              )}
            </main>
          </ScrollArea>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
