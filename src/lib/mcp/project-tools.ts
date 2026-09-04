import crypto from 'node:crypto';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { safeHttpUrl } from '@/lib/security';

// Mirrors the schema already verified in src/lib/project-store.ts's direct-DB
// fallback path and src/app/api/projects/{tasks,milestones,people}/route.ts.
// Uses the admin client with explicit owner_id filtering on every query --
// there is no user session in an MCP request, only a resolved owner id.

const clean = (v: unknown, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const list = (v: unknown, maxItems = 20, maxLength = 120): string[] =>
  Array.isArray(v)
    ? v.filter((x): x is string => typeof x === 'string').slice(0, maxItems).map((x) => x.trim().slice(0, maxLength)).filter(Boolean)
    : [];

function fromProjectRow(r: any, people: string[] = []) {
  return {
    id: r.id, name: r.name, description: r.description || '', people, organization: r.organization || '', role: r.role || '',
    priority: r.priority, status: r.status, progress: Number(r.progress || 0), startDate: r.start_date || undefined,
    targetDate: r.target_date || undefined, phase: r.phase || '', techStack: Array.isArray(r.tech_stack) ? r.tech_stack : [],
    repository: r.repository || undefined, liveUrl: r.live_url || undefined, nextAction: r.next_action || '',
    blockers: Array.isArray(r.blockers) ? r.blockers : [], notes: Array.isArray(r.notes) ? r.notes : [],
    createdAt: r.created_at, updatedAt: r.updated_at, archivedAt: r.archived_at || undefined,
  };
}

export async function listProjects(ownerId: string, includeArchived = false) {
  const sb = createSupabaseAdminClient();
  let q = sb.from('projects').select('*').eq('owner_id', ownerId).order('updated_at', { ascending: false });
  if (!includeArchived) q = q.neq('status', 'archived');
  const { data, error } = await q;
  if (error) throw error;
  const ids = (data || []).map((r: any) => r.id);
  const peopleByProject = new Map<string, string[]>();
  if (ids.length) {
    const { data: peopleRows } = await sb.from('project_people').select('project_id,name').eq('owner_id', ownerId).in('project_id', ids).order('created_at', { ascending: true });
    for (const p of peopleRows || []) {
      const current = peopleByProject.get(p.project_id) || [];
      if (typeof p.name === 'string' && p.name.trim()) current.push(p.name.trim());
      peopleByProject.set(p.project_id, current);
    }
  }
  return (data || []).map((r: any) => fromProjectRow(r, peopleByProject.get(r.id) || []));
}

export async function createProject(ownerId: string, input: Record<string, unknown>) {
  const name = clean(input.name, 120);
  if (!name) throw new Error('Project name is required.');
  const now = new Date().toISOString();
  const sb = createSupabaseAdminClient();
  const row = {
    id: crypto.randomUUID(), owner_id: ownerId, name, description: clean(input.description),
    organization: clean(input.organization, 160), role: clean(input.role, 120),
    priority: ['P0', 'P1', 'P2', 'P3'].includes(String(input.priority)) ? String(input.priority) : 'P2',
    status: ['idea', 'planning', 'in-progress', 'blocked', 'testing', 'completed', 'archived'].includes(String(input.status)) ? String(input.status) : 'planning',
    progress: Math.min(100, Math.max(0, Number.isFinite(Number(input.progress)) ? Number(input.progress) : 0)),
    start_date: clean(input.startDate, 40) || null, target_date: clean(input.targetDate, 40) || null, phase: clean(input.phase, 120),
    tech_stack: list(input.techStack), repository: safeHttpUrl(input.repository, 500), live_url: safeHttpUrl(input.liveUrl, 500),
    next_action: clean(input.nextAction, 300), blockers: list(input.blockers), notes: list(input.notes, 50, 1000),
    created_at: now, updated_at: now,
  };
  const { data, error } = await sb.from('projects').insert(row).select('*').single();
  if (error) throw error;
  const people = list(input.people, 20, 160);
  if (people.length) {
    const { error: peopleError } = await sb.from('project_people').insert(people.map((name) => ({ project_id: row.id, owner_id: ownerId, name })));
    if (peopleError) console.error('[mcp] project people insert failed', peopleError);
  }
  return fromProjectRow(data, people);
}

export async function updateProject(ownerId: string, id: string, patch: Record<string, unknown>) {
  const sb = createSupabaseAdminClient();
  const mapped: Record<string, unknown> = { updated_at: new Date().toISOString() };
  const keys: Record<string, string> = { startDate: 'start_date', targetDate: 'target_date', techStack: 'tech_stack', liveUrl: 'live_url', nextAction: 'next_action', archivedAt: 'archived_at' };
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue;
    mapped[keys[key] || key] = value;
  }
  const { data, error } = await sb.from('projects').update(mapped).eq('id', id).eq('owner_id', ownerId).select('*').single();
  if (error) throw error;
  const { data: peopleRows } = await sb.from('project_people').select('name').eq('project_id', id).eq('owner_id', ownerId).order('created_at', { ascending: true });
  const people = (peopleRows || []).map((x: any) => x.name).filter((x: any) => typeof x === 'string' && x.trim());
  return fromProjectRow(data, people);
}

export async function archiveProject(ownerId: string, id: string) {
  const sb = createSupabaseAdminClient();
  const stamp = new Date().toISOString();
  const { error } = await sb.from('projects').update({ status: 'archived', archived_at: stamp, updated_at: stamp }).eq('id', id).eq('owner_id', ownerId);
  if (error) throw error;
  return { ok: true };
}

export async function deleteProject(ownerId: string, id: string) {
  // Mirrors project-store.ts's deleteProject: soft-delete via archive, not a hard row delete.
  return archiveProject(ownerId, id);
}

const PROJECT_ID_RE = /^[0-9a-f-]{36}$/i;
async function assertOwnsProject(sb: ReturnType<typeof createSupabaseAdminClient>, ownerId: string, projectId: string) {
  if (!PROJECT_ID_RE.test(projectId)) throw new Error('Invalid project id.');
  const { data } = await sb.from('projects').select('id').eq('id', projectId).eq('owner_id', ownerId).maybeSingle();
  if (!data) throw new Error('Project not found.');
}

export async function listTasks(ownerId: string, projectId: string) {
  const sb = createSupabaseAdminClient();
  await assertOwnsProject(sb, ownerId, projectId);
  const { data, error } = await sb.from('project_tasks').select('*').eq('project_id', projectId).eq('owner_id', ownerId).order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createTask(ownerId: string, projectId: string, input: Record<string, unknown>) {
  const sb = createSupabaseAdminClient();
  await assertOwnsProject(sb, ownerId, projectId);
  const title = clean(input.title, 300);
  if (!title) throw new Error('Task title is required.');
  const priority = ['P0', 'P1', 'P2', 'P3'].includes(String(input.priority)) ? String(input.priority) : 'P2';
  const status = ['todo', 'in-progress', 'blocked', 'done'].includes(String(input.status)) ? String(input.status) : 'todo';
  const { data, error } = await sb.from('project_tasks').insert({
    project_id: projectId, owner_id: ownerId, title, description: clean(input.description, 5000), priority, status,
    due_date: clean(input.dueDate, 40) || null,
  }).select('*').single();
  if (error) throw error;
  return data;
}

export async function listMilestones(ownerId: string, projectId: string) {
  const sb = createSupabaseAdminClient();
  await assertOwnsProject(sb, ownerId, projectId);
  const { data, error } = await sb.from('project_milestones').select('*').eq('project_id', projectId).eq('owner_id', ownerId).order('target_date', { ascending: true, nullsFirst: false });
  if (error) throw error;
  return data || [];
}

export async function createMilestone(ownerId: string, projectId: string, input: Record<string, unknown>) {
  const sb = createSupabaseAdminClient();
  await assertOwnsProject(sb, ownerId, projectId);
  const title = clean(input.title, 300);
  if (!title) throw new Error('Milestone title is required.');
  const status = ['pending', 'in-progress', 'completed'].includes(String(input.status)) ? String(input.status) : 'pending';
  const { data, error } = await sb.from('project_milestones').insert({
    project_id: projectId, owner_id: ownerId, title, status, target_date: clean(input.targetDate, 40) || null,
  }).select('*').single();
  if (error) throw error;
  return data;
}

export async function listPeople(ownerId: string, projectId: string) {
  const sb = createSupabaseAdminClient();
  await assertOwnsProject(sb, ownerId, projectId);
  const { data, error } = await sb.from('project_people').select('*').eq('project_id', projectId).eq('owner_id', ownerId).order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function addPerson(ownerId: string, projectId: string, input: Record<string, unknown>) {
  const sb = createSupabaseAdminClient();
  await assertOwnsProject(sb, ownerId, projectId);
  const name = clean(input.name, 160);
  if (!name) throw new Error('Collaborator name is required.');
  const { data, error } = await sb.from('project_people').insert({
    project_id: projectId, owner_id: ownerId, name, role: clean(input.role, 160), organization: clean(input.organization, 160), notes: clean(input.notes, 2000),
  }).select('*').single();
  if (error) throw error;
  return data;
}
