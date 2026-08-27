import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { AUTH_COOKIE, verifySession } from '@/lib/auth';
import { rejectCrossOrigin } from '@/lib/security';
export const runtime='nodejs';
async function auth(){return verifySession((await cookies()).get(AUTH_COOKIE)?.value)}
export async function GET(_request:NextRequest,{params}:{params:Promise<{id:string}>}){if(!await auth())return NextResponse.json({error:'Unauthorized'},{status:401,headers:{'Cache-Control':'no-store'}});const {id}=await params;if(!/^[0-9a-f-]{36}$/i.test(id))return NextResponse.json({error:'Not found'},{status:404});try{const sb=await createSupabaseServerClient();const {data:{user}}=await sb.auth.getUser();if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});const {data,error}=await sb.from('projects').select('*').eq('id',id).eq('owner_id',user.id).maybeSingle();if(error)throw error;if(!data)return NextResponse.json({error:'Not found'},{status:404});return NextResponse.json(data,{headers:{'Cache-Control':'private,no-store'}})}catch{return NextResponse.json({error:'Unable to load project'},{status:500})}}
export async function DELETE(request:NextRequest,{params}:{params:Promise<{id:string}>}){const blocked=rejectCrossOrigin(request);if(blocked)return blocked;return NextResponse.json({error:'Permanent deletion is disabled. Archive the project instead.'},{status:405,headers:{'Allow':'GET','Cache-Control':'no-store'}})}
