import React from 'react';
import { notFound } from 'next/navigation';
import { earningOpportunities } from "@/lib/data";
import { CategoryClientPage } from './category-client-page';

export default function CategoryPage({ params }: { params: { categoryId: string } }) {
  const { categoryId } = params;

  const category = earningOpportunities.find(c => c.id === categoryId);

  if (!category) {
    notFound();
  }

  // We pass the category and categoryId to the client component
  return <CategoryClientPage category={category} />;
}
