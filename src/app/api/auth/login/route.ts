import { NextRequest, NextResponse } from 'next/server';
import { createSession, getUsername, sessionCookie, verifyPassword } from '@/lib/auth';
import { rejectCrossOrigin, noStore } from '@/lib/security';
export const runtime='nodejs';
export async function POST(request:NextRequest){
 const blocked=rejectCrossOrigin(request); if(blocked)return blocked;
 try{
  const ct=request.headers.get('content-type')||''; if(!ct.toLowerCase().startsWith('application/json'))return noStore(NextResponse.json({error:'Invalid request'},{status:400}));
  const len=Number(request.headers.get('content-length')||'0'); if(!Number.isFinite(len)||len>16*1024)return noStore(NextResponse.json({error:'Invalid request'},{status:400}));
  const body=await request.json(); if(!body||typeof body!=='object'||Array.isArray(body))return noStore(NextResponse.json({error:'Invalid request'},{status:400}));
  const username=typeof body.username==='string'?body.username.trim():''; const password=typeof body.password==='string'?body.password:'';
  if(!username||!password||username.length>100||password.length>256||username!==getUsername()||!verifyPassword(password))return noStore(NextResponse.json({error:'Invalid username or password'},{status:401}));
  const response=noStore(NextResponse.json({ok:true})); response.headers.set('Set-Cookie',sessionCookie(createSession(username))); return response;
 }catch{return noStore(NextResponse.json({error:'Invalid request'},{status:400}));}
}
