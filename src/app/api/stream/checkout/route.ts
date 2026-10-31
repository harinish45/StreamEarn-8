import { NextRequest, NextResponse } from 'next/server';
import { MonetizationService } from '@/lib/stream/monetization-service';
import { TipRequest } from '@/types/stream';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.type === 'subscription') {
      const { tierId, subscriberName, streamId } = body;
      const result = await MonetizationService.processSubscription(tierId, subscriberName, streamId);
      return NextResponse.json(result, { status: 200 });
    }

    const tipRequest: TipRequest = {
      streamId: body.streamId,
      creatorId: body.creatorId,
      amount: Number(body.amount),
      currency: body.currency || 'USD',
      senderName: body.senderName,
      message: body.message || '',
      giftId: body.giftId,
      paymentMethod: body.paymentMethod || 'card',
    };

    const tipResponse = await MonetizationService.processTip(tipRequest);
    return NextResponse.json(tipResponse, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Checkout processing failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
