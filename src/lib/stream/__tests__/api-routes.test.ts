import { describe, it } from 'node:test';
import assert from 'node:assert';
import { NextRequest } from 'next/server';
import { POST as checkoutPost } from '../../../app/api/stream/checkout/route';
import { POST as payoutPost } from '../../../app/api/stream/payout/route';
import { GET as telemetryGet } from '../../../app/api/stream/telemetry/route';
import { GET as chatGet, POST as chatPost } from '../../../app/api/stream/chat/route';

describe('Stream API Routes Integration', () => {
  it('POST /api/stream/checkout processes tip payment', async () => {
    const req = new NextRequest('http://localhost:3000/api/stream/checkout', {
      method: 'POST',
      body: JSON.stringify({
        streamId: 'stream-ai-future-01',
        creatorId: 'Elena Rostova',
        amount: 25,
        currency: 'USD',
        senderName: 'TestDonor',
        message: 'Kudos on the stream!',
      }),
    });

    const res = await checkoutPost(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.amount, 25);
    assert.strictEqual(data.fee, 1.25);
    assert.strictEqual(data.creatorNet, 23.75);
  });

  it('POST /api/stream/checkout processes subscription', async () => {
    const req = new NextRequest('http://localhost:3000/api/stream/checkout', {
      method: 'POST',
      body: JSON.stringify({
        type: 'subscription',
        tierId: 'superfan',
        subscriberName: 'IntegrationTester',
        streamId: 'stream-ai-future-01',
      }),
    });

    const res = await checkoutPost(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.tier.id, 'superfan');
  });

  it('POST /api/stream/payout processes instant creator payout', async () => {
    const req = new NextRequest('http://localhost:3000/api/stream/payout', {
      method: 'POST',
      body: JSON.stringify({
        amount: 150.0,
        destinationAccount: 'Stripe Express (•••• 4242)',
      }),
    });

    const res = await payoutPost(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'completed');
    assert.strictEqual(data.amount, 150.0);
  });

  it('GET /api/stream/telemetry computes current telemetry', async () => {
    const req = new NextRequest('http://localhost:3000/api/stream/telemetry?quality=720p&uptime=2400&viewers=950&tips=120');
    const res = await telemetryGet(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.resolution, '1280x720');
    assert.strictEqual(data.durationSeconds, 2400);
  });

  it('GET and POST /api/stream/chat manages chat stream', async () => {
    const getRes = await chatGet();
    assert.strictEqual(getRes.status, 200);
    const list = await getRes.json();
    assert.ok(Array.isArray(list));
    assert.ok(list.length > 0);

    const postReq = new NextRequest('http://localhost:3000/api/stream/chat', {
      method: 'POST',
      body: JSON.stringify({
        user: { id: 'u-int', name: 'Tester', avatarUrl: '/avatar.png', badge: 'viewer' },
        text: 'Integration test message!',
      }),
    });
    const postRes = await chatPost(postReq);
    assert.strictEqual(postRes.status, 201);
    const newMsg = await postRes.json();
    assert.strictEqual(newMsg.content, 'Integration test message!');
  });
});
