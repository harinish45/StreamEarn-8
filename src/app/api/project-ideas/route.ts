import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { rejectCrossOrigin } from '@/lib/security';
import crypto from 'node:crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function getUserId() {
  const sb = await createSupabaseServerClient();
  let id = '';
  try { id = (await sb.auth.getUser()).data.user?.id || ''; } catch {}
  if (!id) { try { id = (await sb.auth.getClaims()).data?.claims?.sub || ''; } catch {} }
  if (!id) throw new Error('Unauthorized');
  return id;
}

const clean = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const unauthorized = () => NextResponse.json({ error: 'Authentication required. Please sign in again.' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
const select = 'id,name,description,created_at,updated_at';

export async function GET() {
  try {
    const id = await getUserId();
    const { data, error } = await createSupabaseAdminClient().from('project_ideas').select(select).eq('owner_id', id).order('updated_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data || [], { headers: { 'Cache-Control': 'private,no-store' } });
  } catch (error) {
    console.error('[project-ideas] list failed', error);
    return unauthorized();
  }
}

export async function POST(request: NextRequest) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;
  try {
    const id = await getUserId();
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
    const now = new Date().toISOString();
    const payload = { id: crypto.randomUUID(), owner_id: id, name, description, created_at: now, updated_at: now };
    const { data, error } = await createSupabaseAdminClient().from('project_ideas').insert(payload).select(select).single();
    if (error) throw error;
    if (contentType.includes('json')) return NextResponse.json(data, { status: 201, headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.redirect(new URL('/projects?idea=created', request.url), 303);
  } catch (error) {
    console.error('[project-ideas] create failed', error);
    if (error instanceof Error && error.message === 'Unauthorized') return unauthorized();
    return NextResponse.json({ error: 'Idea could not be saved. Please try again.' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
