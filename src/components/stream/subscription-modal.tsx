'use client';

import React, { useState } from 'react';
import { SUBSCRIPTION_TIERS } from '@/lib/stream/mock-data';
import { MonetizationService } from '@/lib/stream/monetization-service';
import { SubscriptionTier } from '@/types/stream';
import { X, Check, Crown, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  streamId: string;
  creatorName: string;
  onSubscriptionSuccess: (tier: SubscriptionTier) => void;
}

export function SubscriptionModal({
  isOpen,
  onClose,
  streamId,
  creatorName,
  onSubscriptionSuccess,
}: SubscriptionModalProps) {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(SUBSCRIPTION_TIERS[1]);
  const [subscriberName, setSubscriberName] = useState<string>('LiveViewer');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [confirmedTier, setConfirmedTier] = useState<SubscriptionTier | null>(null);

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    setIsProcessing(true);
    try {
      const res = await MonetizationService.processSubscription(
        selectedTier.id,
        subscriberName,
        streamId
      );
      setConfirmedTier(res.tier);
      onSubscriptionSuccess(res.tier);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {confirmedTier ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="mt-4 text-2xl font-bold text-foreground">Welcome to {confirmedTier.name}!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You are now an official subscriber of <span className="font-semibold text-foreground">{creatorName}</span>. Enjoy your exclusive chat badge and ad-free experience!
            </p>
            <button
              onClick={() => {
                setConfirmedTier(null);
                onClose();
              }}
              className="mt-6 rounded-xl bg-primary px-8 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Continue to Stream
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Crown className="h-6 w-6 text-amber-400" />
              <div>
                <h3 className="text-xl font-bold text-foreground">Subscribe to {creatorName}</h3>
                <p className="text-xs text-muted-foreground">Unlock exclusive creator badges, emotes, and perks</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold text-foreground">Your Name / Handle</label>
              <input
                type="text"
                value={subscriberName}
                onChange={(e) => setSubscriberName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Tiers Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {SUBSCRIPTION_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTier(tier)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all flex flex-col justify-between ${
                    selectedTier.id === tier.id
                      ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary'
                      : 'border-border bg-muted/20 hover:border-border/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">{tier.name}</span>
                      {tier.id === 'superfan' && (
                        <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-400">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <span className="text-2xl font-black text-foreground">${tier.priceMonthly}</span>
                      <span className="text-xs text-muted-foreground">/month</span>
                    </div>
                    <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                      {tier.perks.map((perk, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="h-3.5 w-3.5 flex-shrink-0 text-emerald-400 mt-0.5" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/50">
                    <span
                      className={`block w-full rounded-lg py-1.5 text-center text-xs font-semibold transition-colors ${
                        selectedTier.id === tier.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {selectedTier.id === tier.id ? 'Selected' : 'Select'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Activating Subscription via Stripe...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Subscribe for ${selectedTier.priceMonthly}/mo
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
