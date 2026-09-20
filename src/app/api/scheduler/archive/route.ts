import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { rejectCrossOrigin } from '@/lib/security';
import { cronAuthorized } from '@/lib/scheduler-auth';
import { schedulerArchiveSchema } from '@/lib/api-validation';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;

  const cron = cronAuthorized(request);

  try {
    const parsed = schedulerArchiveSchema.parse(await request.json());
    const ids = 'ids' in parsed ? parsed.ids : [parsed.id];
    const stamp = new Date().toISOString();

    if (cron) {
      // Scheduled maintenance may archive without a browser session.
      const sb = createSupabaseAdminClient();
      const { error } = await sb
        .from('scheduler_items')
        .update({ archived_at: stamp })
        .in('id', ids)
        .is('archived_at', null);

      if (error) throw error;
      return NextResponse.json({ ok: true, archived: ids.length }, {
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    // Manual selection/deletion uses the signed-in user's Supabase session
    // and therefore the table's authenticated UPDATE policy, not service-role access.
    const sb = await createSupabaseServerClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, {
        status: 401,
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    const { error } = await sb
      .from('scheduler_items')
      .update({
        archived_at: stamp,
        archived_by: user.id,
      })
      .in('id', ids)
      .is('archived_at', null);

    if (error) throw error;

    return NextResponse.json({ ok: true, archived: ids.length }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid scheduler item selection' }, {
        status: 400,
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    console.error('[scheduler] archive failed', error);
    return NextResponse.json({ error: 'Unable to archive scheduler items' }, {
      status: 500,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
