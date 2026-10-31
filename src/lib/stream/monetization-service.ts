import { TipRequest, TipResponse, PayoutRecord, SubscriptionTier } from '../../types/stream';
import { SUBSCRIPTION_TIERS, VIRTUAL_GIFTS } from './mock-data';

export class MonetizationService {
  public static readonly PLATFORM_FEE_PERCENT = 0.05; // 5% platform fee
  public static readonly MINIMUM_TIP_AMOUNT = 1.0;
  public static readonly MAXIMUM_TIP_AMOUNT = 5000.0;

  /**
   * Validate tip request integrity.
   */
  public static validateTipRequest(request: TipRequest): void {
    if (!request.streamId || typeof request.streamId !== 'string') {
      throw new Error('Stream ID is required for tip processing');
    }
    if (typeof request.amount !== 'number' || isNaN(request.amount)) {
      throw new Error('Invalid tip amount provided');
    }
    if (request.amount < this.MINIMUM_TIP_AMOUNT) {
      throw new Error(`Minimum tip is $${this.MINIMUM_TIP_AMOUNT.toFixed(2)}`);
    }
    if (request.amount > this.MAXIMUM_TIP_AMOUNT) {
      throw new Error(`Maximum single tip limit is $${this.MAXIMUM_TIP_AMOUNT.toFixed(2)}`);
    }
    if (!request.senderName || request.senderName.trim().length === 0) {
      throw new Error('Sender name cannot be empty');
    }
  }

  /**
   * Calculate creator payout net and platform fee.
   */
  public static calculateBreakdown(amount: number): { creatorNet: number; platformFee: number } {
    const fee = Number((amount * this.PLATFORM_FEE_PERCENT).toFixed(2));
    const creatorNet = Number((amount - fee).toFixed(2));
    return { creatorNet, platformFee: fee };
  }

  /**
   * Process tip via Stripe simulation client.
   */
  public static async processTip(request: TipRequest): Promise<TipResponse> {
    this.validateTipRequest(request);

    // Simulate network delay for Stripe card processing
    await new Promise((resolve) => setTimeout(resolve, 50));

    const breakdown = this.calculateBreakdown(request.amount);
    const txId = `tx_stripe_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

    return {
      success: true,
      transactionId: txId,
      amount: request.amount,
      creatorNet: breakdown.creatorNet,
      fee: breakdown.platformFee,
      message: request.message.trim() || 'Awesome stream!',
      timestamp: Date.now(),
    };
  }

  /**
   * Process subscription tier checkout.
   */
  public static async processSubscription(
    tierId: string,
    subscriberName: string,
    streamId: string
  ): Promise<{ success: boolean; tier: SubscriptionTier; transactionId: string }> {
    const tier = SUBSCRIPTION_TIERS.find((t) => t.id === tierId);
    if (!tier) {
      throw new Error(`Subscription tier "${tierId}" does not exist`);
    }
    if (!subscriberName || !subscriberName.trim()) {
      throw new Error('Subscriber name is required');
    }

    await new Promise((resolve) => setTimeout(resolve, 50));
    const transactionId = `sub_stripe_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

    return {
      success: true,
      tier,
      transactionId,
    };
  }

  /**
   * Initiate creator payout to connected Stripe Express account.
   */
  public static async requestPayout(
    amount: number,
    destinationAccount: string
  ): Promise<PayoutRecord> {
    if (amount <= 0) {
      throw new Error('Payout amount must be greater than zero');
    }
    if (!destinationAccount || destinationAccount.trim().length === 0) {
      throw new Error('Valid destination bank or Stripe account is required');
    }

    await new Promise((resolve) => setTimeout(resolve, 50));

    return {
      id: `pay_${Date.now().toString(36)}`,
      createdAt: Date.now(),
      amount: Number(amount.toFixed(2)),
      currency: 'USD',
      status: 'completed',
      payoutMethod: 'Stripe Express Direct Deposit',
      destinationAccount,
    };
  }

  /**
   * Lookup virtual gift details.
   */
  public static findGift(giftId: string) {
    return VIRTUAL_GIFTS.find((g) => g.id === giftId);
  }
}
