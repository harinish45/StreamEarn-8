import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { rejectCrossOrigin } from '@/lib/security';
export const runtime='nodejs';
export async function POST(request:NextRequest){const blocked=rejectCrossOrigin(request);if(blocked)return blocked;try{const sb=await createSupabaseServerClient();await sb.auth.signOut();return NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}})}catch{return NextResponse.json({error:'Unable to sign out'},{status:500,headers:{'Cache-Control':'no-store'}})}}
