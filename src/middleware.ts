import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, rejectCrossOrigin, rejectUnsupportedMethod } from '@/lib/security';

const API_METHODS = ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;
const SUPABASE_ORIGIN = 'https://xhmaqgyyajyxacbtdutz.supabase.co';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });
  const path = request.nextUrl.pathname;
  const isApi = path.startsWith('/api/');
  const publicPath = path === '/login' || path.startsWith('/_next/') || path === '/favicon.ico' || path === '/api/health';
  // Routes that authenticate themselves (a bearer token or shared secret checked inside the
  // route handler) instead of the cookie-based Supabase session set up below. Without this
  // exemption, any caller with no session cookie -- an MCP client, or the scheduler's own cron
  // job -- would be rejected by the generic `if (!userId)` check before ever reaching the
  // route's own check.
  const selfAuthenticated = path === '/api/mcp' || (path === '/api/scheduler' && request.method !== 'GET');

  if (isApi && path === '/api/health') {
    // Unauthenticated by design (uptime monitors need it), but still rate-limited
    // so it isn't a free, unthrottled target for probing/scanning.
    const limited = rateLimit(request, 120);
    if (limited) return security(limited, request);
  } else if (isApi) {
    const unsupported = rejectUnsupportedMethod(request, API_METHODS);
    if (unsupported) return security(unsupported, request);
    const limited = rateLimit(request, request.method === 'GET' ? 180 : 60);
    if (limited) return security(limited, request);
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      const blocked = rejectCrossOrigin(request);
      if (blocked) return security(blocked, request);
    }
  }

  if (selfAuthenticated) return security(response, request);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return publicPath ? security(response, request) : NextResponse.json({ error: 'Authentication service unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  let userId = '';
  try {
    const { data } = await supabase.auth.getClaims();
    userId = data?.claims?.sub || '';
  } catch {}
  if (!userId) {
    try {
      const { data } = await supabase.auth.getUser();
      userId = data.user?.id || '';
    } catch {}
  }

  if (publicPath) return security(response, request);
  if (!userId) {
    if (isApi) return security(NextResponse.json({ error: 'Authentication required' }, { status: 401, headers: { 'Cache-Control': 'no-store' } }), request);
    const redirect = request.nextUrl.clone();
    redirect.pathname = '/login';
    redirect.searchParams.set('next', path);
    return NextResponse.redirect(redirect);
  }

  // Two-factor is opt-in per user (enrolled from /settings). Only step up to /mfa when the
  // account actually has a verified TOTP factor; accounts without one are unaffected.
  // /mfa itself and sign-out must stay reachable so a stuck mid-verification session can
  // always finish or bail out instead of being stranded in a redirect loop.
  if (path !== '/mfa' && path !== '/api/auth/logout') {
    try {
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aal && aal.nextLevel === 'aal2' && aal.currentLevel !== aal.nextLevel) {
        if (isApi) return security(NextResponse.json({ error: 'Two-factor verification required' }, { status: 401, headers: { 'Cache-Control': 'no-store' } }), request);
        const redirect = request.nextUrl.clone();
        redirect.pathname = '/mfa';
        redirect.searchParams.set('next', path);
        return NextResponse.redirect(redirect);
      }
    } catch {
      // Fail open: this request already passed password auth above, so a transient error in
      // the assurance-level check should never lock the account owner out of their own app.
    }
  }
  return security(response, request);
}

function security(response: NextResponse, request: NextRequest) {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), serial=()');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  response.headers.set('X-Download-Options', 'noopen');
  response.headers.set('Origin-Agent-Cluster', '?1');
  response.headers.set('Content-Security-Policy', `default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; form-action 'self'; img-src 'self' data: blob: https://picsum.photos https://fastly.picsum.photos; font-src 'self' data: https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline' ${SUPABASE_ORIGIN}; connect-src 'self' ${SUPABASE_ORIGIN} wss://xhmaqgyyajyxacbtdutz.supabase.co; frame-src 'self' ${SUPABASE_ORIGIN}; upgrade-insecure-requests`);
  response.headers.set('Cache-Control', request.nextUrl.pathname.startsWith('/api/') ? 'private, no-store' : 'no-cache');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  if (request.nextUrl.protocol === 'https:') response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  return response;
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };