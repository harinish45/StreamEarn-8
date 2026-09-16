import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { addProject, listProjects, type Project } from '@/lib/project-store';
import { rejectCrossOrigin, safeHttpUrl } from '@/lib/security';
import { projectCreateSchema } from '@/lib/api-validation';

export const runtime='nodejs';
export const dynamic='force-dynamic';
const json=(body:unknown,status=200)=>NextResponse.json(body,{status,headers:{'Cache-Control':'no-store'}});

async function parseBody(request:NextRequest) {
  const type=(request.headers.get('content-type')||'').toLowerCase();
  if(type.includes('application/json')){
    const parsed=await request.json();
    if(!parsed||typeof parsed!=='object'||Array.isArray(parsed)) throw new Error('Invalid request.');
    return parsed;
  }
  if(type.includes('multipart/form-data')||type.includes('application/x-www-form-urlencoded')) return Object.fromEntries((await request.formData()).entries());
  throw new Error('Invalid request format.');
}

export async function GET(){
  try{return NextResponse.json(await listProjects(),{headers:{'Cache-Control':'private,no-store'}})}
  catch(error){console.error('[projects] list failed',error);return json({error:'Unable to load projects.'},500)}
}

export async function POST(request:NextRequest){
  const blocked=rejectCrossOrigin(request);if(blocked)return blocked;
  try{
    const raw=await parseBody(request);
    const body=projectCreateSchema.parse({
      ...raw,
      people:Array.isArray((raw as Record<string,unknown>).people)?(raw as Record<string,unknown>).people:typeof (raw as Record<string,unknown>).people==='string'?String((raw as Record<string,unknown>).people).split(',').map(x=>x.trim()).filter(Boolean):[],
      techStack:Array.isArray((raw as Record<string,unknown>).techStack)?(raw as Record<string,unknown>).techStack:typeof (raw as Record<string,unknown>).techStack==='string'?String((raw as Record<string,unknown>).techStack).split(',').map(x=>x.trim()).filter(Boolean):[],
      blockers:Array.isArray((raw as Record<string,unknown>).blockers)?(raw as Record<string,unknown>).blockers:typeof (raw as Record<string,unknown>).blockers==='string'?String((raw as Record<string,unknown>).blockers).split(',').map(x=>x.trim()).filter(Boolean):[],
      notes:Array.isArray((raw as Record<string,unknown>).notes)?(raw as Record<string,unknown>).notes:typeof (raw as Record<string,unknown>).notes==='string'?[String((raw as Record<string,unknown>).notes)]:[],
      progress:typeof (raw as Record<string,unknown>).progress==='string'?Number((raw as Record<string,unknown>).progress):(raw as Record<string,unknown>).progress,
    });
    const now=new Date().toISOString();
    const project:Project={
      id:crypto.randomUUID(),name:body.name,description:body.description,people:body.people,organization:body.organization,role:body.role,
      priority:body.priority,status:body.status,progress:body.progress,startDate:body.startDate,targetDate:body.targetDate,phase:body.phase,techStack:body.techStack,
      repository:safeHttpUrl(body.repository,500),liveUrl:safeHttpUrl(body.liveUrl,500),nextAction:body.nextAction,blockers:body.blockers,notes:body.notes,
      createdAt:now,updatedAt:now,
    };
    return json(await addProject(project),201);
  }catch(error){
    if(error instanceof Error&&error.name==='ZodError')return json({error:'Invalid project data.'},400);
    if(error instanceof Error&&(error.message==='Invalid request.'||error.message==='Invalid request format.'))return json({error:error.message},400);
    console.error('[projects] create failed',error);return json({error:'Project could not be saved. Please try again.'},500);
  }
}
