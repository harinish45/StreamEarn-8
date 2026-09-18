import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { rejectCrossOrigin } from '@/lib/security';
import { cronAuthorized } from '@/lib/scheduler-auth';
import { schedulerArchiveSchema } from '@/lib/api-validation';

export const runtime='nodejs';

export async function POST(request:NextRequest){
  const blocked=rejectCrossOrigin(request);if(blocked)return blocked;
  const cron=cronAuthorized(request);
  try{
    let userId:string|null=null;
    if(!cron){
      const sb=await createSupabaseServerClient();
      const {data:{user}}=await sb.auth.getUser();
      if(!user)return NextResponse.json({error:'Unauthorized'},{status:401,headers:{'Cache-Control':'no-store'}});
      userId=user.id;
    }

    const parsed=schedulerArchiveSchema.parse(await request.json());
    const ids='ids' in parsed?parsed.ids:[parsed.id];
    const sb=createSupabaseAdminClient();
    let query=sb.from('scheduler_items').update(
      userId ? {archived_at:new Date().toISOString(),archived_by:userId} : {archived_at:new Date().toISOString()}
    ).in('id',ids).is('archived_at',null);
    const {error}=await query;
    if(error)throw error;
    return NextResponse.json({ok:true,archived:ids.length},{headers:{'Cache-Control':'no-store'}});
  }catch(error){
    if(error instanceof Error&&error.name==='ZodError')return NextResponse.json({error:'Invalid scheduler item selection'},{status:400,headers:{'Cache-Control':'no-store'}});
    console.error('[scheduler] archive failed',error);
    return NextResponse.json({error:'Unable to archive scheduler items'},{status:500,headers:{'Cache-Control':'no-store'}});
  }
}
