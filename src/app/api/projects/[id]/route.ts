import { NextRequest, NextResponse } from 'next/server';
import { rejectCrossOrigin } from '@/lib/security';
import { deleteProject, updateProject } from '@/lib/project-store';

export const runtime='nodejs';
export const dynamic='force-dynamic';

async function paramsId(params:Promise<{id:string}>){
  const {id}=await params;
  return /^[0-9a-f-]{36}$/i.test(id)?id:'';
}

export async function GET(_request:NextRequest,{params}:{params:Promise<{id:string}>}){
  const id=await paramsId(params);
  if(!id)return NextResponse.json({error:'Not found'},{status:404});
  try{
    const { listProjects }=await import('@/lib/project-store');
    const projects=await listProjects();
    const project=projects.find(p=>p.id===id);
    return project?NextResponse.json(project,{headers:{'Cache-Control':'private,no-store'}}):NextResponse.json({error:'Not found'},{status:404});
  }catch(error){
    console.error('[projects] get failed',error);
    return NextResponse.json({error:'Unable to load project.'},{status:500,headers:{'Cache-Control':'no-store'}});
  }
}

export async function PATCH(request:NextRequest,{params}:{params:Promise<{id:string}>}){
  const blocked=rejectCrossOrigin(request); if(blocked)return blocked;
  const id=await paramsId(params); if(!id)return NextResponse.json({error:'Invalid project.'},{status:400});
  const body=await request.json().catch(()=>null);
  if(!body||typeof body!=='object'||Array.isArray(body))return NextResponse.json({error:'Invalid request.'},{status:400});
  const source=body as Record<string,unknown>;
  const patch:Record<string,unknown>={};
  const statuses=['idea','planning','in-progress','blocked','testing','completed','archived'];
  const priorities=['P0','P1','P2','P3'];
  if(typeof source.name==='string'&&source.name.trim())patch.name=source.name.trim().slice(0,120);
  if(typeof source.description==='string')patch.description=source.description.trim().slice(0,2000);
  if(typeof source.status==='string'&&statuses.includes(source.status))patch.status=source.status;
  if(typeof source.priority==='string'&&priorities.includes(source.priority))patch.priority=source.priority;
  if(Number.isFinite(Number(source.progress)))patch.progress=Math.min(100,Math.max(0,Number(source.progress)));
  if(typeof source.nextAction==='string')patch.nextAction=source.nextAction.trim().slice(0,300);
  if(typeof source.phase==='string')patch.phase=source.phase.trim().slice(0,120);
  try{
    return NextResponse.json(await updateProject(id,patch),{headers:{'Cache-Control':'no-store'}});
  }catch(error){
    console.error('[projects] update failed',error);
    return NextResponse.json({error:error instanceof Error?error.message:'Unable to update project.'},{status:500,headers:{'Cache-Control':'no-store'}});
  }
}

export async function DELETE(request:NextRequest,{params}:{params:Promise<{id:string}>}){
  const blocked=rejectCrossOrigin(request); if(blocked)return blocked;
  const id=await paramsId(params); if(!id)return NextResponse.json({error:'Invalid project.'},{status:400});
  try{
    await deleteProject(id);
    return NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}});
  }catch(error){
    console.error('[projects] delete failed',error);
    return NextResponse.json({error:error instanceof Error?error.message:'Unable to delete project.'},{status:500,headers:{'Cache-Control':'no-store'}});
  }
}
