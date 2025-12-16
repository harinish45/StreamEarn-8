
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { earningOpportunities, type EarningCategory } from "@/lib/data";
import { CategoryCarousel } from "@/components/category-carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { CategoryList } from "@/components/category-list";
import { Breadcrumbs } from "@/components/breadcrumbs";

async function getEarningData() {
  // In a real app, you might fetch this data from a database
  const categories: EarningCategory[] = earningOpportunities;
  return categories;
}

export default async function EarningsPage() {
  const categories = await getEarningData();

  const viewMode = 'grid'; // Default view mode

  const sortedCategories = [...categories].sort((a, b) => {
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
          <Header viewMode={viewMode} showSidebarTrigger={true} />
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

    