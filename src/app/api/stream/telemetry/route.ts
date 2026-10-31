import { NextRequest, NextResponse } from 'next/server';
import { StreamService } from '@/lib/stream/stream-service';
import { StreamQuality } from '@/types/stream';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const quality = (searchParams.get('quality') || '1080p') as StreamQuality;
    const uptime = parseInt(searchParams.get('uptime') || '3600', 10);
    const viewers = parseInt(searchParams.get('viewers') || '1420', 10);
    const tips = parseFloat(searchParams.get('tips') || '285.50');

    const stats = StreamService.computeTelemetry(quality, uptime, viewers, tips);
    return NextResponse.json(stats, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Telemetry request failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
