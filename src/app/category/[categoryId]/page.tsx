'use client';

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { earningOpportunities } from "@/lib/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState, useCallback, useMemo } from "react";
import { OpportunityCard } from "@/components/opportunity-card";
import { notFound } from 'next/navigation';
import { Breadcrumbs } from "@/components/breadcrumbs";

export default function CategoryPage({ params }: { params: { categoryId: string } }) {
  const { categoryId } = params;

  const category = useMemo(() => {
    return earningOpportunities.find(c => c.id === categoryId);
  }, [categoryId]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [earningOpportunitiesState, setEarningOpportunitiesState] = useState(earningOpportunities);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [opportunitySearchQuery, setOpportunitySearchQuery] = useState('');

  const handleSortCategories = useCallback(() => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  const handlePinCategory = useCallback((catId: string) => {
    setEarningOpportunitiesState(prev => {
      const cat = prev.find(c => c.id === catId);
      if (!cat) return prev;

      const isPinned = !cat.pinned;
      const updatedCategory = { ...cat, pinned: isPinned };

      const otherCategories = prev.filter(c => c.id !== catId);
      const allCategories = [updatedCategory, ...otherCategories];

      const pinned = allCategories.filter(c => c.pinned);
      const unpinned = allCategories.filter(c => !c.pinned).sort((a, b) => {
        if (sortOrder === 'asc') return a.name.localeCompare(b.name);
        return b.name.localeCompare(a.name);
      });

      return [...pinned, ...unpinned];
    });
  }, [sortOrder]);

  const handleMarkAsVisited = useCallback((opportunityId: string) => {
    setEarningOpportunitiesState(prev => prev.map(cat => ({
      ...cat,
      opportunities: cat.opportunities.map(op =>
        op.id === opportunityId ? { ...op, visited: true } : op
      ),
    })));
  }, []);

  const filteredSidebarCategories = useMemo(() => {
    let categories = [...earningOpportunitiesState];
    if (categorySearchQuery) {
      categories = categories.filter(category =>
        category.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
      );
    }
    
    const pinned = categories.filter(c => c.pinned);
    const unpinned = categories.filter(c => !c.pinned);
    unpinned.sort((a, b) => {
      if (sortOrder === 'asc') return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

    return [...pinned, ...unpinned];
  }, [earningOpportunitiesState, sortOrder, categorySearchQuery]);
  
  const filteredOpportunities = useMemo(() => {
      if (!category) return [];
      if (!opportunitySearchQuery) return category.opportunities;

      return category.opportunities.filter(op =>
        op.title.toLowerCase().includes(opportunitySearchQuery.toLowerCase())
      );
  }, [category, opportunitySearchQuery])


  if (!category) {
    notFound();
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
                <div className="space-y-4 mb-8">
                    <Breadcrumbs path={[{ name: "Earnings", href: "/earnings" }, { name: category.name, href: `/category/${category.id}` }]} />
                    <h1 className="text-3xl md:text-4xl font-serif tracking-tight">{category.name}</h1>
                    <p className="text-lg text-muted-foreground">{category.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredOpportunities.map((opportunity) => (
                        <OpportunityCard key={opportunity.id} opportunity={opportunity} onClick={handleMarkAsVisited} />
                    ))}
                </div>
            </main>
          </ScrollArea>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
