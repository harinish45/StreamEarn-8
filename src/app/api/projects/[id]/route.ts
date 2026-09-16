import { NextRequest, NextResponse } from 'next/server';
import { rejectCrossOrigin } from '@/lib/security';
import { deleteProject, updateProject } from '@/lib/project-store';
import { projectUpdateSchema } from '@/lib/api-validation';

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
  try{
    const patch=projectUpdateSchema.parse(await request.json());
    return NextResponse.json(await updateProject(id,patch),{headers:{'Cache-Control':'no-store'}});
  }catch(error){
    if(error instanceof Error&&error.name==='ZodError')return NextResponse.json({error:'Invalid project data.'},{status:400,headers:{'Cache-Control':'no-store'}});
    console.error('[projects] update failed',error);
    return NextResponse.json({error:'Unable to update project.'},{status:500,headers:{'Cache-Control':'no-store'}});
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
    return NextResponse.json({error:'Unable to delete project.'},{status:500,headers:{'Cache-Control':'no-store'}});
  }
}
