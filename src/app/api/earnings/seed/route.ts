
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { earningOpportunities } from '@/lib/data'; // Adjust the import path as necessary

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('earning_opportunities');

    // Optional: Clear existing data
    await collection.deleteMany({});

    // Insert new data
    const result = await collection.insertMany(earningOpportunities);
    
    return NextResponse.json({
      success: true,
      message: `${result.insertedCount} earning opportunity categories seeded successfully.`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to seed database',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
