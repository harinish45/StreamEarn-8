
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
  
  const filteredAndSortedCategories = useMemo(() => {
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
            <main className="flex-1">
              <div className="p-4 md:p-6 space-y-8">
                <Hero />
              </div>
              {viewMode === 'grid' ? (
                filteredAndSortedCategories.map((category) => (
                  <CategoryCarousel key={category.id} category={category} onOpportunityClick={handleMarkAsVisited} />
                ))
              ) : (
                 filteredAndSortedCategories.map((category) => (
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
