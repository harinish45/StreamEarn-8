import { NextRequest, NextResponse } from 'next/server';
import { archiveProject } from '@/lib/project-store';
import { rejectCrossOrigin } from '@/lib/security';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function POST(request:NextRequest){
  const blocked=rejectCrossOrigin(request);if(blocked)return blocked;
  try{
    const body=await request.json().catch(()=>null);const id=typeof body?.id==='string'?body.id.trim():'';
    if(!/^[0-9a-f-]{36}$/i.test(id))return NextResponse.json({error:'Invalid project.'},{status:400});
    await archiveProject(id);return NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}});
  }catch(error){console.error('[projects] archive failed',error);return NextResponse.json({error:error instanceof Error?error.message:'Unable to archive project.'},{status:500,headers:{'Cache-Control':'no-store'}})}
}
