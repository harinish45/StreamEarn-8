import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { rejectCrossOrigin } from '@/lib/security';
import { projectTaskCreateSchema } from '@/lib/api-validation';
export const runtime='nodejs';
async function requireUser(){const sb=await createSupabaseServerClient();const {data:{user}}=await sb.auth.getUser();return user?{sb,user}:null}
export async function GET(request:NextRequest){
  const projectId=new URL(request.url).searchParams.get('projectId')||'';
  if(!/^[0-9a-f-]{36}$/i.test(projectId))return NextResponse.json({error:'Invalid project id'},{status:400});
  const auth=await requireUser();if(!auth)return NextResponse.json({error:'Unauthorized'},{status:401});
  try{const {sb,user}=auth;const {data,error}=await sb.from('project_tasks').select('*').eq('project_id',projectId).eq('owner_id',user.id).order('created_at',{ascending:true});if(error)throw error;return NextResponse.json(data||[],{headers:{'Cache-Control':'private,no-store'}})}catch{return NextResponse.json({error:'Unable to load tasks'},{status:500})}
}
export async function POST(request:NextRequest){
  const blocked=rejectCrossOrigin(request);if(blocked)return blocked;
  const auth=await requireUser();if(!auth)return NextResponse.json({error:'Unauthorized'},{status:401});
  try{
    const {sb,user}=auth;
    const body=await request.json().catch(()=>null);
    const parsed=projectTaskCreateSchema.safeParse(body);
    if(!parsed.success)return NextResponse.json({error:'Invalid task',issues:parsed.error.issues.map(issue=>issue.message)},{status:400});
    const {projectId,title,description,priority,status,dueDate}=parsed.data;
    const {data:p}=await sb.from('projects').select('id').eq('id',projectId).eq('owner_id',user.id).maybeSingle();
    if(!p)return NextResponse.json({error:'Not found'},{status:404});
    const {data,error}=await sb.from('project_tasks').insert({project_id:projectId,owner_id:user.id,title,description,priority,status,due_date:dueDate??null}).select('*').single();
    if(error)throw error;
    return NextResponse.json(data,{status:201,headers:{'Cache-Control':'no-store'}});
  }catch{return NextResponse.json({error:'Unable to create task'},{status:500})}
}
