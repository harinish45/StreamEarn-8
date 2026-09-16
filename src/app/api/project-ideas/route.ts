import { NextRequest, NextResponse } from 'next/server';
import { rejectCrossOrigin } from '@/lib/security';
import { addIdea, listIdeas } from '@/lib/project-store';
import { projectIdeaCreateSchema } from '@/lib/api-validation';

export const runtime='nodejs';
export const dynamic='force-dynamic';

export async function GET(){
  try{return NextResponse.json(await listIdeas(),{headers:{'Cache-Control':'private,no-store'}})}
  catch(error){
    if(error instanceof Error&&error.message==='Unauthorized')return NextResponse.json({error:'Authentication required. Please sign in again.'},{status:401,headers:{'Cache-Control':'no-store'}});
    console.error('[project-ideas] list failed',error);
    return NextResponse.json({error:'Unable to load project ideas.'},{status:500,headers:{'Cache-Control':'no-store'}});
  }
}

export async function POST(request:NextRequest){
  const blocked=rejectCrossOrigin(request);if(blocked)return blocked;
  try{
    const type=(request.headers.get('content-type')||'').toLowerCase();
    let raw:unknown;
    if(type.includes('json')) raw=await request.json();
    else if(type.includes('application/x-www-form-urlencoded')||type.includes('multipart/form-data')) raw=Object.fromEntries((await request.formData()).entries());
    else return NextResponse.json({error:'Invalid request.'},{status:415,headers:{'Cache-Control':'no-store'}});
    const body=projectIdeaCreateSchema.parse(raw);
    const data=await addIdea(body.name,body.description);
    if(type.includes('json'))return NextResponse.json(data,{status:201,headers:{'Cache-Control':'no-store'}});
    return NextResponse.redirect(new URL('/projects?idea=created',request.url),303);
  }catch(error){
    if(error instanceof Error&&error.name==='ZodError')return NextResponse.json({error:'Invalid idea data.'},{status:400,headers:{'Cache-Control':'no-store'}});
    if(error instanceof Error&&error.message==='Unauthorized')return NextResponse.json({error:'Authentication required. Please sign in again.'},{status:401,headers:{'Cache-Control':'no-store'}});
    console.error('[project-ideas] create failed',error);
    if((request.headers.get('accept')||'').includes('text/html'))return NextResponse.redirect(new URL('/projects?idea=failed',request.url),303);
    return NextResponse.json({error:'Unable to save project idea.'},{status:500,headers:{'Cache-Control':'no-store'}});
  }
}
