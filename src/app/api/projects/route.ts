import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { addProject, listProjects, type Project } from '@/lib/project-store';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { rejectCrossOrigin, safeHttpUrl } from '@/lib/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function cleanString(value: unknown, max = 500) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}
function cleanList(value: unknown, maxItems = 20, maxLength = 120) {
  if (Array.isArray(value)) return value.filter((x): x is string => typeof x === 'string').slice(0, maxItems).map((x) => x.trim().slice(0, maxLength)).filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((x) => x.trim().slice(0, maxLength)).filter(Boolean).slice(0, maxItems);
  return [];
}
async function requireUser() {
  const sb = await createSupabaseServerClient();
  const user = await sb.auth.getUser();
  if (!user.error && user.data.user) return user.data.user;
  const claims = await sb.auth.getClaims().catch(() => null);
  const id = claims?.data?.claims?.sub;
  if (!id) throw new Error('Unauthorized');
  return { id } as { id: string };
}
function unauthorized() {
  return NextResponse.json({ error: 'Authentication required. Please sign in again.' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
}

export async function GET() {
  try {
    await requireUser();
    return NextResponse.json(await listProjects(), { headers: { 'Cache-Control': 'private,no-store' } });
  } catch (error) {
    console.error('[projects] list failed', error);
    if (error instanceof Error && error.message === 'Unauthorized') return unauthorized();
    const code = typeof error === 'object' && error && 'code' in error ? String((error as { code?: unknown }).code || '') : '';
    return NextResponse.json({ error: code ? `Project storage error (${code}). Please try again.` : 'Unable to load projects. Please try again.' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}

export async function POST(request: NextRequest) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;
  try {
    await requireUser();
    const contentType = (request.headers.get('content-type') || '').toLowerCase();
    let body: Record<string, unknown> = {};
    if (contentType.includes('application/json')) {
      const parsed = await request.json();
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
      body = parsed as Record<string, unknown>;
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      body = Object.fromEntries((await request.formData()).entries());
    } else {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const name = cleanString(body.name, 120);
    if (!name) return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    const now = new Date().toISOString();
    const project: Project = {
      id: crypto.randomUUID(), name, description: cleanString(body.description), people: cleanList(body.people),
      organization: cleanString(body.organization, 160), role: cleanString(body.role, 120),
      priority: ['P0', 'P1', 'P2', 'P3'].includes(String(body.priority)) ? String(body.priority) as Project['priority'] : 'P2',
      status: ['idea', 'planning', 'in-progress', 'blocked', 'testing', 'completed', 'archived'].includes(String(body.status)) ? String(body.status) as Project['status'] : 'idea',
      progress: Math.min(100, Math.max(0, Number.isFinite(Number(body.progress)) ? Number(body.progress) : 0)),
      startDate: cleanString(body.startDate, 40), targetDate: cleanString(body.targetDate, 40), phase: cleanString(body.phase, 120),
      techStack: cleanList(body.techStack), repository: safeHttpUrl(body.repository, 500), liveUrl: safeHttpUrl(body.liveUrl, 500),
      nextAction: cleanString(body.nextAction, 300), blockers: cleanList(body.blockers), notes: cleanList(body.notes, 50, 1000), createdAt: now, updatedAt: now,
    };
    const saved = await addProject(project);
    return NextResponse.json(saved, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[projects] create failed', error);
    if (error instanceof Error && error.message === 'Unauthorized') return unauthorized();
    const code = typeof error === 'object' && error && 'code' in error ? String((error as { code?: unknown }).code || '') : '';
    return NextResponse.json({ error: code ? `Project storage error (${code}).` : 'Project could not be saved. Please try again.' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
