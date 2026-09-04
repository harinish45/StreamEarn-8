import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import * as projects from './project-tools';
import * as directory from './directory-tools';

const json = (data: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] });
const failure = (message: string) => ({ content: [{ type: 'text' as const, text: JSON.stringify({ error: message }) }], isError: true });

function ownerOf(extra: { authInfo?: { extra?: Record<string, unknown> } }): string {
  const ownerId = extra.authInfo?.extra?.ownerId;
  if (typeof ownerId !== 'string' || !ownerId) throw new Error('Unauthorized');
  return ownerId;
}

async function guarded<T>(run: () => Promise<T>) {
  try {
    return json(await run());
  } catch (error) {
    return failure(error instanceof Error ? error.message : 'Request failed.');
  }
}

export function buildMcpServer() {
  const server = new McpServer({ name: 'streamearn', version: '1.0.0' });

  // --- Projects (read/write, scoped to the authenticated token's owner) ---
  server.registerTool(
    'list_projects',
    { title: 'List projects', description: 'List your StreamEarn projects.', inputSchema: { includeArchived: z.boolean().optional().describe('Include archived projects. Default false.') } },
    async ({ includeArchived }, extra) => guarded(() => projects.listProjects(ownerOf(extra), Boolean(includeArchived))),
  );

  server.registerTool(
    'create_project',
    {
      title: 'Create project',
      description: 'Create a new StreamEarn project.',
      inputSchema: {
        name: z.string().min(1).describe('Project name'),
        description: z.string().optional(),
        organization: z.string().optional(),
        role: z.string().optional(),
        priority: z.enum(['P0', 'P1', 'P2', 'P3']).optional(),
        status: z.enum(['idea', 'planning', 'in-progress', 'blocked', 'testing', 'completed', 'archived']).optional(),
        progress: z.number().min(0).max(100).optional(),
        nextAction: z.string().optional(),
        phase: z.string().optional(),
        people: z.array(z.string()).optional(),
        techStack: z.array(z.string()).optional(),
        repository: z.string().optional().describe('Repository URL'),
        liveUrl: z.string().optional().describe('Live/deployed URL'),
        notes: z.array(z.string()).optional(),
      },
    },
    async (input, extra) => guarded(() => projects.createProject(ownerOf(extra), input)),
  );

  server.registerTool(
    'update_project',
    {
      title: 'Update project',
      description: 'Update fields on an existing project.',
      inputSchema: {
        id: z.string().uuid(),
        name: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(['idea', 'planning', 'in-progress', 'blocked', 'testing', 'completed', 'archived']).optional(),
        priority: z.enum(['P0', 'P1', 'P2', 'P3']).optional(),
        progress: z.number().min(0).max(100).optional(),
        nextAction: z.string().optional(),
        phase: z.string().optional(),
      },
    },
    async ({ id, ...patch }, extra) => guarded(() => projects.updateProject(ownerOf(extra), id, patch)),
  );

  server.registerTool(
    'archive_project',
    { title: 'Archive project', description: 'Archive a project (soft delete).', inputSchema: { id: z.string().uuid() } },
    async ({ id }, extra) => guarded(() => projects.archiveProject(ownerOf(extra), id)),
  );

  server.registerTool(
    'delete_project',
    { title: 'Delete project', description: 'Delete a project. This archives it, same as archive_project -- StreamEarn never hard-deletes projects.', inputSchema: { id: z.string().uuid() } },
    async ({ id }, extra) => guarded(() => projects.deleteProject(ownerOf(extra), id)),
  );

  server.registerTool(
    'list_tasks',
    { title: 'List project tasks', description: 'List tasks for one project.', inputSchema: { projectId: z.string().uuid() } },
    async ({ projectId }, extra) => guarded(() => projects.listTasks(ownerOf(extra), projectId)),
  );

  server.registerTool(
    'create_task',
    {
      title: 'Create project task',
      description: 'Create a task under a project.',
      inputSchema: {
        projectId: z.string().uuid(),
        title: z.string().min(1),
        description: z.string().optional(),
        priority: z.enum(['P0', 'P1', 'P2', 'P3']).optional(),
        status: z.enum(['todo', 'in-progress', 'blocked', 'done']).optional(),
        dueDate: z.string().optional().describe('ISO date'),
      },
    },
    async ({ projectId, ...input }, extra) => guarded(() => projects.createTask(ownerOf(extra), projectId, input)),
  );

  server.registerTool(
    'list_milestones',
    { title: 'List project milestones', description: 'List milestones for one project.', inputSchema: { projectId: z.string().uuid() } },
    async ({ projectId }, extra) => guarded(() => projects.listMilestones(ownerOf(extra), projectId)),
  );

  server.registerTool(
    'create_milestone',
    {
      title: 'Create project milestone',
      description: 'Create a milestone under a project.',
      inputSchema: {
        projectId: z.string().uuid(),
        title: z.string().min(1),
        status: z.enum(['pending', 'in-progress', 'completed']).optional(),
        targetDate: z.string().optional().describe('ISO date'),
      },
    },
    async ({ projectId, ...input }, extra) => guarded(() => projects.createMilestone(ownerOf(extra), projectId, input)),
  );

  server.registerTool(
    'list_people',
    { title: 'List project collaborators', description: 'List collaborators recorded on one project.', inputSchema: { projectId: z.string().uuid() } },
    async ({ projectId }, extra) => guarded(() => projects.listPeople(ownerOf(extra), projectId)),
  );

  server.registerTool(
    'add_person',
    {
      title: 'Add project collaborator',
      description: 'Add a collaborator to a project.',
      inputSchema: { projectId: z.string().uuid(), name: z.string().min(1), role: z.string().optional(), organization: z.string().optional(), notes: z.string().optional() },
    },
    async ({ projectId, ...input }, extra) => guarded(() => projects.addPerson(ownerOf(extra), projectId, input)),
  );

  // --- Read-only content directories (static/curated, no per-user ownership) ---
  server.registerTool(
    'list_ai_tools',
    { title: 'Search AI tools directory', description: 'Search StreamEarn\'s curated AI tools directory.', inputSchema: { query: z.string().optional(), limit: z.number().min(1).max(200).optional() } },
    async ({ query, limit }) => guarded(async () => directory.listAiTools(query, limit)),
  );

  server.registerTool(
    'list_resources',
    { title: 'Search resource hub', description: 'Search StreamEarn\'s Resource Hub links.', inputSchema: { query: z.string().optional(), limit: z.number().min(1).max(200).optional() } },
    async ({ query, limit }) => guarded(async () => directory.listResources(query, limit)),
  );

  server.registerTool(
    'list_earning_platforms',
    { title: 'Search earning platforms directory', description: 'Search the curated earning-opportunity platform directory (Upwork, Fiverr, etc.).', inputSchema: { query: z.string().optional(), limit: z.number().min(1).max(200).optional() } },
    async ({ query, limit }) => guarded(async () => directory.listEarningPlatforms(query, limit)),
  );

  server.registerTool(
    'list_scheduler_feed',
    {
      title: 'List curated feed items',
      description: 'List current items from a curated, date-aware feed: AI news, internships, scholarships, or timely earning opportunities.',
      inputSchema: { category: z.enum(['ai_news', 'internships', 'scholarships', 'earnings']), limit: z.number().min(1).max(100).optional() },
    },
    async ({ category, limit }) => guarded(() => directory.listSchedulerFeed(category, limit)),
  );

  return server;
}
