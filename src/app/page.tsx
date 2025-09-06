
'use client';

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { EarningCategory, earningOpportunities as initialEarningOpportunities } from "@/lib/data";
import { CategoryCarousel } from "@/components/category-carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState, useCallback, useMemo } from "react";
import { CategoryList } from "@/components/category-list";

export default function Home() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [earningOpportunities, setEarningOpportunities] = useState(initialEarningOpportunities);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSortCategories = useCallback(() => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  const handlePinCategory = useCallback((categoryId: string) => {
    setEarningOpportunities(prev => {
      const category = prev.find(c => c.id === categoryId);
      if (!category) return prev;

      const isPinned = !category.pinned;
      const updatedCategory = { ...category, pinned: isPinned };

      const otherCategories = prev.filter(c => c.id !== categoryId);
      if (isPinned) {
        return [updatedCategory, ...otherCategories];
      } else {
        return [...otherCategories, updatedCategory];
      }
    });
  }, []);
  
  const sortedAndPinnedOpportunities = useMemo(() => {
    return [...earningOpportunities].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  }, [earningOpportunities, sortOrder]);


  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <AppSidebar 
          categories={sortedAndPinnedOpportunities} 
          onSortClick={handleSortCategories} 
          sortOrder={sortOrder}
          onPinClick={handlePinCategory}
        />
        <SidebarInset>
          <Header viewMode={viewMode} setViewMode={setViewMode} />
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <main className="flex-1">
              <div className="p-4 md:p-6 space-y-8">
                <Hero />
              </div>
              {viewMode === 'grid' ? (
                sortedAndPinnedOpportunities.map((category) => (
                  <CategoryCarousel key={category.id} category={category} />
                ))
              ) : (
                 sortedAndPinnedOpportunities.map((category) => (
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
