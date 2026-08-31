import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { rejectCrossOrigin } from '@/lib/security';
import crypto from 'node:crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function getUserId() {
  const sb = await createSupabaseServerClient();
  const claims = await sb.auth.getClaims().catch(() => null);
  const id = claims?.data?.claims?.sub;
  if (id) return { sb, id };
  const user = await sb.auth.getUser();
  if (user.error || !user.data.user) throw new Error('Unauthorized');
  return { sb, id: user.data.user.id };
}

const clean = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const unauthorized = () => NextResponse.json({ error: 'Authentication required. Please sign in again.' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });

export async function GET() {
  try {
    const { sb, id } = await getUserId();
    const result = await sb.from('project_ideas').select('id,name,description,created_at,updated_at').eq('owner_id', id).order('updated_at', { ascending: false });
    if (!result.error) return NextResponse.json(result.data || [], { headers: { 'Cache-Control': 'private,no-store' } });
    const fallback = await createSupabaseAdminClient().from('project_ideas').select('id,name,description,created_at,updated_at').eq('owner_id', id).order('updated_at', { ascending: false });
    if (fallback.error) throw result.error;
    return NextResponse.json(fallback.data || [], { headers: { 'Cache-Control': 'private,no-store' } });
  } catch (error) {
    console.error('[project-ideas] list failed', error);
    return unauthorized();
  }
}

export async function POST(request: NextRequest) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;
  try {
    const { sb, id } = await getUserId();
    const contentType = (request.headers.get('content-type') || '').toLowerCase();
    let name = '';
    let description = '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      name = clean(body?.name, 160);
      description = clean(body?.description, 2000);
    } else if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      const form = await request.formData();
      name = clean(form.get('name'), 160);
      description = clean(form.get('description'), 2000);
    } else {
      return NextResponse.json({ error: 'Invalid request format.' }, { status: 415 });
    }
    if (!name) return NextResponse.json({ error: 'Idea name is required.' }, { status: 400 });
    const payload = { id: crypto.randomUUID(), owner_id: id, name, description, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    const result = await sb.from('project_ideas').insert(payload).select('id,name,description,created_at,updated_at').single();
    if (!result.error) {
      if (contentType.includes('json')) return NextResponse.json(result.data, { status: 201, headers: { 'Cache-Control': 'no-store' } });
      return NextResponse.redirect(new URL('/projects?idea=created', request.url), 303);
    }
    const fallback = await createSupabaseAdminClient().from('project_ideas').insert(payload).select('id,name,description,created_at,updated_at').single();
    if (fallback.error) throw new Error(`${result.error.message}; fallback: ${fallback.error.message}`);
    if (contentType.includes('json')) return NextResponse.json(fallback.data, { status: 201, headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.redirect(new URL('/projects?idea=created', request.url), 303);
  } catch (error) {
    console.error('[project-ideas] create failed', error);
    if (error instanceof Error && error.message === 'Unauthorized') return unauthorized();
    return NextResponse.json({ error: 'Idea could not be saved. Please try again.' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
