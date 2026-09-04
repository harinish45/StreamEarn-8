import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { rejectCrossOrigin } from '@/lib/security';
import { generateToken, hashToken } from '@/lib/mcp/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function requireUser() {
  const sb = await createSupabaseServerClient();
  const { data: { user } } = await sb.auth.getUser();
  return user;
}

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  try {
    const sb = createSupabaseAdminClient();
    const { data, error } = await sb.from('api_tokens').select('id,label,created_at,last_used_at').eq('owner_id', user.id).order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data || [], { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    // A missing table (migration not run yet) is the most likely cause here -- surface a clear message.
    console.error('[tokens] list failed', error);
    return NextResponse.json({ error: 'Unable to load tokens. Has the api_tokens migration been run in Supabase yet?' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}

export async function POST(request: NextRequest) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  try {
    const body = await request.json().catch(() => ({}));
    const label = typeof body?.label === 'string' && body.label.trim() ? body.label.trim().slice(0, 120) : 'API token';
    const token = generateToken();
    const sb = createSupabaseAdminClient();
    const { data, error } = await sb.from('api_tokens').insert({ owner_id: user.id, label, token_hash: hashToken(token) }).select('id,label,created_at').single();
    if (error) throw error;
    // The plaintext token is returned exactly once and never stored -- only its hash is kept.
    return NextResponse.json({ ...data, token }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[tokens] create failed', error);
    return NextResponse.json({ error: 'Unable to create token. Has the api_tokens migration been run in Supabase yet?' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
