import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { rejectCrossOrigin } from '@/lib/security';
export const runtime='nodejs';
async function requireUser(){const sb=await createSupabaseServerClient();const {data:{user}}=await sb.auth.getUser();return user?{sb,user}:null}
export async function GET(request:NextRequest){
  const projectId=new URL(request.url).searchParams.get('projectId')||'';
  if(!/^[0-9a-f-]{36}$/i.test(projectId))return NextResponse.json({error:'Invalid project id'},{status:400});
  const auth=await requireUser();if(!auth)return NextResponse.json({error:'Unauthorized'},{status:401});
  try{const {sb,user}=auth;const {data,error}=await sb.from('project_milestones').select('*').eq('project_id',projectId).eq('owner_id',user.id).order('target_date',{ascending:true,nullsFirst:false});if(error)throw error;return NextResponse.json(data||[],{headers:{'Cache-Control':'private,no-store'}})}catch{return NextResponse.json({error:'Unable to load milestones'},{status:500})}
}
export async function POST(request:NextRequest){
  const blocked=rejectCrossOrigin(request);if(blocked)return blocked;
  const auth=await requireUser();if(!auth)return NextResponse.json({error:'Unauthorized'},{status:401});
  try{
    const {sb,user}=auth;
    const body=await request.json();
    const projectId=typeof body?.projectId==='string'?body.projectId:'';
    const title=typeof body?.title==='string'?body.title.trim().slice(0,300):'';
    if(!/^[0-9a-f-]{36}$/i.test(projectId)||!title)return NextResponse.json({error:'Invalid milestone'},{status:400});
    const {data:p}=await sb.from('projects').select('id').eq('id',projectId).eq('owner_id',user.id).maybeSingle();
    if(!p)return NextResponse.json({error:'Not found'},{status:404});
    const status=['pending','in-progress','completed'].includes(body.status)?body.status:'pending';
    const {data,error}=await sb.from('project_milestones').insert({project_id:projectId,owner_id:user.id,title,status,target_date:typeof body.targetDate==='string'?body.targetDate:null}).select('*').single();
    if(error)throw error;
    return NextResponse.json(data,{status:201,headers:{'Cache-Control':'no-store'}});
  }catch{return NextResponse.json({error:'Unable to create milestone'},{status:500})}
}
