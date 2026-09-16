import { NextRequest, NextResponse } from 'next/server';
import { archiveProject } from '@/lib/project-store';
import { rejectCrossOrigin } from '@/lib/security';
import { projectArchiveSchema } from '@/lib/api-validation';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function POST(request:NextRequest){
  const blocked=rejectCrossOrigin(request);if(blocked)return blocked;
  try{
    const body=await request.json();
    const {id}=projectArchiveSchema.parse(body);
    await archiveProject(id);
    return NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}});
  }catch(error){
    if(error instanceof Error&&error.name==='ZodError')return NextResponse.json({error:'Invalid project.'},{status:400,headers:{'Cache-Control':'no-store'}});
    console.error('[projects] archive failed',error);
    return NextResponse.json({error:'Unable to archive project.'},{status:500,headers:{'Cache-Control':'no-store'}});
  }
}
