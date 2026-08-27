import fs from 'node:fs/promises';
import path from 'node:path';

export type ProjectStatus = 'idea' | 'planning' | 'in-progress' | 'blocked' | 'testing' | 'completed' | 'archived';
export type ProjectPriority = 'P0' | 'P1' | 'P2' | 'P3';

export type Project = {
  id: string;
  name: string;
  description: string;
  people: string[];
  organization: string;
  role: string;
  priority: ProjectPriority;
  status: ProjectStatus;
  progress: number;
  startDate?: string;
  targetDate?: string;
  phase: string;
  techStack: string[];
  repository?: string;
  liveUrl?: string;
  nextAction: string;
  blockers: string[];
  notes: string[];
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
};

const file = path.join(process.cwd(), 'src/data/projects/projects.json');

async function read(): Promise<Project[]> {
  const raw = await fs.readFile(file, 'utf8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error('Project store is invalid');
  return parsed;
}

export async function listProjects() { return read(); }

export async function addProject(project: Project) {
  const projects = await read();
  if (projects.some((p) => p.id === project.id)) throw new Error('Project already exists');
  const next = [...projects, project];
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  await fs.rename(tmp, file);
  return project;
}

export async function archiveProject(id: string) {
  const projects = await read();
  const now = new Date().toISOString();
  const next = projects.map((p) => p.id === id ? { ...p, status: 'archived' as const, archivedAt: now, updatedAt: now } : p);
  if (next.every((p, i) => p === projects[i])) throw new Error('Project not found');
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  await fs.rename(tmp, file);
}
