import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { INTEGRATION_PROVIDERS, type IntegrationProvider } from '@/lib/integrations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sb = await createSupabaseServerClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });

    const { data, error } = await sb
      .from('user_integrations')
      .select('provider,provider_account_id,account_email,account_name,scopes,last_synced_at,created_at,updated_at')
      .eq('owner_id', user.id);

    if (error) throw error;

    const configured = new Set((data || []).map((row) => row.provider));
    const integrations = (Object.keys(INTEGRATION_PROVIDERS) as IntegrationProvider[]).map((provider) => {
      const row = (data || []).find((item) => item.provider === provider);
      return {
        provider,
        ...INTEGRATION_PROVIDERS[provider],
        configured: configured.has(provider),
        account: row ? {
          id: row.provider_account_id,
          email: row.account_email,
          name: row.account_name,
          scopes: row.scopes || [],
          lastSyncedAt: row.last_synced_at,
          connectedAt: row.created_at,
          updatedAt: row.updated_at,
        } : null,
      };
    });

    return NextResponse.json(integrations, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('[integrations] list failed', error);
    return NextResponse.json({ error: 'Unable to load integrations' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
