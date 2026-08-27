import { NextRequest, NextResponse } from 'next/server';
import { archiveProject } from '@/lib/project-store';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { rejectCrossOrigin } from '@/lib/security';
export const runtime='nodejs';
export async function POST(request:NextRequest){const blocked=rejectCrossOrigin(request);if(blocked)return blocked;const sb=await createSupabaseServerClient();const {data:{user}}=await sb.auth.getUser();if(!user)return NextResponse.json({error:'Unauthorized'},{status:401,headers:{'Cache-Control':'no-store'}});if(!(request.headers.get('content-type')||'').toLowerCase().startsWith('application/json'))return NextResponse.json({error:'Invalid request'},{status:400});try{const body=await request.json();const id=typeof body?.id==='string'?body.id.trim():'';if(!/^[0-9a-f-]{20,80}$/i.test(id))return NextResponse.json({error:'Invalid project'},{status:400});await archiveProject(id);return NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}})}catch{return NextResponse.json({error:'Unable to archive project'},{status:404,headers:{'Cache-Control':'no-store'}})}}
