import fs from 'node:fs/promises';
import path from 'node:path';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type ProjectStatus = 'idea' | 'planning' | 'in-progress' | 'blocked' | 'testing' | 'completed' | 'archived';
export type ProjectPriority = 'P0' | 'P1' | 'P2' | 'P3';
export type Project = {
  id: string; name: string; description: string; people: string[]; organization: string; role: string;
  priority: ProjectPriority; status: ProjectStatus; progress: number; startDate?: string; targetDate?: string;
  phase: string; techStack: string[]; repository?: string; liveUrl?: string; nextAction: string;
  blockers: string[]; notes: string[]; createdAt: string; updatedAt: string; archivedAt?: string;
};

const file = path.join(process.cwd(), 'src/data/projects/projects.json');
const isProduction = process.env.NODE_ENV === 'production';
const configured = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

async function legacy(): Promise<Project[]> {
  if (isProduction) throw new Error('Project persistence is unavailable: Supabase is not configured');
  const parsed = JSON.parse(await fs.readFile(file, 'utf8'));
  if (!Array.isArray(parsed)) throw new Error('Project store is invalid');
  return parsed;
}

async function db() {
  if (!configured()) {
    if (isProduction) throw new Error('Project persistence is unavailable: Supabase is not configured');
    return null;
  }
  const sb = await createSupabaseServerClient();
  const { data, error } = await sb.auth.getClaims();
  if (error || !data?.claims?.sub) throw new Error('Unauthorized');
  return sb;
}

function fromRow(r: any): Project {
  return {
    id: r.id, name: r.name, description: r.description || '', people: Array.isArray(r.people) ? r.people : [],
    organization: r.organization || '', role: r.role || '', priority: r.priority, status: r.status,
    progress: r.progress, startDate: r.start_date || undefined, targetDate: r.target_date || undefined,
    phase: r.phase || '', techStack: Array.isArray(r.tech_stack) ? r.tech_stack : [],
    repository: r.repository || undefined, liveUrl: r.live_url || undefined, nextAction: r.next_action || '',
    blockers: Array.isArray(r.blockers) ? r.blockers : [], notes: Array.isArray(r.notes) ? r.notes : [],
    createdAt: r.created_at, updatedAt: r.updated_at, archivedAt: r.archived_at || undefined,
  };
}

function row(p: Project) {
  return {
    id: p.id, name: p.name, description: p.description, organization: p.organization, role: p.role,
    priority: p.priority, status: p.status, progress: p.progress, start_date: p.startDate || null,
    target_date: p.targetDate || null, phase: p.phase, tech_stack: p.techStack, repository: p.repository || '',
    live_url: p.liveUrl || '', next_action: p.nextAction, blockers: p.blockers, notes: p.notes,
    created_at: p.createdAt, updated_at: p.updatedAt, archived_at: p.archivedAt || null,
  };
}

export async function listProjects() {
  const sb = await db();
  if (!sb) return legacy();
  const { data, error } = await sb.from('projects').select('*').order('updated_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(fromRow);
}

export async function addProject(p: Project) {
  const sb = await db();
  if (!sb) {
    const old = await legacy();
    if (old.some(x => x.id === p.id)) throw new Error('Project already exists');
    const tmp = `${file}.${process.pid}.tmp`;
    await fs.writeFile(tmp, `${JSON.stringify([...old, p], null, 2)}\n`);
    await fs.rename(tmp, file);
    return p;
  }
  const { data, error } = await sb.from('projects').insert(row(p)).select('*').single();
  if (error) throw error;
  return fromRow(data);
}

export async function archiveProject(id: string) {
  const sb = await db();
  if (!sb) {
    const old = await legacy();
    const now = new Date().toISOString();
    const next = old.map(p => p.id === id ? { ...p, status: 'archived' as const, archivedAt: now, updatedAt: now } : p);
    if (next.every((p, i) => p === old[i])) throw new Error('Project not found');
    const tmp = `${file}.${process.pid}.tmp`;
    await fs.writeFile(tmp, `${JSON.stringify(next, null, 2)}\n`);
    await fs.rename(tmp, file);
    return;
  }
  const { error } = await sb.from('projects').update({ status: 'archived', archived_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}
