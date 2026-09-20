import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { rejectCrossOrigin } from '@/lib/security';
import { isIntegrationProvider } from '@/lib/integrations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest, context: { params: Promise<{ provider: string }> }) {
  const denied = rejectCrossOrigin(request);
  if (denied) return denied;

  const { provider } = await context.params;
  if (!isIntegrationProvider(provider)) return NextResponse.json({ error: 'Unknown integration' }, { status: 404 });

  try {
    const sb = await createSupabaseServerClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { error } = await sb.from('user_integrations').delete().eq('owner_id', user.id).eq('provider', provider);
    if (error) throw error;
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[integrations] disconnect failed', error);
    return NextResponse.json({ error: 'Unable to disconnect integration' }, { status: 500 });
  }
}
