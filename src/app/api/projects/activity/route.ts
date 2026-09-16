import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { rejectCrossOrigin } from '@/lib/security';
import { projectActivitySchema } from '@/lib/api-validation';
export const runtime='nodejs';

export async function POST(request:NextRequest){
  const blocked=rejectCrossOrigin(request);if(blocked)return blocked;
  try{
    const body=projectActivitySchema.parse(await request.json());
    const sb=await createSupabaseServerClient();
    const {data:{user}}=await sb.auth.getUser();
    if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});
    const {data:p}=await sb.from('projects').select('id').eq('id',body.projectId).eq('owner_id',user.id).maybeSingle();
    if(!p)return NextResponse.json({error:'Not found'},{status:404});
    const {error}=await sb.from('project_activity').insert({project_id:body.projectId,owner_id:user.id,action:body.action,details:body.details});
    if(error)throw error;
    return NextResponse.json({ok:true},{status:201,headers:{'Cache-Control':'no-store'}});
  }catch(error){
    if(error instanceof Error&&error.name==='ZodError')return NextResponse.json({error:'Invalid activity'},{status:400});
    console.error('[projects] activity failed',error);
    return NextResponse.json({error:'Unable to record activity'},{status:500,headers:{'Cache-Control':'no-store'}});
  }
}
