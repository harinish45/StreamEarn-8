
import type { EarningCategory } from "@/lib/data";
import { OpportunityCard } from "./opportunity-card";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface CategoryListProps {
  category: EarningCategory;
}

export function CategoryList({ category }: CategoryListProps) {
  return (
    <section id={category.id} className="py-6 md:py-8">
      <div className="flex items-center justify-between mb-4 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold font-headline">
            {category.name}
          </h2>
        </div>
        <Button variant="link" asChild>
          <Link href="#">
            See All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4 md:px-6">
          {category.opportunities.map((opportunity, index) => (
            <OpportunityCard key={index} opportunity={opportunity} />
          ))}
      </div>
    </section>
  );
}
