import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { rejectCrossOrigin } from '@/lib/security';
export const runtime='nodejs';
async function requireUser(){const sb=await createSupabaseServerClient();const {data:{user}}=await sb.auth.getUser();return user?{sb,user}:null}
export async function GET(request:NextRequest){
  const projectId=new URL(request.url).searchParams.get('projectId')||'';
  if(!/^[0-9a-f-]{36}$/i.test(projectId))return NextResponse.json({error:'Invalid project id'},{status:400});
  const auth=await requireUser();if(!auth)return NextResponse.json({error:'Unauthorized'},{status:401});
  try{const {sb,user}=auth;const {data,error}=await sb.from('project_people').select('*').eq('project_id',projectId).eq('owner_id',user.id).order('created_at');if(error)throw error;return NextResponse.json(data||[],{headers:{'Cache-Control':'private,no-store'}})}catch{return NextResponse.json({error:'Unable to load collaborators'},{status:500})}
}
export async function POST(request:NextRequest){
  const blocked=rejectCrossOrigin(request);if(blocked)return blocked;
  const auth=await requireUser();if(!auth)return NextResponse.json({error:'Unauthorized'},{status:401});
  try{
    const {sb,user}=auth;
    const body=await request.json();
    const projectId=typeof body?.projectId==='string'?body.projectId:'';
    const name=typeof body?.name==='string'?body.name.trim().slice(0,160):'';
    if(!/^[0-9a-f-]{36}$/i.test(projectId)||!name)return NextResponse.json({error:'Invalid collaborator'},{status:400});
    const {data:p}=await sb.from('projects').select('id').eq('id',projectId).eq('owner_id',user.id).maybeSingle();
    if(!p)return NextResponse.json({error:'Not found'},{status:404});
    const {data,error}=await sb.from('project_people').insert({project_id:projectId,owner_id:user.id,name,role:typeof body.role==='string'?body.role.trim().slice(0,160):'',organization:typeof body.organization==='string'?body.organization.trim().slice(0,160):'',notes:typeof body.notes==='string'?body.notes.trim().slice(0,2000):''}).select('*').single();
    if(error)throw error;
    return NextResponse.json(data,{status:201,headers:{'Cache-Control':'no-store'}});
  }catch{return NextResponse.json({error:'Unable to add collaborator'},{status:500})}
}
