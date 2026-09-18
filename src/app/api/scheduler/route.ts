import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { rejectCrossOrigin } from '@/lib/security';
import { cronAuthorized } from '@/lib/scheduler-auth';
import { isSchedulerCategory } from '@/lib/scheduler-categories';
import { schedulerItemCreateSchema } from '@/lib/api-validation';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const params = new URL(request.url).searchParams;
  const category = params.get('category');
  const limitValue = Number(params.get('limit') || 50);
  const offsetValue = Number(params.get('offset') || 0);
  const limit = Number.isInteger(limitValue) ? Math.min(100, Math.max(1, limitValue)) : 50;
  const offset = Number.isInteger(offsetValue) ? Math.max(0, offsetValue) : 0;
  if (category && !isSchedulerCategory(category)) return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  try {
    const sb = createSupabaseAdminClient();
    let q = sb.from('scheduler_items')
      .select('id,category,title,description,source,url,published_at,created_at')
      .is('archived_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit);
    if (category) q = q.eq('category', category);
    const { data, error } = await q;
    if (error) throw error;
    const fetched = data || [];
    const hasMore = fetched.length > limit;
    const rows = hasMore ? fetched.slice(0, limit) : fetched;
    return NextResponse.json(rows, {
      headers: {
        'Cache-Control': 'private, no-store',
        'X-Scheduler-Has-More': hasMore ? '1' : '0',
        'X-Scheduler-Next-Offset': String(offset + rows.length),
      }
    });
  } catch (error) {
    console.error('[scheduler] list failed', error);
    return NextResponse.json({ error: 'Unable to load scheduler items' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}

export async function POST(request: NextRequest) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;
  if (!cronAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (!Number.isFinite(contentLength) || contentLength > 64 * 1024) return NextResponse.json({ error: 'Request too large' }, { status: 413, headers: { 'Cache-Control': 'no-store' } });
  try {
    const body = schedulerItemCreateSchema.parse(await request.json());
    if (!isSchedulerCategory(body.category)) return NextResponse.json({ error: 'Invalid category' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    let publishedAt: string | null = null;
    if (body.publishedAt) {
      const d = new Date(body.publishedAt);
      if (Number.isNaN(d.getTime())) return NextResponse.json({ error: 'Invalid publication date' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
      publishedAt = d.toISOString();
    }
    const contentHash = crypto.createHash('sha256').update(JSON.stringify({ category: body.category, title: body.title, description: body.description, url: body.url, publishedAt })).digest('hex');
    const sb = createSupabaseAdminClient();
    const { data, error } = await sb.rpc('append_scheduler_item', {
      p_category: body.category, p_title: body.title, p_description: body.description, p_source: body.source,
      p_url: body.url, p_published_at: publishedAt, p_content_hash: contentHash,
    });
    if (error) throw error;
    return NextResponse.json(data, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return NextResponse.json({ error: 'Invalid scheduler item' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    console.error('[scheduler] append failed', error);
    return NextResponse.json({ error: 'Unable to append scheduler item' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
