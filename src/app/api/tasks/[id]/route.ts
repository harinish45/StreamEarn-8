
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { fromDb } from '@/lib/utils';

const taskUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional().nullable(),
  priority: z.enum(['urgent', 'important', 'neither']).optional(),
  status: z.enum(['do-now', 'do-later', 'tomorrow', 'soon', 'done', 'archived']).optional(),
  listId: z.string().optional(),
  scheduledAt: z.number().optional().nullable(),
  estimatedTime: z.number().optional().nullable(),
  recurring: z.enum(['daily', 'weekly', 'monthly']).nullable().optional(),
  audioBlob: z.any().optional(), // Allow audioBlob to be part of the update
}).partial();


export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid task ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    // Exclude audioBlob from schema validation as it's not a standard JSON type
    const { audioBlob, ...taskData } = body;
    const validation = taskUpdateSchema.safeParse(taskData);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const result = await db.collection('tasks').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...validation.data, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(fromDb(result));
  } catch (error) {
    console.error(`Failed to update task ${id}:`, error);
    return NextResponse.json({ message: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid task ID' }, { status: 400 });
  }
  
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('tasks').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete task ${id}:`, error);
    return NextResponse.json({ message: 'Failed to delete task' }, { status: 500 });
  }
}
