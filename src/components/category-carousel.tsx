
import type { EarningCategory } from "@/lib/data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { OpportunityCard } from "./opportunity-card";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface CategoryCarouselProps {
  category: EarningCategory;
  onOpportunityClick: (opportunityId: string) => void;
}

export function CategoryCarousel({ category, onOpportunityClick }: CategoryCarouselProps) {
  if (category.opportunities.length === 0) {
    return null;
  }
  
  return (
    <section id={category.id} className="py-8 md:py-12">
      <div className="flex items-center justify-between mb-6 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-serif text-foreground">
            {category.name}
          </h2>
        </div>
        <Button variant="link" asChild>
          <Link href="#">
            See All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {category.opportunities.map((opportunity, index) => (
            <CarouselItem
              key={index}
              className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <div className="p-1">
                <OpportunityCard opportunity={opportunity} onClick={onOpportunityClick} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-16 hidden md:flex" />
        <CarouselNext className="mr-16 hidden md:flex" />
      </Carousel>
    </section>
  );
}
