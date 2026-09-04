import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { rejectCrossOrigin } from '@/lib/security';
import { cronAuthorized } from '@/lib/scheduler-auth';
import { isSchedulerCategory } from '@/lib/scheduler-categories';

export const runtime = 'nodejs';

function clean(v: unknown, max: number) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

export async function GET(request: NextRequest) {
  const category = new URL(request.url).searchParams.get('category');
  if (category && !isSchedulerCategory(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }
  try {
    const sb = createSupabaseAdminClient();
    let q = sb.from('scheduler_items')
      .select('id,category,title,description,source,url,published_at,created_at')
      .is('archived_at', null)
      .order('created_at', { ascending: false })
      .limit(100);
    if (category) q = q.eq('category', category);
    const { data, error } = await q;
    if (error) throw error;
    return NextResponse.json(data || [], {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch {
    return NextResponse.json({ error: 'Unable to load scheduler items' }, {
      status: 500,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}

export async function POST(request: NextRequest) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;
  if (!cronAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, {
      status: 401,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (!Number.isFinite(contentLength) || contentLength > 64 * 1024) {
    return NextResponse.json({ error: 'Request too large' }, { status: 413 });
  }
  try {
    const body = await request.json();
    const category = clean(body?.category, 30);
    if (!isSchedulerCategory(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }
    const title = clean(body?.title, 500);
    const url = clean(body?.url, 2000);
    if (!title || !/^https:\/\//i.test(url)) {
      return NextResponse.json({ error: 'Invalid item' }, { status: 400 });
    }
    const description = clean(body?.description, 10000);
    const source = clean(body?.source, 300);
    let publishedAt: string | null = null;
    if (body?.publishedAt) {
      const d = new Date(body.publishedAt);
      if (Number.isNaN(d.getTime())) return NextResponse.json({ error: 'Invalid publication date' }, { status: 400 });
      publishedAt = d.toISOString();
    }
    const contentHash = crypto.createHash('sha256')
      .update(JSON.stringify({ category, title, description, url, publishedAt }))
      .digest('hex');
    const sb = createSupabaseAdminClient();
    const { data, error } = await sb.rpc('append_scheduler_item', {
      p_category: category,
      p_title: title,
      p_description: description,
      p_source: source,
      p_url: url,
      p_published_at: publishedAt,
      p_content_hash: contentHash,
    });
    if (error) throw error;
    return NextResponse.json(data, {
      status: 201,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ error: 'Unable to append scheduler item' }, {
      status: 500,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
