import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });
  const path = request.nextUrl.pathname;
  const publicPath = path === '/login' || path.startsWith('/_next/') || path === '/favicon.ico';
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    if (publicPath) return security(response, request);
    return NextResponse.json({ error: 'Authentication service unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }

  let supabase = createServerClient(url, key, {
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

  const { data: { user } } = await supabase.auth.getUser();
  if (publicPath) return security(response, request);
  if (!user) {
    if (path.startsWith('/api/')) return NextResponse.json({ error: 'Authentication required' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
    const redirect = request.nextUrl.clone(); redirect.pathname = '/login'; redirect.searchParams.set('next', path); return NextResponse.redirect(redirect);
  }
  return security(response, request);
}

function security(response: NextResponse, request: NextRequest) {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  if (request.nextUrl.protocol === 'https:') response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  return response;
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
