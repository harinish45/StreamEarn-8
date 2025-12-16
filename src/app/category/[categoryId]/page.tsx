
import React from 'react';
import { notFound } from 'next/navigation';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { earningOpportunities, type EarningCategory } from "@/lib/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OpportunityCard } from "@/components/opportunity-card";
import { Breadcrumbs } from "@/components/breadcrumbs";


async function getCategoryData(categoryId: string) {
  const allCategories = earningOpportunities;
  const currentCategory = allCategories.find((c) => c.id === categoryId);

  if (!currentCategory) {
    return { allCategories, category: null };
  }

  return {
    allCategories,
    category: currentCategory,
  };
}

export default async function CategoryPage({ params }: { params: { categoryId: string } }) {
  const { categoryId } = params;
  const { allCategories, category } = await getCategoryData(categoryId);

  if (!category) {
    notFound();
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <AppSidebar 
          categories={allCategories} 
        />
        <SidebarInset>
          <Header showSidebarTrigger={true} />
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <main className="flex-1 p-4 md:p-6">
                <div className="space-y-4 mb-6">
                    <Breadcrumbs path={[{ name: "Earnings", href: "/earnings" }, { name: category.name, href: `/category/${category.id}` }]} />
                    <h1 className="text-3xl md:text-4xl font-serif tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{category.name}</h1>
                    <p className="text-lg text-muted-foreground">{category.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {category.opportunities.map((opportunity) => (
                        <OpportunityCard key={opportunity.id} opportunity={opportunity} categoryId={category.id} />
                    ))}
                </div>
            </main>
          </ScrollArea>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
