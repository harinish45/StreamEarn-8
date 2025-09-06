import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { earningOpportunities } from "@/lib/data";
import { CategoryCarousel } from "@/components/category-carousel";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <SidebarInset>
          <Header />
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <main className="flex-1">
              <div className="p-4 md:p-6 space-y-8">
                <Hero />
              </div>
              {earningOpportunities.map((category) => (
                <CategoryCarousel key={category.id} category={category} />
              ))}
            </main>
          </ScrollArea>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
