import { z } from 'zod'

const uuid = z.string().uuid()
const shortText = (max: number) => z.string().trim().min(1).max(max)
const boundedText = (max: number) => z.string().trim().max(max)
const optionalDate = z.string().trim().max(64).nullable().optional()
const stringList = (maxItems: number, maxLength: number) => z.array(z.string().trim().min(1).max(maxLength)).max(maxItems)

export const apiTokenCreateSchema = z.object({
  label: boundedText(120).optional(),
}).strict()

export const projectCreateSchema = z.object({
  name: shortText(120),
  description: boundedText(5000).optional().default(''),
  people: stringList(20, 120).optional().default([]),
  organization: boundedText(160).optional().default(''),
  role: boundedText(120).optional().default(''),
  priority: z.enum(['P0', 'P1', 'P2', 'P3']).optional().default('P2'),
  status: z.enum(['idea', 'planning', 'in-progress', 'blocked', 'testing', 'completed', 'archived']).optional().default('planning'),
  progress: z.number().finite().min(0).max(100).optional().default(0),
  startDate: boundedText(40).optional().default(''),
  targetDate: boundedText(40).optional().default(''),
  phase: boundedText(120).optional().default(''),
  techStack: stringList(20, 120).optional().default([]),
  repository: z.string().trim().max(500).url().optional().or(z.literal('')),
  liveUrl: z.string().trim().max(500).url().optional().or(z.literal('')),
  nextAction: boundedText(300).optional().default(''),
  blockers: stringList(20, 120).optional().default([]),
  notes: stringList(50, 1000).optional().default([]),
}).strict()

export const projectUpdateSchema = z.object({
  name: shortText(120).optional(),
  description: boundedText(2000).optional(),
  status: z.enum(['idea', 'planning', 'in-progress', 'blocked', 'testing', 'completed', 'archived']).optional(),
  priority: z.enum(['P0', 'P1', 'P2', 'P3']).optional(),
  progress: z.number().finite().min(0).max(100).optional(),
  nextAction: boundedText(300).optional(),
  phase: boundedText(120).optional(),
}).strict()

export const projectIdSchema = z.object({ projectId: uuid }).strict()
export const projectArchiveSchema = z.object({ id: uuid }).strict()

export const projectActivitySchema = z.object({
  projectId: uuid,
  action: shortText(120),
  details: z.record(z.string(), z.unknown()).optional().default({}),
}).strict()

export const projectIdeaCreateSchema = z.object({
  name: shortText(160),
  description: boundedText(2000).optional().default(''),
}).strict()

export const projectTaskCreateSchema = z.object({
  projectId: uuid,
  title: shortText(300),
  description: boundedText(5000).optional().default(''),
  priority: z.enum(['P0', 'P1', 'P2', 'P3']).optional().default('P2'),
  status: z.enum(['todo', 'in-progress', 'blocked', 'done']).optional().default('todo'),
  dueDate: optionalDate,
}).strict()

export const projectPersonCreateSchema = z.object({
  projectId: uuid,
  name: shortText(160),
  role: boundedText(160).optional().default(''),
  organization: boundedText(160).optional().default(''),
  notes: boundedText(2000).optional().default(''),
}).strict()

export const projectMilestoneCreateSchema = z.object({
  projectId: uuid,
  title: shortText(300),
  status: z.enum(['pending', 'in-progress', 'completed']).optional().default('pending'),
  targetDate: optionalDate,
}).strict()
