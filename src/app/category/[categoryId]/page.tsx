
import React from 'react';
import { CategoryClientPage } from './category-client-page';
import { connectToDatabase } from '@/lib/mongodb';
import { notFound } from 'next/navigation';

export default async function CategoryPage({ params }: { params: { categoryId: string } }) {
  const { categoryId } = params;

  // Validate on server if category exists at all to render notFound page if needed.
  const { db } = await connectToDatabase();
  const category = await db.collection('earning_opportunities').findOne({ id: categoryId });

  if (!category) {
    notFound();
  }

  // We pass the categoryId to the client component
  // It will re-fetch but this server check is good for SEO and immediate 404s.
  return <CategoryClientPage initialCategoryId={categoryId} />;
}
