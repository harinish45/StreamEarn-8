import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { rejectCrossOrigin } from '@/lib/security';
import { cronAuthorized } from '@/lib/scheduler-auth';
import { projectArchiveSchema } from '@/lib/api-validation';
export const runtime='nodejs';

// Scheduler items are shared curated content, not per-user data, so this is a
// pipeline/admin operation — gated by the same secret as the ingest route, not
// merely by being logged in (any authenticated session could otherwise hide
// global content for every user with no ownership check).
export async function POST(request:NextRequest){
  const blocked=rejectCrossOrigin(request);if(blocked)return blocked;
  if(!cronAuthorized(request))return NextResponse.json({error:'Unauthorized'},{status:401,headers:{'Cache-Control':'no-store'}});
  try{
    const {id}=projectArchiveSchema.parse(await request.json());
    const sb=createSupabaseAdminClient();
    const {error}=await sb.from('scheduler_items').update({archived_at:new Date().toISOString()}).eq('id',id).is('archived_at',null);
    if(error)throw error;
    return NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}});
  }catch(error){
    if(error instanceof Error&&error.name==='ZodError')return NextResponse.json({error:'Invalid item id'},{status:400,headers:{'Cache-Control':'no-store'}});
    console.error('[scheduler] archive failed',error);
    return NextResponse.json({error:'Unable to archive scheduler item'},{status:500,headers:{'Cache-Control':'no-store'}});
  }
}
