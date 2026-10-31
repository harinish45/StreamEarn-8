'use client';

import React, { useState } from 'react';
import { MonetizationService } from '@/lib/stream/monetization-service';
import { VIRTUAL_GIFTS } from '@/lib/stream/mock-data';
import { VirtualGift, TipResponse } from '@/types/stream';
import {
  X,
  CreditCard,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface TippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  streamId: string;
  creatorId: string;
  creatorName: string;
  onTipSuccess: (response: TipResponse, gift?: VirtualGift) => void;
}

const PRESET_AMOUNTS = [2, 5, 10, 25, 50, 100];

export function TippingModal({
  isOpen,
  onClose,
  streamId,
  creatorId,
  creatorName,
  onTipSuccess,
}: TippingModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedGift, setSelectedGift] = useState<VirtualGift | null>(null);
  const [senderName, setSenderName] = useState<string>('LiveViewer');
  const [tipMessage, setTipMessage] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successResponse, setSuccessResponse] = useState<TipResponse | null>(null);

  if (!isOpen) return null;

  const currentAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  const handleSelectGift = (gift: VirtualGift) => {
    setSelectedGift(gift);
    setSelectedAmount(gift.cost);
    setCustomAmount('');
  };

  const handleSelectPreset = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setSelectedGift(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const response = await MonetizationService.processTip({
        streamId,
        creatorId,
        amount: currentAmount,
        currency: 'USD',
        senderName: senderName.trim() || 'Anonymous Supporter',
        message: tipMessage,
        giftId: selectedGift?.id,
        paymentMethod: 'card',
      });

      setSuccessResponse(response);
      onTipSuccess(response, selectedGift || undefined);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to process payment');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const breakdown = MonetizationService.calculateBreakdown(isNaN(currentAmount) ? 0 : currentAmount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {successResponse ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-foreground">Tip Successfully Sent!</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Thank you for supporting <span className="font-semibold text-foreground">{creatorName}</span>. Your message has been broadcast live!
            </p>
            <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4 text-xs space-y-1.5 text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-mono text-foreground">{successResponse.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-bold text-foreground">${successResponse.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Creator Net:</span>
                <span className="text-emerald-500 font-semibold">${successResponse.creatorNet.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setSuccessResponse(null);
                onClose();
              }}
              className="mt-6 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Tip {creatorName}</h3>
                <p className="text-xs text-muted-foreground">Secure Stripe Checkout & Instant Chat Alert</p>
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Virtual Gifts */}
            <div>
              <label className="text-xs font-semibold text-foreground">Choose a Virtual Gift</label>
              <div className="mt-1.5 grid grid-cols-3 gap-2 sm:grid-cols-6">
                {VIRTUAL_GIFTS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => handleSelectGift(g)}
                    className={`flex flex-col items-center justify-center rounded-xl border p-2 transition-all ${
                      selectedGift?.id === g.id
                        ? 'border-amber-400 bg-amber-400/15 shadow-sm scale-105'
                        : 'border-border bg-muted/30 hover:border-border/80'
                    }`}
                  >
                    <span className="text-2xl">{g.icon}</span>
                    <span className="mt-1 text-[11px] font-bold">${g.cost}</span>
                    <span className="text-[9px] text-muted-foreground truncate w-full text-center">{g.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Presets */}
            <div>
              <label className="text-xs font-semibold text-foreground">Or Select Custom Amount</label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleSelectPreset(amt)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                      !customAmount && selectedAmount === amt && !selectedGift
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background hover:bg-muted'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
                <div className="relative flex-1 min-w-[120px]">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    placeholder="Custom"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedGift(null);
                    }}
                    className="w-full rounded-lg border border-input bg-background py-1.5 pl-6 pr-2 text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Supporter Name & Tip Message */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-foreground">Your Name / Handle</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  maxLength={40}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">Tip Message</label>
                <input
                  type="text"
                  placeholder="Awesome broadcast!"
                  value={tipMessage}
                  onChange={(e) => setTipMessage(e.target.value)}
                  maxLength={150}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Card Simulation */}
            <div className="rounded-xl border border-border bg-muted/30 p-3">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-primary" />
                  Stripe Payment Card
                </span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Lock className="h-3 w-3" /> 256-Bit SSL Encrypted
                </span>
              </div>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="mt-2 w-full rounded border border-input bg-background px-2.5 py-1.5 text-xs font-mono"
              />
              <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                <span>Creator Net: ${breakdown.creatorNet.toFixed(2)}</span>
                <span>Platform Fee (5%): ${breakdown.platformFee.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing || isNaN(currentAmount) || currentAmount <= 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing via Stripe...
                </>
              ) : (
                `Send $${(isNaN(currentAmount) ? 0 : currentAmount).toFixed(2)} Tip`
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
