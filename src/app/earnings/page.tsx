
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { earningOpportunities, type EarningCategory } from "@/lib/data";
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
          <Header showSidebarTrigger={true} />
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <main className="flex-1">
              <div className="p-4 md:p-6 space-y-4">
                <Breadcrumbs path={[{ name: "Earnings", href: "/earnings" }]} />
                <Hero />
              </div>
              <div className="space-y-4">
                {sortedCategories.map((category) => (
                  <CategoryList key={category.id} category={category} />
                ))}
              </div>
            </main>
          </ScrollArea>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
