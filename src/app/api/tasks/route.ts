
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  priority: z.enum(['urgent', 'important', 'neither']).optional(),
  status: z.enum(['do-now', 'do-later', 'tomorrow', 'soon', 'done', 'archived']).optional(),
  listId: z.string().optional(),
  scheduledAt: z.number().optional().nullable(),
  estimatedTime: z.number().optional().nullable(),
  actualTime: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  recurring: z.enum(['daily', 'weekly', 'monthly']).nullable().optional(),
});

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const tasks = await db.collection('tasks').find({}).toArray();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json({ message: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = taskSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Validation failed', errors: validation.error.errors }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const result = await db.collection('tasks').insertOne({
      ...validation.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    const newDoc = await db.collection('tasks').findOne({_id: result.insertedId});
    if (!newDoc) {
      return NextResponse.json({ message: 'Failed to retrieve created task' }, { status: 500 });
    }

    return NextResponse.json(newDoc, { status: 201 });
  } catch (error) {
    console.error('Failed to create task:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Failed to create task', error: errorMessage }, { status: 500 });
  }
}
