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
import { ArrowRight, Pin, ArrowDownUp } from "lucide-react";

interface CategoryCarouselProps {
  category: EarningCategory;
}

export function CategoryCarousel({ category }: CategoryCarouselProps) {
  return (
    <section id={category.id} className="py-6 md:py-8">
      <div className="flex items-center justify-between mb-4 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold font-headline">
            {category.name}
          </h2>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon">
                <Pin className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
                <ArrowDownUp className="h-4 w-4" />
            </Button>
          </div>
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
        <CarouselContent className="-ml-2 md:-ml-4">
          {category.opportunities.map((opportunity, index) => (
            <CarouselItem
              key={index}
              className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
            >
              <div className="p-1">
                <OpportunityCard opportunity={opportunity} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-14 hidden md:flex" />
        <CarouselNext className="mr-14 hidden md:flex" />
      </Carousel>
    </section>
  );
}
