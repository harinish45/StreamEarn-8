import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { rejectCrossOrigin } from '@/lib/security';

export const runtime='nodejs';
export const dynamic='force-dynamic';

const edgeUrl=()=>`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/project-store`;

async function token(){
  const sb=await createSupabaseServerClient();
  const session=(await sb.auth.getSession()).data.session;
  if(!session?.access_token)throw new Error('Unauthorized');
  return session.access_token;
}
async function call(action:string,payload:Record<string,unknown>={}){
  const accessToken=await token();
  const r=await fetch(edgeUrl(),{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json','Authorization':`Bearer ${accessToken}`},body:JSON.stringify({action,...payload})});
  const d=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(d?.error||`Idea operation failed (${r.status})`);
  return d;
}
const denied=()=>NextResponse.json({error:'Authentication required. Please sign in again.'},{status:401,headers:{'Cache-Control':'no-store'}});

export async function GET(){try{return NextResponse.json(await call('idea-list'),{headers:{'Cache-Control':'private,no-store'}})}catch(error){console.error('[project-ideas] list failed',error);return denied()}}

export async function POST(request:NextRequest){
  const blocked=rejectCrossOrigin(request);if(blocked)return blocked;
  try{
    const type=(request.headers.get('content-type')||'').toLowerCase();let name='',description='';
    if(type.includes('json')){const b=await request.json();name=String(b?.name||'').trim().slice(0,160);description=String(b?.description||'').trim().slice(0,2000)}
    else {const f=await request.formData();name=String(f.get('name')||'').trim().slice(0,160);description=String(f.get('description')||'').trim().slice(0,2000)}
    if(!name)return NextResponse.json({error:'Idea name is required.'},{status:400});
    const data=await call('idea-create',{name,description});
    if(type.includes('json'))return NextResponse.json(data,{status:201,headers:{'Cache-Control':'no-store'}});
    return NextResponse.redirect(new URL('/projects?idea=created',request.url),303);
  }catch(error){console.error('[project-ideas] create failed',error);if(error instanceof Error&&error.message==='Unauthorized')return denied();return NextResponse.json({error:error instanceof Error?error.message:'Idea could not be saved.'},{status:500,headers:{'Cache-Control':'no-store'}})}
}
