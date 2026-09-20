import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { integrationConfig, isIntegrationProvider, randomState, redirectUri, stateCookieName, type IntegrationProvider } from '@/lib/integrations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request, context: { params: Promise<{ provider: string }> }) {
  const { provider: rawProvider } = await context.params;
  if (!isIntegrationProvider(rawProvider)) return NextResponse.json({ error: 'Unknown integration' }, { status: 404 });

  const provider = rawProvider as IntegrationProvider;
  try {
    const sb = await createSupabaseServerClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return NextResponse.redirect(new URL('/login?next=/settings', request.url));

    const config = integrationConfig(provider);
    if (!config.clientId || !config.clientSecret) {
      return NextResponse.redirect(new URL(`/settings?integration=${provider}&status=not-configured`, request.url));
    }

    const state = randomState();
    const callback = redirectUri(request, provider);
    const authUrl = provider === 'google'
      ? new URL('https://accounts.google.com/o/oauth2/v2/auth')
      : new URL('https://github.com/login/oauth/authorize');

    authUrl.searchParams.set('client_id', config.clientId);
    authUrl.searchParams.set('redirect_uri', callback);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('state', state);

    if (provider === 'google') {
      authUrl.searchParams.set('scope', 'openid email profile https://www.googleapis.com/auth/calendar.readonly');
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');
    } else {
      authUrl.searchParams.set('scope', 'read:user user:email');
    }

    const response = NextResponse.redirect(authUrl);
    response.cookies.set({
      name: stateCookieName(provider),
      value: state,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 600,
    });
    return response;
  } catch (error) {
    console.error('[integrations] oauth start failed', error);
    return NextResponse.redirect(new URL(`/settings?integration=${provider}&status=error`, request.url));
  }
}
