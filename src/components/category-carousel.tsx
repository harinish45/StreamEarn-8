
import type { EarningCategory } from "@/lib/data";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { OpportunityCard } from "./opportunity-card";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface CategoryCarouselProps {
  category: EarningCategory;
}

export function CategoryCarousel({ category }: CategoryCarouselProps) {
  if (category.opportunities.length === 0) {
    return null;
  }
  
  return (
    <section id={category.id} className="py-8 md:py-12">
      <div className="flex items-center justify-between mb-6 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-serif tracking-tight">
            {category.name}
          </h2>
        </div>
        <Button variant="link" asChild>
          <Link href={`/category/${category.id}`}>
            See All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <ScrollArea className="w-full whitespace-nowrap px-4 md:px-6 category-carousel-scrollbar">
        <div className="flex w-max space-x-4 pb-4">
          {category.opportunities.map((opportunity, index) => (
            <div
              key={index}
              className="w-[280px] h-full"
            >
              <OpportunityCard opportunity={opportunity} categoryId={category.id} />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
