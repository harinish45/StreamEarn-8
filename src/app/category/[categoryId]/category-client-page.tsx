
'use client';

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { type EarningCategory } from "@/lib/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { OpportunityCard } from "@/components/opportunity-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { notFound, usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoryClientPage({ initialCategoryId }: { initialCategoryId: string }) {
  const pathname = usePathname();
  const categoryId = pathname.split('/').pop() || initialCategoryId;

  const [allCategories, setAllCategories] = useState<EarningCategory[]>([]);
  const [category, setCategory] = useState<EarningCategory | null>(null);
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
        setAllCategories(data);
        const currentCategory = data.find((c: EarningCategory) => c.id === categoryId);
        if (currentCategory) {
          setCategory(currentCategory);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch data", err);
        toast({ variant: "destructive", title: "Failed to load data" });
        setIsLoading(false);
      });
  }, [categoryId, toast]);

  useEffect(() => {
    if (allCategories.length > 0) {
      const currentCategory = allCategories.find((c: EarningCategory) => c.id === categoryId);
      if (currentCategory) {
        setCategory(currentCategory);
      } else {
        // Don't call notFound() on client side, just show a message or handle appropriately
        console.warn(`Category with id ${categoryId} not found.`);
        setCategory(null);
      }
    }
  }, [categoryId, allCategories]);

  const updateCategory = async (catId: string, updates: Partial<EarningCategory>) => {
    try {
      const response = await fetch(`/api/earnings/${catId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update category');
      const updatedCategory = await response.json();
      setAllCategories(prev => prev.map(c => c.id === catId ? updatedCategory : c));
      if (catId === categoryId) {
        setCategory(updatedCategory);
      }
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Update failed" });
    }
  };
  
  const updateOpportunity = async (catId: string, opportunityId: string, updates: { visited: boolean }) => {
    try {
      const response = await fetch(`/api/earnings/${catId}?opportunityId=${opportunityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update opportunity');
      const updatedCategory = await response.json();
      setAllCategories(prev => prev.map(c => c.id === catId ? updatedCategory : c));
      if (catId === categoryId) {
        setCategory(updatedCategory);
      }
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Update failed" });
    }
  };

  const handleSortCategories = useCallback(() => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  const handlePinCategory = useCallback((catId: string) => {
    const cat = allCategories.find(c => c.id === catId);
    if (!cat) return;
    updateCategory(catId, { pinned: !cat.pinned });
  }, [allCategories]);

  const handleMarkAsVisited = useCallback((catId: string, opportunityId: string) => {
    updateOpportunity(catId, opportunityId, { visited: true });
  }, []);

  const filteredSidebarCategories = useMemo(() => {
    let categories = [...allCategories];
    if (categorySearchQuery) {
      categories = categories.filter(c => c.name.toLowerCase().includes(categorySearchQuery.toLowerCase()));
    }
    
    const pinned = categories.filter(c => c.pinned);
    const unpinned = categories.filter(c => !c.pinned);
    unpinned.sort((a, b) => sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

    return [...pinned, ...unpinned];
  }, [allCategories, sortOrder, categorySearchQuery]);
  
  const filteredOpportunities = useMemo(() => {
    if (!category) return [];
    let opportunities = category.opportunities;
    if (opportunitySearchQuery) {
      opportunities = opportunities.filter(op => op.title.toLowerCase().includes(opportunitySearchQuery.toLowerCase()));
    }
    const currentCategoryState = allCategories.find(c => c.id === categoryId);
    return currentCategoryState ? currentCategoryState.opportunities.filter(op => opportunities.some(fop => fop.id === op.id)) : [];
  }, [category, opportunitySearchQuery, allCategories, categoryId]);

  if (isLoading) {
    return (
      <SidebarProvider>
         <div className="flex min-h-screen bg-background">
            <aside className="w-64 flex-shrink-0 border-r p-4 hidden md:block"><Skeleton className="h-full w-full" /></aside>
            <SidebarInset>
              <header className="h-16 border-b p-4"><Skeleton className="h-full w-full" /></header>
              <main className="p-6 space-y-6">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-6 w-2/3" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-lg" />)}
                </div>
              </main>
            </SidebarInset>
         </div>
      </SidebarProvider>
    );
  }

  if (!category) {
    return (
       <div className="flex items-center justify-center h-screen text-muted-foreground">
        Category not found.
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <AppSidebar 
          categories={filteredSidebarCategories} 
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
                <div className="space-y-4 mb-6">
                    <Breadcrumbs path={[{ name: "Earnings", href: "/earnings" }, { name: category.name, href: `/category/${category.id}` }]} />
                    <h1 className="text-3xl md:text-4xl font-serif tracking-tight">{category.name}</h1>
                    <p className="text-lg text-muted-foreground">{category.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredOpportunities.map((opportunity) => (
                        <OpportunityCard key={opportunity.id} opportunity={opportunity} categoryId={category.id} onClick={handleMarkAsVisited} />
                    ))}
                </div>
            </main>
          </ScrollArea>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
