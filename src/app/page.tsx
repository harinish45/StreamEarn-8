
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
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [opportunitySearchQuery, setOpportunitySearchQuery] = useState('');

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
        const pinned = [updatedCategory, ...otherCategories].filter(c => c.pinned);
        const unpinned = [updatedCategory, ...otherCategories].filter(c => !c.pinned);
        return [...pinned, ...unpinned];
      }
    });
  }, []);

  const handleMarkAsVisited = useCallback((opportunityId: string) => {
    setEarningOpportunities(prev => {
      return prev.map(category => {
        return {
          ...category,
          opportunities: category.opportunities.map(op => {
            if (op.id === opportunityId) {
              return { ...op, visited: true };
            }
            return op;
          })
        };
      });
    });
  }, []);
  
  const filteredOpportunities = useMemo(() => {
    let opportunities = [...earningOpportunities];

    // Filter categories by category search query
    if (categorySearchQuery) {
      opportunities = opportunities.filter(category =>
        category.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
      );
    }

    // Filter opportunities within categories by opportunity search query
    if (opportunitySearchQuery) {
      opportunities = opportunities.map(category => {
        const filteredOps = category.opportunities.filter(op =>
          op.title.toLowerCase().includes(opportunitySearchQuery.toLowerCase())
        );
        return { ...category, opportunities: filteredOps };
      }).filter(category => category.opportunities.length > 0);
    }
    
    // Sort categories
    return opportunities.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  }, [earningOpportunities, sortOrder, categorySearchQuery, opportunitySearchQuery]);


  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <AppSidebar 
          categories={filteredOpportunities} 
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
            <main className="flex-1">
              <div className="p-4 md:p-6 space-y-8">
                <Hero />
              </div>
              {viewMode === 'grid' ? (
                filteredOpportunities.map((category) => (
                  <CategoryCarousel key={category.id} category={category} onOpportunityClick={handleMarkAsVisited} />
                ))
              ) : (
                 filteredOpportunities.map((category) => (
                  <CategoryList key={category.id} category={category} onOpportunityClick={handleMarkAsVisited} />
                ))
              )}
            </main>
          </ScrollArea>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
