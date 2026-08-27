import { NextRequest, NextResponse } from 'next/server';

export function sameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try { return new URL(origin).origin === new URL(request.url).origin; } catch { return false; }
}

export function rejectCrossOrigin(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: { 'Cache-Control': 'no-store' } });
  return null;
}

export function noStore(response: NextResponse) {
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  return response;
}
