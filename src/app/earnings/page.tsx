
'use client';

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { type EarningCategory } from "@/lib/data";
import { CategoryCarousel } from "@/components/category-carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { CategoryList } from "@/components/category-list";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function EarningsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [earningOpportunities, setEarningOpportunities] = useState<EarningCategory[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [opportunitySearchQuery, setOpportunitySearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/earnings')
      .then(res => res.json())
      .then(data => {
        setEarningOpportunities(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch earning opportunities", err);
        toast({ variant: "destructive", title: "Failed to load data" });
        setIsLoading(false);
      });
  }, [toast]);
  
  const updateCategory = async (categoryId: string, updates: Partial<EarningCategory>) => {
      try {
        const response = await fetch(`/api/earnings/${categoryId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (!response.ok) throw new Error('Failed to update category');
        const updatedCategory = await response.json();
        setEarningOpportunities(prev => prev.map(c => c.id === categoryId ? updatedCategory : c));
      } catch (error) {
        console.error(error);
        toast({ variant: "destructive", title: "Update failed" });
      }
  };
  
  const updateOpportunity = async (categoryId: string, opportunityId: string, updates: { visited: boolean }) => {
      try {
        const response = await fetch(`/api/earnings/${categoryId}?opportunityId=${opportunityId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (!response.ok) throw new Error('Failed to update opportunity');
        const updatedCategory = await response.json();
        setEarningOpportunities(prev => prev.map(c => c.id === categoryId ? updatedCategory : c));
      } catch (error) {
        console.error(error);
        toast({ variant: "destructive", title: "Update failed" });
      }
  };


  const handleSortCategories = useCallback(() => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  const handlePinCategory = useCallback((categoryId: string) => {
    const category = earningOpportunities.find(c => c.id === categoryId);
    if (!category) return;
    updateCategory(categoryId, { pinned: !category.pinned });
  }, [earningOpportunities]);

  const handleMarkAsVisited = useCallback((categoryId: string, opportunityId: string) => {
    updateOpportunity(categoryId, opportunityId, { visited: true });
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

  const LoadingSkeleton = () => (
    <div className="p-4 md:p-6 space-y-8">
      <Skeleton className="h-[40vh] w-full rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <div className="flex space-x-4">
          <Skeleton className="h-48 w-72 rounded-lg" />
          <Skeleton className="h-48 w-72 rounded-lg" />
          <Skeleton className="h-48 w-72 rounded-lg" />
          <Skeleton className="h-48 w-72 rounded-lg" />
        </div>
      </div>
       <div className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <div className="flex space-x-4">
          <Skeleton className="h-48 w-72 rounded-lg" />
          <Skeleton className="h-48 w-72 rounded-lg" />
        </div>
      </div>
    </div>
  );


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
              {isLoading ? <LoadingSkeleton /> : (
                <>
                  <div className="p-4 md:p-6 space-y-4">
                    <Breadcrumbs path={[{ name: "Earnings", href: "/earnings" }]} />
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
                </>
              )}
            </main>
          </ScrollArea>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
