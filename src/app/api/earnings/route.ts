
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const categories = await db.collection('earning_opportunities').find({}).toArray();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to fetch earning opportunities:', error);
    return NextResponse.json({ message: 'Failed to fetch earning opportunities' }, { status: 500 });
  }
}
