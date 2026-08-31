import fs from 'node:fs/promises';
import path from 'node:path';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export type ProjectStatus = 'idea' | 'planning' | 'in-progress' | 'blocked' | 'testing' | 'completed' | 'archived';
export type ProjectPriority = 'P0' | 'P1' | 'P2' | 'P3';
export type Project = { id:string; name:string; description:string; people:string[]; organization:string; role:string; priority:ProjectPriority; status:ProjectStatus; progress:number; startDate?:string; targetDate?:string; phase:string; techStack:string[]; repository?:string; liveUrl?:string; nextAction:string; blockers:string[]; notes:string[]; createdAt:string; updatedAt:string; archivedAt?:string };

const file=path.join(process.cwd(),'src/data/projects/projects.json');
const configured=()=>Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));

async function legacy():Promise<Project[]>{throw new Error('Legacy project storage is disabled; Supabase is required for production');}

async function db(){
  if(!configured()) throw new Error('Supabase environment is not configured');
  const sb=await createSupabaseServerClient();
  let userId='';
  try{const {data,error}=await sb.auth.getUser();if(!error)userId=data.user?.id||'';}catch{}
  if(!userId){try{const claims=await sb.auth.getClaims();userId=claims.data?.claims?.sub||'';}catch{}}
  if(!userId)throw new Error('Unauthorized');
  return {userId,admin:createSupabaseAdminClient()};
}

function fromRow(r:any,people:string[]=[]):Project{return {id:r.id,name:r.name,description:r.description||'',people,organization:r.organization||'',role:r.role||'',priority:r.priority,status:r.status,progress:r.progress,startDate:r.start_date||undefined,targetDate:r.target_date||undefined,phase:r.phase||'',techStack:Array.isArray(r.tech_stack)?r.tech_stack:[],repository:r.repository||undefined,liveUrl:r.live_url||undefined,nextAction:r.next_action||'',blockers:Array.isArray(r.blockers)?r.blockers:[],notes:Array.isArray(r.notes)?r.notes:[],createdAt:r.created_at,updatedAt:r.updated_at,archivedAt:r.archived_at||undefined};}
function row(p:Project,ownerId:string){return {id:p.id,owner_id:ownerId,name:p.name,description:p.description,organization:p.organization,role:p.role,priority:p.priority,status:p.status,progress:p.progress,start_date:p.startDate||null,target_date:p.targetDate||null,phase:p.phase,tech_stack:p.techStack,repository:p.repository||'',live_url:p.liveUrl||'',next_action:p.nextAction,blockers:p.blockers,notes:p.notes,created_at:p.createdAt,updated_at:p.updatedAt,archived_at:p.archivedAt||null};}

async function listWith(client:any,userId:string){
  const {data,error}=await client.from('projects').select('*').eq('owner_id',userId).order('updated_at',{ascending:false});
  if(error)throw error;
  const projects=data||[]; if(!projects.length)return [];
  const ids=projects.map((p:any)=>p.id);
  const peopleResult=await client.from('project_people').select('project_id,name').eq('owner_id',userId).in('project_id',ids);
  if(peopleResult.error)throw peopleResult.error;
  const map=new Map<string,string[]>();
  for(const x of peopleResult.data||[])map.set(x.project_id,[...(map.get(x.project_id)||[]),x.name]);
  return projects.map((p:any)=>fromRow(p,map.get(p.id)||[]));
}

export async function listProjects(){const ctx=await db();return listWith(ctx.admin,ctx.userId);}

export async function addProject(p:Project){
  const ctx=await db();
  const payload=row(p,ctx.userId);
  const {data,error}=await ctx.admin.from('projects').insert(payload).select('*').single();
  if(error)throw error;
  if(p.people.length){const people=p.people.map(name=>({project_id:p.id,owner_id:ctx.userId,name,role:'',organization:p.organization||'',notes:''}));const pr=await ctx.admin.from('project_people').insert(people);if(pr.error){await ctx.admin.from('projects').delete().eq('id',p.id).eq('owner_id',ctx.userId);throw pr.error;}}
  return fromRow(data,p.people);
}

export async function archiveProject(id:string){const ctx=await db();const {error}=await ctx.admin.from('projects').update({status:'archived',archived_at:new Date().toISOString()}).eq('id',id).eq('owner_id',ctx.userId);if(error)throw error;}
