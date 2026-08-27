import { NextRequest, NextResponse } from 'next/server';
import { createSession, getUsername, sessionCookie, verifyPassword } from '@/lib/auth';

export const runtime = 'nodejs';

function noStore(response: NextResponse) {
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.toLowerCase().startsWith('application/json')) return noStore(NextResponse.json({ error: 'Invalid request' }, { status: 400 }));
    const contentLength = Number(request.headers.get('content-length') || '0');
    if (contentLength > 16 * 1024) return noStore(NextResponse.json({ error: 'Invalid request' }, { status: 400 }));
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) return noStore(NextResponse.json({ error: 'Invalid request' }, { status: 400 }));
    const username = typeof body.username === 'string' ? body.username.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!username || !password || username.length > 100 || password.length > 256) return noStore(NextResponse.json({ error: 'Invalid username or password' }, { status: 401 }));
    if (username !== getUsername() || !verifyPassword(password)) return noStore(NextResponse.json({ error: 'Invalid username or password' }, { status: 401 }));
    const response = noStore(NextResponse.json({ ok: true }));
    response.headers.set('Set-Cookie', sessionCookie(createSession(username)));
    return response;
  } catch { return noStore(NextResponse.json({ error: 'Invalid request' }, { status: 400 })); }
}
