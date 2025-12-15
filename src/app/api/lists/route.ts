
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { z } from 'zod';
import { ObjectId } from 'mongodb';

const listSchema = z.object({
  name: z.string().min(1, 'List name is required'),
  tasks: z.array(z.object({
    id: z.string(),
    text: z.string(),
    completed: z.boolean(),
  })).optional().default([]),
});

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const lists = await db.collection('lists').find({}).toArray();
    return NextResponse.json(lists);
  } catch (error) {
    console.error('Failed to fetch lists:', error);
    return NextResponse.json({ message: 'Failed to fetch lists' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = listSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const result = await db.collection('lists').insertOne({
      ...validation.data,
      createdAt: new Date(),
    });

    const newList = await db.collection('lists').findOne({ _id: result.insertedId });
    return NextResponse.json(newList, { status: 201 });
  } catch (error) {
    console.error('Failed to create list:', error);
    return NextResponse.json({ message: 'Failed to create list' }, { status: 500 });
  }
}
