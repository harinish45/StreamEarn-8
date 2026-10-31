'use client';

import React, { useState } from 'react';
import { StreamMetadata, StreamState, PayoutRecord } from '@/types/stream';
import { MonetizationService } from '@/lib/stream/monetization-service';
import { MOCK_PAYOUTS, MOCK_RECORDINGS } from '@/lib/stream/mock-data';
import {
  Radio,
  Play,
  Pause,
  RotateCw,
  Power,
  Key,
  Copy,
  Check,
  DollarSign,
  ArrowUpRight,
  Shield,
  Film,
  Download,
  Eye,
  Loader2,
  Send,
} from 'lucide-react';

interface CreatorStudioProps {
  currentStream: StreamMetadata;
  streamState: StreamState;
  onStateChange: (state: StreamState) => void;
  onBroadcastAnnouncement: (announcement: string) => void;
  totalTipsEarned: number;
}

export function CreatorStudio({
  currentStream,
  streamState,
  onStateChange,
  onBroadcastAnnouncement,
  totalTipsEarned,
}: CreatorStudioProps) {
  const [showKey, setShowKey] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [announcementText, setAnnouncementText] = useState<string>('');
  const [payouts, setPayouts] = useState<PayoutRecord[]>(MOCK_PAYOUTS);
  const [isProcessingPayout, setIsProcessingPayout] = useState<boolean>(false);
  const [payoutSuccessMessage, setPayoutSuccessMessage] = useState<string | null>(null);

  const streamKey = 'live_sec_789432_sk_prod_webrtc_99';
  const availableBalance = Number((totalTipsEarned * 0.95 + 450.0).toFixed(2));

  const handleCopyKey = () => {
    navigator.clipboard.writeText(streamKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    onBroadcastAnnouncement(announcementText.trim());
    setAnnouncementText('');
  };

  const handleRequestPayout = async () => {
    if (availableBalance <= 0) return;
    setIsProcessingPayout(true);
    setPayoutSuccessMessage(null);

    try {
      const record = await MonetizationService.requestPayout(availableBalance, 'Stripe Express (•••• 4242)');
      setPayouts([record, ...payouts]);
      setPayoutSuccessMessage(`Successfully disbursed $${availableBalance.toFixed(2)} to your connected Stripe account!`);
    } finally {
      setIsProcessingPayout(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Broadcast Control Strip */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  streamState === 'live' ? 'bg-red-500 animate-pulse' : 'bg-muted-foreground'
                }`}
              />
              <h2 className="text-lg font-bold text-foreground">Creator Studio Master Controls</h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Broadcasting on channel: <span className="font-semibold text-foreground">{currentStream.title}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {streamState === 'live' ? (
              <button
                onClick={() => onStateChange('paused')}
                className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-400 hover:bg-amber-500/20"
              >
                <Pause className="h-4 w-4" /> Pause Stream
              </button>
            ) : (
              <button
                onClick={() => onStateChange('live')}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-red-700 shadow-md"
              >
                <Radio className="h-4 w-4 animate-pulse" /> Go Live
              </button>
            )}

            <button
              onClick={() => onStateChange('reconnecting')}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted"
            >
              <RotateCw className="h-4 w-4" /> Reconnect WebRTC
            </button>

            <button
              onClick={() => onStateChange('ended')}
              className="flex items-center gap-1.5 rounded-lg border border-destructive/40 bg-destructive/10 px-3.5 py-2 text-xs font-semibold text-destructive hover:bg-destructive/20"
            >
              <Power className="h-4 w-4" /> End Broadcast
            </button>
          </div>
        </div>

        {/* WebRTC Ingestion & Stream Key */}
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-muted/20 p-3">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              WebRTC Ingestion Server
            </span>
            <div className="mt-1 font-mono text-xs text-foreground bg-background p-2 rounded border border-border select-all">
              {currentStream.webrtcIngestUrl}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/20 p-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Stream Key
              </span>
              <button
                onClick={() => setShowKey(!showKey)}
                className="text-[11px] text-primary hover:underline"
              >
                {showKey ? 'Hide' : 'Reveal'}
              </button>
            </div>
            <div className="mt-1 flex items-center justify-between rounded border border-border bg-background p-1.5">
              <span className="font-mono text-xs text-foreground px-1 truncate">
                {showKey ? streamKey : '••••••••••••••••••••••••••••••••'}
              </span>
              <button
                onClick={handleCopyKey}
                aria-label="Copy Stream Key"
                className="flex items-center gap-1 rounded bg-muted px-2 py-1 text-[11px] font-medium text-foreground hover:bg-muted/80"
              >
                {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedKey ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue & Payouts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Earnings Card */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Available Creator Balance</h3>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-foreground">
            ${availableBalance.toFixed(2)}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Includes tips (${(totalTipsEarned * 0.95).toFixed(2)}) + monthly subscriptions ($450.00)
          </p>

          {payoutSuccessMessage && (
            <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-xs text-emerald-400">
              {payoutSuccessMessage}
            </div>
          )}

          <button
            onClick={handleRequestPayout}
            disabled={isProcessingPayout || availableBalance <= 0}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
          >
            {isProcessingPayout ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Transferring via Stripe Express...
              </>
            ) : (
              <>
                <ArrowUpRight className="h-4 w-4" /> Request Instant Payout
              </>
            )}
          </button>
        </div>

        {/* Live Broadcast Announcement Broadcaster */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Broadcast Official Stream Announcement</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Pinned announcement banner displayed immediately to all live chat participants.
          </p>

          <form onSubmit={handleSendAnnouncement} className="mt-4 flex gap-2">
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="e.g., Code repository link will be posted in 10 minutes..."
              maxLength={200}
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={!announcementText.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50 hover:bg-primary/90"
            >
              <Send className="h-3.5 w-3.5" /> Broadcast
            </button>
          </form>

          {/* Quick Creator Payout History */}
          <div className="mt-5">
            <h4 className="text-xs font-bold text-foreground mb-2">Recent Payout Ledger</h4>
            <div className="divide-y divide-border rounded-lg border border-border bg-background text-xs">
              {payouts.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center justify-between p-2.5">
                  <div>
                    <span className="font-semibold text-foreground">${p.amount.toFixed(2)}</span>
                    <span className="text-[10px] text-muted-foreground ml-2">({p.destinationAccount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      {p.status.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* VOD Recordings & Archive */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Film className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Archived VOD Recordings</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_RECORDINGS.map((vod) => (
            <div key={vod.id} className="overflow-hidden rounded-xl border border-border bg-background">
              <div className="relative aspect-video w-full bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={vod.thumbnailUrl} alt={vod.title} className="h-full w-full object-cover" />
                <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 text-[10px] font-mono text-white">
                  {Math.floor(vod.durationSeconds / 60)} min
                </span>
                <span className="absolute top-2 left-2 rounded bg-black/80 px-2 py-0.5 text-[10px] font-semibold text-white">
                  {vod.resolution}
                </span>
              </div>
              <div className="p-3">
                <h4 className="text-xs font-bold text-foreground line-clamp-1">{vod.title}</h4>
                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {vod.views.toLocaleString()} views
                  </span>
                  <a
                    href={vod.downloadUrl}
                    className="flex items-center gap-1 text-primary hover:underline font-medium"
                  >
                    <Download className="h-3 w-3" /> Download MP4
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
