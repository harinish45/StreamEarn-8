import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { rejectCrossOrigin } from '@/lib/security';
import { safeId } from '@/lib/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;
  const { id: rawId } = await params;
  const id = safeId(rawId);
  if (!id) return NextResponse.json({ error: 'Invalid token id.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  const sb = await createSupabaseServerClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  try {
    const admin = createSupabaseAdminClient();
    const { error } = await admin.from('api_tokens').delete().eq('id', id).eq('owner_id', user.id);
    if (error) throw error;
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[tokens] revoke failed', error);
    return NextResponse.json({ error: 'Unable to revoke token.' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
