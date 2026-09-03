import { createSupabaseServerClient } from '@/lib/supabase/server';

export type ProjectStatus = 'idea' | 'planning' | 'in-progress' | 'blocked' | 'testing' | 'completed' | 'archived';
export type ProjectPriority = 'P0' | 'P1' | 'P2' | 'P3';
export type Project = { id:string; name:string; description:string; people:string[]; organization:string; role:string; priority:ProjectPriority; status:ProjectStatus; progress:number; startDate?:string; targetDate?:string; phase:string; techStack:string[]; repository?:string; liveUrl?:string; nextAction:string; blockers:string[]; notes:string[]; createdAt:string; updatedAt:string; archivedAt?:string };
export type Idea = { id:string; name:string; description:string; created_at:string; updated_at:string };

const edgeUrl=()=>`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/project-store`;

async function getSessionClient(){
  const sb=await createSupabaseServerClient();
  const {data:{session},error}=await sb.auth.getSession();
  if(error||!session) throw new Error('Unauthorized');
  return {sb,userId:session.user.id,accessToken:session.access_token};
}

async function callEdge(action:string,payload:Record<string,unknown>={}){
  const {accessToken}=await getSessionClient();
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),12000);
  try{
    let response:Response;
    try{
      response=await fetch(edgeUrl(),{method:'POST',cache:'no-store',signal:controller.signal,headers:{'Content-Type':'application/json','Accept':'application/json','Authorization':`Bearer ${accessToken}`},body:JSON.stringify({action,...payload})});
    }catch(error){
      if(error instanceof Error&&error.name==='AbortError') throw new Error('Project storage timed out. Please try again.');
      throw new Error('Unable to reach project storage. Please check your connection and try again.');
    }
    const data=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(data?.error||`Supabase operation failed (${response.status})`);
    return data;
  }finally{clearTimeout(timeout)}
}

function fromRow(r:any,people:string[]=[]):Project{return {id:r.id,name:r.name,description:r.description||'',people,organization:r.organization||'',role:r.role||'',priority:r.priority,status:r.status,progress:Number(r.progress||0),startDate:r.start_date||undefined,targetDate:r.target_date||undefined,phase:r.phase||'',techStack:Array.isArray(r.tech_stack)?r.tech_stack:[],repository:r.repository||undefined,liveUrl:r.live_url||undefined,nextAction:r.next_action||'',blockers:Array.isArray(r.blockers)?r.blockers:[],notes:Array.isArray(r.notes)?r.notes:[],createdAt:r.created_at,updatedAt:r.updated_at,archivedAt:r.archived_at||undefined};}
function row(p:Project){return {id:p.id,name:p.name,description:p.description,organization:p.organization,role:p.role,priority:p.priority,status:p.status,progress:p.progress,startDate:p.startDate||null,targetDate:p.targetDate||null,phase:p.phase,techStack:p.techStack,repository:p.repository||'',liveUrl:p.liveUrl||'',nextAction:p.nextAction,blockers:p.blockers,notes:p.notes,createdAt:p.createdAt,updatedAt:p.updatedAt,archivedAt:p.archivedAt||null,people:p.people};}
function directRow(p:Project,userId:string){return {id:p.id,owner_id:userId,name:p.name,description:p.description,organization:p.organization,role:p.role,priority:p.priority,status:p.status,progress:p.progress,start_date:p.startDate||null,target_date:p.targetDate||null,phase:p.phase,tech_stack:p.techStack,repository:p.repository||'',live_url:p.liveUrl||'',next_action:p.nextAction,blockers:p.blockers,notes:p.notes,created_at:p.createdAt,updated_at:p.updatedAt,archived_at:p.archivedAt||null};}
function isEdgeFailure(error:unknown){const message=error instanceof Error?error.message:'';return /502|503|504|operation failed|server supabase secret|unable to reach project storage|project storage timed out/i.test(message);}

async function directListProjects(){
  const {sb,userId}=await getSessionClient();
  const {data,error}=await sb.from('projects').select('*').eq('owner_id',userId).order('updated_at',{ascending:false});
  if(error) throw error;
  const ids=(data||[]).map((r:any)=>r.id);
  let peopleByProject=new Map<string,string[]>();
  if(ids.length){
    const peopleResult=await sb.from('project_people').select('project_id,name').eq('owner_id',userId).in('project_id',ids).order('created_at',{ascending:true});
    if(!peopleResult.error){
      for(const person of peopleResult.data||[]){const current=peopleByProject.get(person.project_id)||[];if(typeof person.name==='string'&&person.name.trim())current.push(person.name.trim());peopleByProject.set(person.project_id,current);}
    }
  }
  return (data||[]).map((r:any)=>fromRow(r,peopleByProject.get(r.id)||([] as string[])));
}

async function directCreateProject(p:Project){
  const {sb,userId}=await getSessionClient();
  const {data,error}=await sb.from('projects').insert(directRow(p,userId)).select('*').single();
  if(error) throw error;

  const people=(p.people||[]).map(name=>name.trim()).filter(Boolean).slice(0,20);
  if(people.length){
    const peopleResult=await sb.from('project_people').insert(people.map(name=>({project_id:p.id,owner_id:userId,name}))).select('name');
    if(peopleResult.error) console.error('[projects] people metadata save failed',peopleResult.error);
  }
  return fromRow(data,people);
}

async function directUpdateProject(id:string,patch:Record<string,unknown>){
  const {sb,userId}=await getSessionClient();
  const mapped:Record<string,unknown>={updated_at:new Date().toISOString()};
  const keys:Record<string,string>={startDate:'start_date',targetDate:'target_date',techStack:'tech_stack',liveUrl:'live_url',nextAction:'next_action',archivedAt:'archived_at'};
  for(const [key,value] of Object.entries(patch)) mapped[keys[key]||key]=value;
  const {data,error}=await sb.from('projects').update(mapped).eq('id',id).eq('owner_id',userId).select('*').single();
  if(error) throw error;
  const peopleResult=await sb.from('project_people').select('name').eq('project_id',id).eq('owner_id',userId).order('created_at',{ascending:true});
  const people=!peopleResult.error?(peopleResult.data||[]).map((x:any)=>x.name).filter((x:any)=>typeof x==='string'&&x.trim()):[];
  return fromRow(data,people);
}

async function directArchiveProject(id:string){
  const {sb,userId}=await getSessionClient();
  const stamp=new Date().toISOString();
  const {error}=await sb.from('projects').update({status:'archived',archived_at:stamp,updated_at:stamp}).eq('id',id).eq('owner_id',userId);
  if(error) throw error;
}

async function directDeleteProject(id:string){
  const {sb,userId}=await getSessionClient();
  const {error}=await sb.from('projects').update({status:'archived',archived_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq('id',id).eq('owner_id',userId);
  if(error) throw error;
}

export async function listProjects(){
  try{const data=await callEdge('list');return Array.isArray(data)?data.map((r:any)=>fromRow(r,Array.isArray(r.people)?r.people:[])):[];}
  catch(error){if(!isEdgeFailure(error))throw error;return await directListProjects();}
}

export async function addProject(p:Project){
  try{const data=await callEdge('create',{project:row(p)});return fromRow(data,Array.isArray(data.people)?data.people:p.people);}
  catch(error){if(!isEdgeFailure(error))throw error;return await directCreateProject(p);}
}

export async function updateProject(id:string,patch:Record<string,unknown>){
  try{const data=await callEdge('update',{id,patch});return fromRow(data,Array.isArray(data.people)?data.people:[]);}
  catch(error){if(!isEdgeFailure(error))throw error;return await directUpdateProject(id,patch);}
}

export async function archiveProject(id:string){
  try{await callEdge('archive',{id});}
  catch(error){if(!isEdgeFailure(error))throw error;await directArchiveProject(id);}
}

export async function deleteProject(id:string){
  try{await callEdge('delete',{id});}
  catch(error){if(!isEdgeFailure(error))throw error;await directDeleteProject(id);}
}

export async function listIdeas():Promise<Idea[]>{
  const data=await callEdge('idea-list');return Array.isArray(data)?data:[];
}
export async function addIdea(name:string,description:string):Promise<Idea>{return await callEdge('idea-create',{name,description});}
