import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Test connection by pinging the database
    await db.admin().ping();
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      database: 'streamEarn',
      status: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'MongoDB connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
