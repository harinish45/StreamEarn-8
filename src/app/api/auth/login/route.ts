import { NextRequest, NextResponse } from 'next/server';
import { createSession, getUsername, sessionCookie, verifyPassword } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const username = typeof body?.username === 'string' ? body.username.trim() : '';
    const password = typeof body?.password === 'string' ? body.password : '';
    if (!username || !password || username.length > 100 || password.length > 256) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    if (username !== getUsername() || !verifyPassword(password)) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    const response = NextResponse.json({ ok: true });
    response.headers.set('Set-Cookie', sessionCookie(createSession(username)));
    return response;
  } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }
}
