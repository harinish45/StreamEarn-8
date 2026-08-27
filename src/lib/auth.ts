import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

export const AUTH_COOKIE = 'streamearn_session';
export const MAX_AGE = 60 * 60 * 24 * 7;
const MAX_USERNAME = 100;
const MAX_PASSWORD = 256;

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error('AUTH_SECRET must be configured with at least 32 characters');
  return value;
}

function b64url(input: Buffer | string) { return Buffer.from(input).toString('base64url'); }
function sign(payload: string) { return b64url(createHmac('sha256', secret()).update(payload).digest()); }

export function verifyPassword(password: string) {
  const stored = process.env.AUTH_PASSWORD_HASH || '';
  if (password.length > MAX_PASSWORD) return false;
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [, nRaw, rRaw, pRaw, salt64, hash64] = parts;
  const N = Number(nRaw), r = Number(rRaw), p = Number(pRaw);
  if (!Number.isInteger(N) || !Number.isInteger(r) || !Number.isInteger(p) || N < 16384 || N > 1048576 || r < 1 || r > 32 || p < 1 || p > 16) return false;
  try {
    const expected = Buffer.from(hash64, 'base64url');
    if (expected.length < 32 || expected.length > 128) return false;
    const derived = scryptSync(password, Buffer.from(salt64, 'base64url'), expected.length, { N, r, p, maxmem: 128 * 1024 * 1024 });
    return timingSafeEqual(expected, derived);
  } catch { return false; }
}

export function getUsername() {
  const value = process.env.AUTH_USERNAME || '';
  return value.length <= MAX_USERNAME ? value : '';
}

export function createSession(username: string) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `${username}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySession(token: string | undefined) {
  if (!token || token.length > 512) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [username, exp, signature] = parts;
  if (!username || username.length > MAX_USERNAME || !/^\d+$/.test(exp)) return false;
  const expiry = Number(exp);
  if (!Number.isSafeInteger(expiry) || expiry < Math.floor(Date.now() / 1000)) return false;
  try {
    const expected = sign(`${username}.${exp}`);
    const actual = Buffer.from(signature, 'base64url');
    const expectedBuffer = Buffer.from(expected, 'base64url');
    return actual.length === expectedBuffer.length && timingSafeEqual(actual, expectedBuffer) && username === getUsername();
  } catch { return false; }
}

export function sessionCookie(token: string) {
  return `${AUTH_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`;
}

export function clearSessionCookie() { return `${AUTH_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`; }
export function randomAuthSecret() { return randomBytes(48).toString('base64url'); }
