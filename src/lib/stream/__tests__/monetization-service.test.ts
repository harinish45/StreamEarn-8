import { describe, it } from 'node:test';
import assert from 'node:assert';
import { MonetizationService } from '../monetization-service';
import { TipRequest } from '../../../types/stream';

describe('MonetizationService', () => {
  describe('Fee and Breakdown Calculations', () => {
    it('calculates 5% fee and 95% creator net correctly', () => {
      const breakdown = MonetizationService.calculateBreakdown(100);
      assert.strictEqual(breakdown.platformFee, 5.0);
      assert.strictEqual(breakdown.creatorNet, 95.0);
    });

    it('handles decimal amounts without precision drift', () => {
      const breakdown = MonetizationService.calculateBreakdown(24.99);
      assert.strictEqual(breakdown.platformFee, 1.25);
      assert.strictEqual(breakdown.creatorNet, 23.74);
    });
  });

  describe('Validation', () => {
    it('rejects tips below minimum', () => {
      const invalidRequest: TipRequest = {
        streamId: 's1',
        creatorId: 'c1',
        amount: 0.5,
        currency: 'USD',
        senderName: 'Test',
        message: 'Hello',
        paymentMethod: 'card',
      };
      assert.throws(() => {
        MonetizationService.validateTipRequest(invalidRequest);
      }, /Minimum tip is \$1.00/);
    });

    it('rejects tips exceeding maximum limit', () => {
      const invalidRequest: TipRequest = {
        streamId: 's1',
        creatorId: 'c1',
        amount: 10000,
        currency: 'USD',
        senderName: 'Test',
        message: 'Hello',
        paymentMethod: 'card',
      };
      assert.throws(() => {
        MonetizationService.validateTipRequest(invalidRequest);
      }, /Maximum single tip limit is \$5000.00/);
    });

    it('rejects empty sender name', () => {
      const invalidRequest: TipRequest = {
        streamId: 's1',
        creatorId: 'c1',
        amount: 15,
        currency: 'USD',
        senderName: '   ',
        message: 'Hello',
        paymentMethod: 'card',
      };
      assert.throws(() => {
        MonetizationService.validateTipRequest(invalidRequest);
      }, /Sender name cannot be empty/);
    });
  });

  describe('Payment Processing', () => {
    it('processes tip and returns transaction ID and breakdown', async () => {
      const req: TipRequest = {
        streamId: 's-prod-1',
        creatorId: 'creator-99',
        amount: 50,
        currency: 'USD',
        senderName: 'DevWhale',
        message: 'Great work!',
        paymentMethod: 'card',
      };
      const res = await MonetizationService.processTip(req);
      assert.strictEqual(res.success, true);
      assert.ok(res.transactionId.startsWith('tx_stripe_'));
      assert.strictEqual(res.amount, 50);
      assert.strictEqual(res.creatorNet, 47.5);
      assert.strictEqual(res.fee, 2.5);
    });

    it('processes subscription for valid tier', async () => {
      const res = await MonetizationService.processSubscription('vip', 'Alice', 's-prod-1');
      assert.strictEqual(res.success, true);
      assert.strictEqual(res.tier.id, 'vip');
      assert.strictEqual(res.tier.priceMonthly, 24.99);
      assert.ok(res.transactionId.startsWith('sub_stripe_'));
    });

    it('rejects subscription for nonexistent tier', async () => {
      await assert.rejects(async () => {
        await MonetizationService.processSubscription('ultra-diamond', 'Alice', 's-prod-1');
      }, /Subscription tier "ultra-diamond" does not exist/);
    });

    it('initiates creator payout', async () => {
      const payout = await MonetizationService.requestPayout(450.5, 'Stripe Express (•••• 4242)');
      assert.strictEqual(payout.status, 'completed');
      assert.strictEqual(payout.amount, 450.5);
      assert.ok(payout.id.startsWith('pay_'));
    });
  });
});
