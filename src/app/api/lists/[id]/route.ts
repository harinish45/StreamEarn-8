
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const listUpdateSchema = z.object({
  name: z.string().min(1, 'List name is required').optional(),
  tasks: z.array(z.object({
    id: z.string(),
    text: z.string(),
    completed: z.boolean(),
  })).optional(),
}).partial();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid list ID' }, { status: 400 });
  }
  
  try {
    const { db } = await connectToDatabase();
    const list = await db.collection('lists').findOne({ _id: new ObjectId(id) });

    if (!list) {
      return NextResponse.json({ message: 'List not found' }, { status: 404 });
    }

    return NextResponse.json(list);
  } catch (error) {
    console.error(`Failed to fetch list ${id}:`, error);
    return NextResponse.json({ message: 'Failed to fetch list' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid list ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const validation = listUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const result = await db.collection('lists').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...validation.data, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ message: 'List not found' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(`Failed to update list ${id}:`, error);
    return NextResponse.json({ message: 'Failed to update list' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid list ID' }, { status: 400 });
  }
  
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('lists').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'List not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'List deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete list ${id}:`, error);
    return NextResponse.json({ message: 'Failed to delete list' }, { status: 500 });
  }
}
