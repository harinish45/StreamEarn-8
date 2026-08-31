import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { addProject, listProjects, type Project } from '@/lib/project-store';
import { rejectCrossOrigin, safeHttpUrl } from '@/lib/security';

export const runtime='nodejs';
export const dynamic='force-dynamic';
const json=(body:unknown,status=200)=>NextResponse.json(body,{status,headers:{'Cache-Control':'no-store'}});
const clean=(v:unknown,max=500)=>typeof v==='string'?v.trim().slice(0,max):'';
const list=(v:unknown,maxItems=20,maxLength=120)=>Array.isArray(v)?v.filter((x):x is string=>typeof x==='string').slice(0,maxItems).map(x=>x.trim().slice(0,maxLength)).filter(Boolean):typeof v==='string'?v.split(',').map(x=>x.trim().slice(0,maxLength)).filter(Boolean).slice(0,maxItems):[];

export async function GET(){
  try{return NextResponse.json(await listProjects(),{headers:{'Cache-Control':'private,no-store'}})}
  catch(error){console.error('[projects] list failed',error);const message=error instanceof Error?error.message:'Unable to load projects.';return json({error:message},500)}
}

export async function POST(request:NextRequest){
  const blocked=rejectCrossOrigin(request);if(blocked)return blocked;
  try{
    const type=(request.headers.get('content-type')||'').toLowerCase();let body:Record<string,unknown>={};
    if(type.includes('application/json')){const parsed=await request.json();if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))return json({error:'Invalid request.'},400);body=parsed as Record<string,unknown>}
    else if(type.includes('multipart/form-data')||type.includes('application/x-www-form-urlencoded'))body=Object.fromEntries((await request.formData()).entries());
    else return json({error:'Invalid request format.'},415);
    const name=clean(body.name,120);if(!name)return json({error:'Project name is required.'},400);
    const now=new Date().toISOString();
    const project:Project={
      id:crypto.randomUUID(),name,description:clean(body.description),people:list(body.people),organization:clean(body.organization,160),role:clean(body.role,120),
      priority:['P0','P1','P2','P3'].includes(String(body.priority))?String(body.priority) as Project['priority']:'P2',
      status:['idea','planning','in-progress','blocked','testing','completed','archived'].includes(String(body.status))?String(body.status) as Project['status']:'planning',
      progress:Math.min(100,Math.max(0,Number.isFinite(Number(body.progress))?Number(body.progress):0)),
      startDate:clean(body.startDate,40),targetDate:clean(body.targetDate,40),phase:clean(body.phase,120),techStack:list(body.techStack),repository:safeHttpUrl(body.repository,500),liveUrl:safeHttpUrl(body.liveUrl,500),nextAction:clean(body.nextAction,300),blockers:list(body.blockers),notes:list(body.notes,50,1000),createdAt:now,updatedAt:now,
    };
    return json(await addProject(project),201);
  }catch(error){console.error('[projects] create failed',error);return json({error:error instanceof Error?error.message:'Project could not be saved. Please try again.'},500)}
}
