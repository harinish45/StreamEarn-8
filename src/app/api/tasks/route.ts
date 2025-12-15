import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['urgent', 'important', 'neither']),
  status: z.enum(['do-now', 'do-later', 'tomorrow', 'soon', 'done', 'archived']),
  listId: z.string(),
  scheduledAt: z.number().optional(),
  estimatedTime: z.number().optional(),
  actualTime: z.number().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  recurring: z.enum(['daily', 'weekly', 'monthly']).nullable().optional(),
});

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const tasks = await db.collection('tasks').find({}).sort({ order: 1 }).toArray();
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
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const result = await db.collection('tasks').insertOne({
      ...validation.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    // The inserted document is available in result.ops[0] for mongodb driver v3
    // For v4+, we need to fetch it separately if we want to return it.
    const newDoc = await db.collection('tasks').findOne({_id: result.insertedId});

    return NextResponse.json(newDoc, { status: 201 });
  } catch (error) {
    console.error('Failed to create task:', error);
    return NextResponse.json({ message: 'Failed to create task' }, { status: 500 });
  }
}
