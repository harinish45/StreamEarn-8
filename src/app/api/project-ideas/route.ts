import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { rejectCrossOrigin } from '@/lib/security';

export const runtime='nodejs';
export const dynamic='force-dynamic';

const edgeUrl=()=>`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/project-store`;

async function call(action:string,payload:Record<string,unknown>={}){
  const sb=await createSupabaseServerClient();
  const {data:{session},error}=await sb.auth.getSession();
  if(error||!session?.access_token)throw new Error('Unauthorized');
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),15000);
  try{
    let response:Response;
    try{
      response=await fetch(edgeUrl(),{method:'POST',cache:'no-store',signal:controller.signal,headers:{'Content-Type':'application/json','Accept':'application/json','Authorization':`Bearer ${session.access_token}`},body:JSON.stringify({action,...payload})});
    }catch(error){
      if(error instanceof Error&&error.name==='AbortError')throw new Error('Idea storage timed out. Please try again.');
      throw new Error('Unable to reach idea storage. Please check your connection and try again.');
    }
    const data=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(data?.error||`Idea operation failed (${response.status})`);
    return data;
  }finally{clearTimeout(timeout)}
}

function fail(error:unknown){
  if(error instanceof Error&&error.message==='Unauthorized')return NextResponse.json({error:'Authentication required. Please sign in again.'},{status:401,headers:{'Cache-Control':'no-store'}});
  return NextResponse.json({error:error instanceof Error?error.message:'Idea operation failed. Please try again.'},{status:500,headers:{'Cache-Control':'no-store'}});
}

export async function GET(){try{return NextResponse.json(await call('idea-list'),{headers:{'Cache-Control':'private,no-store'}})}catch(error){console.error('[project-ideas] list failed',error);return fail(error)}}

export async function POST(request:NextRequest){
  const blocked=rejectCrossOrigin(request);if(blocked)return blocked;
  try{
    const type=(request.headers.get('content-type')||'').toLowerCase();let name='',description='';
    if(type.includes('json')){const b=await request.json();name=String(b?.name||'').trim().slice(0,160);description=String(b?.description||'').trim().slice(0,2000)}
    else if(type.includes('application/x-www-form-urlencoded')||type.includes('multipart/form-data')){const f=await request.formData();name=String(f.get('name')||'').trim().slice(0,160);description=String(f.get('description')||'').trim().slice(0,2000)}
    else return NextResponse.json({error:'Invalid request.'},{status:400,headers:{'Cache-Control':'no-store'}});
    if(!name)return NextResponse.json({error:'Idea name is required.'},{status:400,headers:{'Cache-Control':'no-store'}});
    const data=await call('idea-create',{name,description});
    if(type.includes('json'))return NextResponse.json(data,{status:201,headers:{'Cache-Control':'no-store'}});
    return NextResponse.redirect(new URL('/projects?idea=created',request.url),303);
  }catch(error){console.error('[project-ideas] create failed',error);if(error instanceof Error&&error.message==='Unauthorized')return fail(error);if((request.headers.get('accept')||'').includes('text/html'))return NextResponse.redirect(new URL('/projects?idea=failed',request.url),303);return fail(error)}
}
