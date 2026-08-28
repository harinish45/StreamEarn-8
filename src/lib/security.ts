import { NextRequest, NextResponse } from 'next/server';

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const MAX_BUCKETS = 5000;

export function sameOrigin(request: NextRequest) {
  const target = new URL(request.url).origin;
  const origin = request.headers.get('origin');
  if (origin) { try { return new URL(origin).origin === target; } catch { return false; } }
  const referer = request.headers.get('referer');
  if (referer) { try { return new URL(referer).origin === target; } catch { return false; } }
  return request.headers.get('sec-fetch-site') === 'same-origin';
}

export function rejectCrossOrigin(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: { 'Cache-Control': 'no-store' } });
  return null;
}

export function rateLimit(request: NextRequest, limit = 120) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const real = request.headers.get('x-real-ip')?.trim();
  const ip = forwarded || real || 'unknown';
  const key = `${ip}:${request.nextUrl.pathname}`;
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) for (const [k, v] of buckets) { if (v.resetAt <= now) buckets.delete(k); if (buckets.size < MAX_BUCKETS) break; }
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
  try { const url = new URL(candidate); return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : ''; } catch { return ''; }
}

export function noStore(response: NextResponse) {
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  return response;
}
