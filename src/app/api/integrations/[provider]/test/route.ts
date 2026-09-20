import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { rejectCrossOrigin } from '@/lib/security';
import { decryptSecret, encryptSecret, isIntegrationProvider, integrationConfig } from '@/lib/integrations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function refreshGoogleAccessToken(refreshToken: string, clientId: string, clientSecret: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
    cache: 'no-store',
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token) throw new Error(payload.error_description || 'Google token refresh failed');
  return {
    accessToken: payload.access_token as string,
    expiresAt: typeof payload.expires_in === 'number' ? new Date(Date.now() + payload.expires_in * 1000).toISOString() : null,
  };
}

export async function POST(request: NextRequest, context: { params: Promise<{ provider: string }> }) {
  const denied = rejectCrossOrigin(request);
  if (denied) return denied;

  const { provider } = await context.params;
  if (!isIntegrationProvider(provider)) return NextResponse.json({ error: 'Unknown integration' }, { status: 404 });

  try {
    const sb = await createSupabaseServerClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: row, error } = await sb
      .from('user_integrations')
      .select('*')
      .eq('owner_id', user.id)
      .eq('provider', provider)
      .maybeSingle();
    if (error) throw error;
    if (!row) return NextResponse.json({ error: 'Integration is not connected' }, { status: 404 });

    let accessToken = decryptSecret(row.access_token_encrypted);
    let expiresAt = row.expires_at as string | null;

    if (provider === 'google' && expiresAt && new Date(expiresAt).getTime() < Date.now() + 60_000) {
      const refreshToken = decryptSecret(row.refresh_token_encrypted);
      const config = integrationConfig('google');
      if (!refreshToken || !config.clientId || !config.clientSecret) throw new Error('Google refresh configuration is unavailable');
      const refreshed = await refreshGoogleAccessToken(refreshToken, config.clientId, config.clientSecret);
      accessToken = refreshed.accessToken;
      expiresAt = refreshed.expiresAt;
      const admin = createSupabaseAdminClient();
      await admin.from('user_integrations').update({
        access_token_encrypted: encryptSecret(accessToken),
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      }).eq('owner_id', user.id).eq('provider', provider);
    }

    let summary: Record<string, unknown>;
    if (provider === 'google') {
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=5&singleEvents=true&orderBy=startTime&timeMin=${encodeURIComponent(new Date().toISOString())}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error?.message || 'Google Calendar request failed');
      summary = {
        message: 'Google Calendar connection verified.',
        upcomingEvents: Array.isArray(payload.items) ? payload.items.map((item: any) => ({
          id: item?.id || '',
          title: item?.summary || '(untitled)',
          start: item?.start?.dateTime || item?.start?.date || null,
        })) : [],
      };
    } else {
      const response = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
        cache: 'no-store',
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.message || 'GitHub API request failed');
      summary = {
        message: 'GitHub connection verified.',
        login: payload?.login || null,
        publicRepos: typeof payload?.public_repos === 'number' ? payload.public_repos : null,
      };
    }

    const admin = createSupabaseAdminClient();
    await admin.from('user_integrations').update({
      last_synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('owner_id', user.id).eq('provider', provider);

    return NextResponse.json({ ok: true, provider, summary }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[integrations] test failed', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Integration test failed' }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
