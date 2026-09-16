import { z } from 'zod'

const uuid = z.string().uuid()
const shortText = (max: number) => z.string().trim().min(1).max(max)

export const apiTokenCreateSchema = z.object({
  label: z.string().trim().min(1).max(120).optional(),
}).strict()

export const projectTaskCreateSchema = z.object({
  projectId: uuid,
  title: shortText(300),
  description: z.string().trim().max(5000).optional().default(''),
  priority: z.enum(['P0', 'P1', 'P2', 'P3']).optional().default('P2'),
  status: z.enum(['todo', 'in-progress', 'blocked', 'done']).optional().default('todo'),
  dueDate: z.string().trim().max(64).nullable().optional(),
}).strict()

export const projectPersonCreateSchema = z.object({
  projectId: uuid,
  name: shortText(160),
  role: z.string().trim().max(160).optional().default(''),
  organization: z.string().trim().max(160).optional().default(''),
  notes: z.string().trim().max(2000).optional().default(''),
}).strict()

export const projectMilestoneCreateSchema = z.object({
  projectId: uuid,
  title: shortText(300),
  status: z.enum(['pending', 'in-progress', 'completed']).optional().default('pending'),
  targetDate: z.string().trim().max(64).nullable().optional(),
}).strict()
