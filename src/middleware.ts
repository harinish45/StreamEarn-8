import { NextRequest, NextResponse } from 'next/server';

const COOKIE = 'streamearn_session';
const encoder = new TextEncoder();

function base64url(bytes: ArrayBuffer | Uint8Array) { const b = new Uint8Array(bytes); let s=''; for (const x of b) s += String.fromCharCode(x); return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); }
function fromBase64url(value: string) { const pad='='.repeat((4-value.length%4)%4); const bin=atob(value.replace(/-/g,'+').replace(/_/g,'/')+pad); return Uint8Array.from(bin,c=>c.charCodeAt(0)); }
async function validSession(token: string | undefined) {
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret || secret.length < 32) return false;
  const parts=token.split('.'); if(parts.length!==3) return false;
  const [username, exp, sig]=parts;
  if(!username || !/^\d+$/.test(exp) || Number(exp) < Math.floor(Date.now()/1000)) return false;
  const key=await crypto.subtle.importKey('raw', encoder.encode(secret), {name:'HMAC',hash:'SHA-256'}, false, ['verify']);
  return crypto.subtle.verify('HMAC', key, fromBase64url(sig), encoder.encode(`${username}.${exp}`));
}

export async function middleware(request: NextRequest) {
  const path=request.nextUrl.pathname;
  if(path === '/login' || path.startsWith('/api/auth/') || path.startsWith('/_next/') || path === '/favicon.ico') return security(request, false);
  if(!(await validSession(request.cookies.get(COOKIE)?.value))) {
    if(path.startsWith('/api/')) return new NextResponse(JSON.stringify({error:'Authentication required'}), {status:401,headers:{'Content-Type':'application/json', 'Cache-Control':'no-store'}});
    const url=request.nextUrl.clone(); url.pathname='/login'; url.searchParams.set('next',path); return NextResponse.redirect(url);
  }
  return security(request, false);
}

function security(request: NextRequest, _: boolean) {
  const response=NextResponse.next();
  response.headers.set('X-Frame-Options','DENY');
  response.headers.set('X-Content-Type-Options','nosniff');
  response.headers.set('Referrer-Policy','strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy','camera=(), microphone=(), geolocation=(), payment=()');
  response.headers.set('Cross-Origin-Opener-Policy','same-origin');
  response.headers.set('Cross-Origin-Resource-Policy','same-origin');
  response.headers.set('X-DNS-Prefetch-Control','off');
  if(request.nextUrl.protocol === 'https:') response.headers.set('Strict-Transport-Security','max-age=31536000; includeSubDomains');
  return response;
}

export const config={matcher:['/((?!_next/static|_next/image|favicon.ico).*)']};
