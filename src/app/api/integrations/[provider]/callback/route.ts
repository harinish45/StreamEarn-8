import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import {
  decryptSecret,
  encryptSecret,
  integrationConfig,
  isIntegrationProvider,
  redirectUri,
  stateCookieName,
  type IntegrationProvider,
} from '@/lib/integrations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function exchangeGoogle(code: string, request: Request, clientId: string, clientSecret: string) {
  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri(request, 'google'),
    grant_type: 'authorization_code',
  });
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body,
    cache: 'no-store',
  });
  const token = await tokenResponse.json().catch(() => ({}));
  if (!tokenResponse.ok || !token.access_token) throw new Error(token.error_description || 'Google token exchange failed');

  const profileResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${token.access_token}` },
    cache: 'no-store',
  });
  const profile = await profileResponse.json().catch(() => ({}));
  if (!profileResponse.ok) throw new Error('Google account lookup failed');

  return {
    accessToken: token.access_token as string,
    refreshToken: typeof token.refresh_token === 'string' ? token.refresh_token : null,
    expiresAt: typeof token.expires_in === 'number' ? new Date(Date.now() + token.expires_in * 1000).toISOString() : null,
    scopes: typeof token.scope === 'string' ? token.scope.split(' ').filter(Boolean) : [],
    accountId: typeof profile.sub === 'string' ? profile.sub : null,
    accountEmail: typeof profile.email === 'string' ? profile.email : null,
    accountName: typeof profile.name === 'string' ? profile.name : null,
  };
}

async function exchangeGithub(code: string, request: Request, clientId: string, clientSecret: string) {
  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri(request, 'github'),
  });
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body,
    cache: 'no-store',
  });
  const token = await tokenResponse.json().catch(() => ({}));
  if (!tokenResponse.ok || !token.access_token) throw new Error(token.error_description || 'GitHub token exchange failed');

  const profileResponse = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${token.access_token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
    cache: 'no-store',
  });
  const profile = await profileResponse.json().catch(() => ({}));
  if (!profileResponse.ok) throw new Error('GitHub account lookup failed');

  let email: string | null = typeof profile.email === 'string' ? profile.email : null;
  if (!email) {
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${token.access_token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
      cache: 'no-store',
    });
    if (emailResponse.ok) {
      const emails = await emailResponse.json().catch(() => []);
      if (Array.isArray(emails)) email = emails.find((item: any) => item?.primary && item?.verified)?.email || emails.find((item: any) => item?.verified)?.email || null;
    }
  }

  return {
    accessToken: token.access_token as string,
    refreshToken: null,
    expiresAt: null,
    scopes: typeof token.scope === 'string' ? token.scope.split(',').map((x: string) => x.trim()).filter(Boolean) : ['read:user', 'user:email'],
    accountId: typeof profile.id === 'number' ? String(profile.id) : null,
    accountEmail: email,
    accountName: typeof profile.name === 'string' && profile.name ? profile.name : (typeof profile.login === 'string' ? profile.login : null),
  };
}

export async function GET(request: Request, context: { params: Promise<{ provider: string }> }) {
  const { provider: rawProvider } = await context.params;
  if (!isIntegrationProvider(rawProvider)) return NextResponse.redirect(new URL('/settings?integration=unknown&status=error', request.url));

  const provider = rawProvider as IntegrationProvider;
  const url = new URL(request.url);
  const code = url.searchParams.get('code') || '';
  const state = url.searchParams.get('state') || '';
  const expectedState = request.headers.get('cookie')?.match(new RegExp(`(?:^|; )${stateCookieName(provider)}=([^;]*)`))?.[1] || '';

  const clearCookie = (response: NextResponse) => {
    response.cookies.set({ name: stateCookieName(provider), value: '', path: '/', maxAge: 0 });
    return response;
  };

  try {
    if (!code || !state || !expectedState || state !== expectedState) throw new Error('Invalid OAuth state');
    const sb = await createSupabaseServerClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return clearCookie(NextResponse.redirect(new URL('/login?next=/settings', request.url)));

    const config = integrationConfig(provider);
    if (!config.clientId || !config.clientSecret) throw new Error('Integration is not configured');

    const result = provider === 'google'
      ? await exchangeGoogle(code, request, config.clientId, config.clientSecret)
      : await exchangeGithub(code, request, config.clientId, config.clientSecret);

    const admin = createSupabaseAdminClient();
    const { error } = await admin.from('user_integrations').upsert({
      owner_id: user.id,
      provider,
      provider_account_id: result.accountId,
      account_email: result.accountEmail,
      account_name: result.accountName,
      access_token_encrypted: encryptSecret(result.accessToken),
      refresh_token_encrypted: encryptSecret(result.refreshToken),
      expires_at: result.expiresAt,
      scopes: result.scopes,
      metadata: {},
      updated_at: new Date().toISOString(),
    }, { onConflict: 'owner_id,provider' });
    if (error) throw error;

    return clearCookie(NextResponse.redirect(new URL(`/settings?integration=${provider}&status=connected`, request.url)));
  } catch (error) {
    console.error(`[integrations] ${provider} callback failed`, error);
    return clearCookie(NextResponse.redirect(new URL(`/settings?integration=${provider}&status=error`, request.url)));
  }
}
