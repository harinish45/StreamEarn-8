import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { archiveProject } from '@/lib/project-store';
import { AUTH_COOKIE, verifySession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  if (!verifySession((await cookies()).get(AUTH_COOKIE)?.value)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    if (!body || typeof body.id !== 'string' || !/^[0-9a-f-]{20,80}$/i.test(body.id)) return NextResponse.json({ error: 'Invalid project' }, { status: 400 });
    await archiveProject(body.id);
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return NextResponse.json({ error: 'Unable to archive project' }, { status: 404 }); }
}
