
import type { EarningCategory } from "@/lib/data";
import { OpportunityCard } from "./opportunity-card";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface CategoryListProps {
  category: EarningCategory;
  onOpportunityClick: (opportunityId: string) => void;
}

export function CategoryList({ category, onOpportunityClick }: CategoryListProps) {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4 md:px-6">
          {category.opportunities.map((opportunity, index) => (
            <OpportunityCard key={index} opportunity={opportunity} onClick={onOpportunityClick} />
          ))}
      </div>
    </section>
  );
}
