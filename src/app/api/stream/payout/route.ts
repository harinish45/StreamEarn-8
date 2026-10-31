import { NextRequest, NextResponse } from 'next/server';
import { MonetizationService } from '@/lib/stream/monetization-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const amount = Number(body.amount);
    const destination = body.destinationAccount || 'Stripe Express (•••• 4242)';

    const payout = await MonetizationService.requestPayout(amount, destination);
    return NextResponse.json(payout, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Payout request failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
