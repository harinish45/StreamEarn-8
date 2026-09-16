import { createSupabaseServerClient } from '@/lib/supabase/server';

export type ProjectStatus = 'idea' | 'planning' | 'in-progress' | 'blocked' | 'testing' | 'completed' | 'archived';
export type ProjectPriority = 'P0' | 'P1' | 'P2' | 'P3';
export type Project = { id:string; name:string; description:string; people:string[]; organization:string; role:string; priority:ProjectPriority; status:ProjectStatus; progress:number; startDate?:string; targetDate?:string; phase:string; techStack:string[]; repository?:string; liveUrl?:string; nextAction:string; blockers:string[]; notes:string[]; createdAt:string; updatedAt:string; archivedAt?:string };
export type Idea = { id:string; name:string; description:string; created_at:string; updated_at:string };

async function getSessionClient(){
  const sb=await createSupabaseServerClient();
  const {data:{user},error}=await sb.auth.getUser();
  if(error||!user) throw new Error('Unauthorized');
  return {sb,userId:user.id};
}

function fromRow(r:any,people:string[]=[]):Project{return {id:r.id,name:r.name,description:r.description||'',people,organization:r.organization||'',role:r.role||'',priority:r.priority,status:r.status,progress:Number(r.progress||0),startDate:r.start_date||undefined,targetDate:r.target_date||undefined,phase:r.phase||'',techStack:Array.isArray(r.tech_stack)?r.tech_stack:[],repository:r.repository||undefined,liveUrl:r.live_url||undefined,nextAction:r.next_action||'',blockers:Array.isArray(r.blockers)?r.blockers:[],notes:Array.isArray(r.notes)?r.notes:[],createdAt:r.created_at,updatedAt:r.updated_at,archivedAt:r.archived_at||undefined};}
function directRow(p:Project,userId:string){return {id:p.id,owner_id:userId,name:p.name,description:p.description,organization:p.organization,role:p.role,priority:p.priority,status:p.status,progress:p.progress,start_date:p.startDate||null,target_date:p.targetDate||null,phase:p.phase,tech_stack:p.techStack,repository:p.repository||'',live_url:p.liveUrl||'',next_action:p.nextAction,blockers:p.blockers,notes:p.notes,created_at:p.createdAt,updated_at:p.updatedAt,archived_at:p.archivedAt||null};}

export async function listProjects(){
  const {sb,userId}=await getSessionClient();
  const {data,error}=await sb.from('projects').select('*').eq('owner_id',userId).order('updated_at',{ascending:false});
  if(error) throw new Error('Unable to load projects.');
  const ids=(data||[]).map((r:any)=>r.id);
  const peopleByProject=new Map<string,string[]>();
  if(ids.length){
    const peopleResult=await sb.from('project_people').select('project_id,name').eq('owner_id',userId).in('project_id',ids).order('created_at',{ascending:true});
    if(peopleResult.error) throw new Error('Unable to load project collaborators.');
    for(const person of peopleResult.data||[]){const current=peopleByProject.get(person.project_id)||[];if(typeof person.name==='string'&&person.name.trim())current.push(person.name.trim());peopleByProject.set(person.project_id,current);}
  }
  return (data||[]).map((r:any)=>fromRow(r,peopleByProject.get(r.id)||[]));
}

export async function addProject(p:Project){
  const {sb,userId}=await getSessionClient();
  const {data,error}=await sb.from('projects').insert(directRow(p,userId)).select('*').single();
  if(error) throw new Error('Project could not be saved.');
  const people=(p.people||[]).map(name=>name.trim()).filter(Boolean).slice(0,20);
  if(people.length){
    const peopleResult=await sb.from('project_people').insert(people.map(name=>({project_id:p.id,owner_id:userId,name}))).select('name');
    if(peopleResult.error){console.error('[projects] people metadata save failed',peopleResult.error);throw new Error('Project collaborators could not be saved.');}
  }
  return fromRow(data,people);
}

export async function updateProject(id:string,patch:Record<string,unknown>){
  const {sb,userId}=await getSessionClient();
  const mapped:Record<string,unknown>={updated_at:new Date().toISOString()};
  const keys:Record<string,string>={startDate:'start_date',targetDate:'target_date',techStack:'tech_stack',liveUrl:'live_url',nextAction:'next_action',archivedAt:'archived_at'};
  for(const [key,value] of Object.entries(patch)) mapped[keys[key]||key]=value;
  const {data,error}=await sb.from('projects').update(mapped).eq('id',id).eq('owner_id',userId).select('*').single();
  if(error) throw new Error('Unable to update project.');
  const peopleResult=await sb.from('project_people').select('name').eq('project_id',id).eq('owner_id',userId).order('created_at',{ascending:true});
  if(peopleResult.error) throw new Error('Unable to load project collaborators.');
  const people=(peopleResult.data||[]).map((x:any)=>x.name).filter((x:any)=>typeof x==='string'&&x.trim());
  return fromRow(data,people);
}

export async function archiveProject(id:string){
  const {sb,userId}=await getSessionClient();
  const stamp=new Date().toISOString();
  const {error}=await sb.from('projects').update({status:'archived',archived_at:stamp,updated_at:stamp}).eq('id',id).eq('owner_id',userId);
  if(error) throw new Error('Unable to archive project.');
}

export async function deleteProject(id:string){
  const {sb,userId}=await getSessionClient();
  const stamp=new Date().toISOString();
  const {error}=await sb.from('projects').update({status:'archived',archived_at:stamp,updated_at:stamp}).eq('id',id).eq('owner_id',userId);
  if(error) throw new Error('Unable to archive project.');
}

export async function listIdeas():Promise<Idea[]>{
  const {sb,userId}=await getSessionClient();
  const {data,error}=await sb.from('project_ideas').select('id,name,description,created_at,updated_at').eq('owner_id',userId).order('updated_at',{ascending:false});
  if(error) throw new Error('Unable to load project ideas.');
  return (data||[]) as Idea[];
}

export async function addIdea(name:string,description:string):Promise<Idea>{
  const {sb,userId}=await getSessionClient();
  const {data,error}=await sb.from('project_ideas').insert({owner_id:userId,name,description}).select('id,name,description,created_at,updated_at').single();
  if(error) throw new Error('Unable to save project idea.');
  return data as Idea;
}
