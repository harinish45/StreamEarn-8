import { createSupabaseServerClient } from '@/lib/supabase/server';

export type ProjectStatus = 'idea' | 'planning' | 'in-progress' | 'blocked' | 'testing' | 'completed' | 'archived';
export type ProjectPriority = 'P0' | 'P1' | 'P2' | 'P3';
export type Project = { id:string; name:string; description:string; people:string[]; organization:string; role:string; priority:ProjectPriority; status:ProjectStatus; progress:number; startDate?:string; targetDate?:string; phase:string; techStack:string[]; repository?:string; liveUrl?:string; nextAction:string; blockers:string[]; notes:string[]; createdAt:string; updatedAt:string; archivedAt?:string };
export type Idea = { id:string; name:string; description:string; created_at:string; updated_at:string };

const edgeUrl=()=>`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/project-store`;
async function callEdge(action:string,payload:Record<string,unknown>={}){
  const sb=await createSupabaseServerClient();
  const session=(await sb.auth.getSession()).data.session;
  const accessToken=session?.access_token;
  if(!accessToken) throw new Error('Unauthorized');
  const response=await fetch(edgeUrl(),{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json','Authorization':`Bearer ${accessToken}`},body:JSON.stringify({action,...payload})});
  const data=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(data?.error||`Supabase operation failed (${response.status})`);
  return data;
}
function fromRow(r:any,people:string[]=[]):Project{return {id:r.id,name:r.name,description:r.description||'',people,organization:r.organization||'',role:r.role||'',priority:r.priority,status:r.status,progress:Number(r.progress||0),startDate:r.start_date||undefined,targetDate:r.target_date||undefined,phase:r.phase||'',techStack:Array.isArray(r.tech_stack)?r.tech_stack:[],repository:r.repository||undefined,liveUrl:r.live_url||undefined,nextAction:r.next_action||'',blockers:Array.isArray(r.blockers)?r.blockers:[],notes:Array.isArray(r.notes)?r.notes:[],createdAt:r.created_at,updatedAt:r.updated_at,archivedAt:r.archived_at||undefined};}
function row(p:Project){return {id:p.id,name:p.name,description:p.description,organization:p.organization,role:p.role,priority:p.priority,status:p.status,progress:p.progress,startDate:p.startDate||null,targetDate:p.targetDate||null,phase:p.phase,techStack:p.techStack,repository:p.repository||'',liveUrl:p.liveUrl||'',nextAction:p.nextAction,blockers:p.blockers,notes:p.notes,createdAt:p.createdAt,updatedAt:p.updatedAt,archivedAt:p.archivedAt||null,people:p.people};}
export async function listProjects(){const data=await callEdge('list');return Array.isArray(data)?data.map((r:any)=>fromRow(r,Array.isArray(r.people)?r.people:[])):[];}
export async function addProject(p:Project){const data=await callEdge('create',{project:row(p)});return fromRow(data,Array.isArray(data.people)?data.people:p.people);}
export async function updateProject(id:string,patch:Record<string,unknown>){const data=await callEdge('update',{id,patch});const people=Array.isArray(data.people)?data.people:[];return fromRow(data,people);}
export async function archiveProject(id:string){await callEdge('archive',{id});}
export async function deleteProject(id:string){await callEdge('delete',{id});}
export async function listIdeas():Promise<Idea[]>{const data=await callEdge('idea-list');return Array.isArray(data)?data:[];}
export async function addIdea(name:string,description:string):Promise<Idea>{return await callEdge('idea-create',{name,description});}
