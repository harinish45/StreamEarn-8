
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { type EarningCategory } from "@/lib/data";
import { CategoryCarousel } from "@/components/category-carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { CategoryList } from "@/components/category-list";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { connectToDatabase } from '@/lib/mongodb';
import { fromDb } from "@/lib/utils";

async function getEarningOpportunities() {
  const { db } = await connectToDatabase();
  const categories = await db.collection('earning_opportunities').find({}).toArray();
  return categories.map(fromDb);
}

export default async function EarningsPage() {
  const earningOpportunities: EarningCategory[] = await getEarningOpportunities();

  // This will be a server component, so we pass initial state down
  // to client components if needed, or handle actions via server actions.
  // For now, view mode and search can be client-side state in Header/Sidebar if complex.
  const viewMode = 'grid'; // Default view mode

  const sortedCategories = [...earningOpportunities].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <AppSidebar 
          categories={sortedCategories}
        />
        <SidebarInset>
          <Header 
            viewMode={viewMode} 
            setViewMode={() => {}} // State management would be client-side
            searchQuery=""
            setSearchQuery={() => {}}
          />
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <main className="flex-1">
              <div className="p-4 md:p-6 space-y-4">
                <Breadcrumbs path={[{ name: "Earnings", href: "/earnings" }]} />
                <Hero />
              </div>
              {viewMode === 'grid' ? (
                sortedCategories.map((category) => (
                  <CategoryCarousel key={category.id} category={category} />
                ))
              ) : (
                sortedCategories.map((category) => (
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
