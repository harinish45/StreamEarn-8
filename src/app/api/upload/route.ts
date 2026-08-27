import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'application/pdf', 'text/plain']);
const SAFE_NAME = /^[a-zA-Z0-9._-]+$/;

export async function POST(request: NextRequest) {
  try {
    const contentLength = Number(request.headers.get('content-length') || '0');
    if (contentLength > MAX_FILE_SIZE + 64 * 1024) return NextResponse.json({ error: 'File too large' }, { status: 413 });
    const formData = await request.formData();
    const entry = formData.get('file');
    if (!(entry instanceof File)) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (entry.size <= 0 || entry.size > MAX_FILE_SIZE) return NextResponse.json({ error: 'File too large' }, { status: 413 });
    if (!ALLOWED_TYPES.has(entry.type)) return NextResponse.json({ error: 'Unsupported file type' }, { status: 415 });
    const original = entry.name.replace(/\\/g, '/').split('/').pop() || 'upload';
    if (original.length > 120 || !SAFE_NAME.test(original)) return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    const buffer = Buffer.from(await entry.arrayBuffer());
    if (buffer.length !== entry.size) return NextResponse.json({ error: 'Invalid upload' }, { status: 400 });
    const extension = original.includes('.') ? `.${original.split('.').pop()}` : '';
    const filename = `uploads/${crypto.randomUUID()}${extension.toLowerCase()}`;
    const blob = await put(filename, buffer, { access: 'public', contentType: entry.type, addRandomSuffix: false });
    return NextResponse.json({ success: true, url: blob.url, pathname: blob.pathname, filename: original, size: entry.size }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
