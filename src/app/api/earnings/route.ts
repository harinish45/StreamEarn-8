
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { fromDb } from '@/lib/utils';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const categories = await db.collection('earning_opportunities').find({}).toArray();
    return NextResponse.json(categories.map(fromDb));
  } catch (error) {
    console.error('Failed to fetch earning opportunities:', error);
    return NextResponse.json({ message: 'Failed to fetch earning opportunities' }, { status: 500 });
  }
}
