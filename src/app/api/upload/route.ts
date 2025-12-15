import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `uploads/${Date.now()}-${file.name}`;
    
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: file.type,
    });
    
    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
      filename: file.name,
      size: file.size,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      },
      { status: 500 }
    );
  }
}
