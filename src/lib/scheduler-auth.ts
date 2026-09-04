import { NextRequest } from 'next/server';
import crypto from 'node:crypto';

// Only import this from nodejs-runtime routes. Never import it from src/middleware.ts
// (or anything middleware imports) — that runs on the Edge runtime and cannot bundle
// the `node:crypto` built-in.
export function cronAuthorized(request: NextRequest) {
  const expected = process.env.SCHEDULER_CRON_SECRET || '';
  const supplied = request.headers.get('x-scheduler-secret') || '';
  if (!expected || !supplied) return false;
  const expectedBytes = Buffer.from(expected, 'utf8');
  const suppliedBytes = Buffer.from(supplied, 'utf8');
  if (expectedBytes.length !== suppliedBytes.length) return false;
  return crypto.timingSafeEqual(suppliedBytes, expectedBytes);
}
