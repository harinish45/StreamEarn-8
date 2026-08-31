import { NextRequest, NextResponse } from 'next/server';

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const MAX_BUCKETS = 5000;

function clientKey(request: NextRequest) {
  const real = request.headers.get('x-real-ip')?.trim();
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return real || forwarded || 'unknown';
}

export function sameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin')?.trim();
  const referer = request.headers.get('referer')?.trim();
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim();
  const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() || 'https';
  const host = forwardedHost || request.headers.get('host')?.trim();
  const publicOrigin = host ? `${forwardedProto}://${host}` : new URL(request.url).origin;

  if (origin) {
    try { return new URL(origin).origin === publicOrigin; } catch { return false; }
  }
  if (referer) {
    try { return new URL(referer).origin === publicOrigin; } catch { return false; }
  }
  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite === 'same-origin' || fetchSite === 'same-site') return true;
  return Boolean(host);
}

export function rejectCrossOrigin(request: NextRequest) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: { 'Cache-Control': 'no-store' } });
  }
  return null;
}

export function rejectUnsupportedMethod(request: NextRequest, allowed: readonly string[]) {
  if (!allowed.includes(request.method)) {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405, headers: { Allow: allowed.join(', '), 'Cache-Control': 'no-store' } },
    );
  }
  return null;
}

export function rateLimit(request: NextRequest, limit = 120) {
  const key = `${clientKey(request)}:${request.nextUrl.pathname}`;
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) {
      for (const [k, v] of buckets) {
        if (v.resetAt <= now) buckets.delete(k);
        if (buckets.size < MAX_BUCKETS) break;
      }
    }
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }
  current.count += 1;
  if (current.count > limit) {
    const retry = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'Cache-Control': 'no-store', 'Retry-After': String(retry) } });
  }
  return null;
}

export function safeHttpUrl(value: unknown, max = 500) {
  if (typeof value !== 'string' || !value.trim()) return '';
  const candidate = value.trim().slice(0, max);
  try {
    const url = new URL(candidate);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
    if (url.username || url.password) return '';
    return url.toString();
  } catch { return ''; }
}

export function safeId(value: unknown) {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value) ? value : '';
}

export function noStore(response: NextResponse) {
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  return response;
}
