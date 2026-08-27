import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

export const AUTH_COOKIE = 'streamearn_session';
const MAX_AGE = 60 * 60 * 24 * 7;

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error('AUTH_SECRET must be configured with at least 32 characters');
  return value;
}

function b64url(input: Buffer | string) {
  return Buffer.from(input).toString('base64url');
}

function sign(payload: string) {
  return b64url(createHmac('sha256', secret()).update(payload).digest());
}

export function verifyPassword(password: string) {
  const stored = process.env.AUTH_PASSWORD_HASH || '';
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [, n, r, p, salt64, hash64] = parts;
  try {
    const derived = scryptSync(password, Buffer.from(salt64, 'base64url'), Number(hash64 ? 64 : 32), { N: Number(n), r: Number(r), p: Number(p) });
    const expected = Buffer.from(hash64, 'base64url');
    return expected.length === derived.length && timingSafeEqual(expected, derived);
  } catch { return false; }
}

export function getUsername() { return process.env.AUTH_USERNAME || ''; }

export function createSession(username: string) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `${username}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySession(token: string | undefined) {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [username, exp, signature] = parts;
  if (!username || !/^\d+$/.test(exp) || Number(exp) < Math.floor(Date.now() / 1000)) return false;
  const payload = `${username}.${exp}`;
  const expected = sign(payload);
  try { return timingSafeEqual(Buffer.from(signature), Buffer.from(expected)); } catch { return false; }
}

export function sessionCookie(token: string) {
  return `${AUTH_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`;
}

export function clearSessionCookie() {
  return `${AUTH_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export function randomAuthSecret() { return randomBytes(48).toString('base64url'); }
