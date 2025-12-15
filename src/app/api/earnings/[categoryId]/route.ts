
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { z } from 'zod';
import { fromDb } from '@/lib/utils';
import { ObjectId } from 'mongodb';

const categoryUpdateSchema = z.object({
  pinned: z.boolean().optional(),
}).partial();

const opportunityUpdateSchema = z.object({
  visited: z.boolean().optional(),
}).partial();


export async function GET(request: Request, { params }: { params: { categoryId: string } }) {
    const { categoryId } = params;

    try {
        const { db } = await connectToDatabase();
        const category = await db.collection('earning_opportunities').findOne({ id: categoryId });

        if (!category) {
            return NextResponse.json({ message: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json(fromDb(category));
    } catch (error) {
        console.error(`Failed to fetch category ${categoryId}:`, error);
        return NextResponse.json({ message: 'Failed to fetch category' }, { status: 500 });
    }
}


export async function PUT(request: Request, { params }: { params: { categoryId: string } }) {
  const { categoryId } = params;
  const { searchParams } = new URL(request.url);
  const opportunityId = searchParams.get('opportunityId');

  try {
    const body = await request.json();
    const { db } = await connectToDatabase();
    
    if (opportunityId) {
      // Update an opportunity within a category
      const validation = opportunityUpdateSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(validation.error.errors, { status: 400 });
      }

      const result = await db.collection('earning_opportunities').updateOne(
        { id: categoryId, "opportunities.id": opportunityId },
        { $set: { "opportunities.$.visited": validation.data.visited } }
      );
      
      if (result.matchedCount === 0) {
        return NextResponse.json({ message: 'Opportunity or Category not found' }, { status: 444 });
      }

    } else {
      // Update a category
      const validation = categoryUpdateSchema.safeParse(body);
       if (!validation.success) {
        return NextResponse.json(validation.error.errors, { status: 400 });
      }

      const result = await db.collection('earning_opportunities').updateOne(
        { id: categoryId },
        { $set: validation.data }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ message: 'Category not found' }, { status: 404 });
      }
    }
    
    const updatedCategory = await db.collection('earning_opportunities').findOne({ id: categoryId });
    return NextResponse.json(fromDb(updatedCategory));

  } catch (error) {
    console.error(`Failed to update category ${categoryId}:`, error);
    return NextResponse.json({ message: 'Failed to update category' }, { status: 500 });
  }
}
