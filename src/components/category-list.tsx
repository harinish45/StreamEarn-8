import type { EarningCategory } from '@/lib/data';
import { OpportunityCard } from './opportunity-card';
import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

interface CategoryListProps { category:EarningCategory; }

export function CategoryList({ category }: CategoryListProps) {
  if (!category.opportunities.length) return null;
  return <section id={category.id} className="py-4 md:py-6">
    <div className="mb-4 flex items-center justify-between px-4 md:px-6">
      <div><h2 className="font-serif text-xl tracking-tight text-accent md:text-2xl">{category.name}</h2><p className="mt-0.5 max-w-2xl text-[10px] text-muted-foreground">{category.description}</p></div>
      <Button variant="link" asChild><Link href={`/category/${category.id}`} className="text-accent">See All <ArrowRight className="ml-2 h-4 w-4"/></Link></Button>
    </div>
    <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:px-6">
      {category.opportunities.map(opportunity=><OpportunityCard key={opportunity.id} opportunity={opportunity} categoryId={category.id}/>)}
    </div>
  </section>;
}
