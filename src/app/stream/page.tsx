'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { LiveStreamPlayer } from '@/components/stream/live-stream-player';
import { ChatOverlay } from '@/components/stream/chat-overlay';
import { StreamTelemetry } from '@/components/stream/stream-telemetry';
import { TippingModal } from '@/components/stream/tipping-modal';
import { SubscriptionModal } from '@/components/stream/subscription-modal';
import { DEFAULT_STREAMS, INITIAL_CHAT_MESSAGES } from '@/lib/stream/mock-data';
import { StreamService } from '@/lib/stream/stream-service';
import { ChatService } from '@/lib/stream/chat-service';
import {
  StreamMetadata,
  StreamState,
  StreamQuality,
  ChatMessage,
  ChatUser,
  TipResponse,
  VirtualGift,
  SubscriptionTier,
} from '@/types/stream';
import {
  Heart,
  DollarSign,
  Crown,
  Share2,
  Sparkles,
  Radio,
  Check,
} from 'lucide-react';

const CURRENT_VIEWER: ChatUser = {
  id: 'user-viewer-42',
  name: 'AlexRivera',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
  badge: 'viewer',
};

export default function StreamPage() {
  const [activeStream, setActiveStream] = useState<StreamMetadata>(DEFAULT_STREAMS[0]);
  const [streamState, setStreamState] = useState<StreamState>('live');
  const [quality, setQuality] = useState<StreamQuality>('1080p');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [isTippingOpen, setIsTippingOpen] = useState<boolean>(false);
  const [isSubscribingOpen, setIsSubscribingOpen] = useState<boolean>(false);
  const [activeCelebration, setActiveCelebration] = useState<string | null>(null);
  const [uptimeSeconds, setUptimeSeconds] = useState<number>(3600);
  const [totalTips, setTotalTips] = useState<number>(315.5);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Live timer for stream uptime
  useEffect(() => {
    if (streamState !== 'live') return;
    const interval = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [streamState]);

  // Compute live telemetry
  const stats = StreamService.computeTelemetry(quality, uptimeSeconds, 1840, totalTips);

  const handleSendMessage = (msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  };

  const handleTipSuccess = (response: TipResponse, gift?: VirtualGift) => {
    setTotalTips((prev) => prev + response.amount);
    const alertMsg = ChatService.createTipAlert(
      CURRENT_VIEWER.name,
      response.amount,
      response.message,
      gift ? { name: gift.name, icon: gift.icon } : undefined
    );
    setMessages((prev) => [...prev, alertMsg]);

    const celebrationText = gift
      ? `${gift.icon} ${CURRENT_VIEWER.name} sent ${gift.name} ($${response.amount.toFixed(2)})!`
      : `💰 ${CURRENT_VIEWER.name} tipped $${response.amount.toFixed(2)}!`;

    setActiveCelebration(celebrationText);
    setTimeout(() => setActiveCelebration(null), 4000);
  };

  const handleSubscriptionSuccess = (tier: SubscriptionTier) => {
    const alertMsg = ChatService.createSubscriptionAlert(CURRENT_VIEWER.name, tier.name);
    setMessages((prev) => [...prev, alertMsg]);
    setActiveCelebration(`👑 ${CURRENT_VIEWER.name} joined as a ${tier.name}!`);
    setTimeout(() => setActiveCelebration(null), 4500);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <>
      <Header showSidebarTrigger />

      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
        <Breadcrumbs
          path={[
            { name: 'Live', href: '/stream' },
            { name: activeStream.title, href: `/stream` },
          ]}
        />

        {/* Live Channel Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1 pr-2">
            <Radio className="h-3.5 w-3.5 text-red-500 animate-pulse" /> Channels:
          </span>
          {DEFAULT_STREAMS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveStream(s);
                setStreamState('live');
              }}
              className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeStream.id === s.id
                  ? 'border-primary bg-primary/10 text-primary shadow-sm'
                  : 'border-border bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
              <span>{s.creatorName}</span>
              <span className="text-[10px] text-muted-foreground/80 font-normal">({s.category})</span>
            </button>
          ))}
        </div>

        {/* Main Viewing Arena */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left 2 Cols: Player, Streamer Bio, Actions */}
          <div className="space-y-4 lg:col-span-2">
            <LiveStreamPlayer
              streamId={activeStream.id}
              streamTitle={activeStream.title}
              creatorName={activeStream.creatorName}
              state={streamState}
              onStateChange={setStreamState}
              quality={quality}
              onQualityChange={setQuality}
              activeCelebration={activeCelebration}
            />

            {/* Creator Bar & Interactive Action Buttons */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-primary/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeStream.creatorAvatar}
                      alt={activeStream.creatorName}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-foreground">{activeStream.creatorName}</h2>
                      <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                        VERIFIED CREATOR
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{activeStream.category}</p>
                  </div>
                </div>

                {/* Action Buttons: Tip, Subscribe, Follow, Share */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      isFollowing
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border-border bg-muted/40 text-foreground hover:bg-muted'
                    }`}
                  >
                    <Heart className={`h-3.5 w-3.5 ${isFollowing ? 'fill-emerald-400 text-emerald-400' : ''}`} />
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>

                  <button
                    onClick={() => setIsSubscribingOpen(true)}
                    className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-bold text-indigo-400 hover:bg-indigo-500/20 shadow-sm"
                  >
                    <Crown className="h-3.5 w-3.5" />
                    Subscribe
                  </button>

                  <button
                    onClick={() => setIsTippingOpen(true)}
                    className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-1.5 text-xs font-bold text-black shadow-md hover:brightness-110 active:scale-95 transition-all"
                  >
                    <DollarSign className="h-3.5 w-3.5 stroke-[2.5]" />
                    Tip Creator
                  </button>

                  <button
                    onClick={handleShare}
                    aria-label="Share Stream"
                    className="rounded-lg border border-border bg-muted/40 p-1.5 text-muted-foreground hover:text-foreground"
                  >
                    {copiedLink ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Stream Title & Description */}
              <div className="mt-4 border-t border-border pt-3">
                <h1 className="text-lg font-bold text-foreground">{activeStream.title}</h1>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {activeStream.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {activeStream.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stream Statistics & Telemetry */}
            <StreamTelemetry
              stats={stats}
              currentQuality={quality}
              onQualityChange={setQuality}
            />
          </div>

          {/* Right Col: Live Chat Overlay */}
          <div className="lg:col-span-1">
            <ChatOverlay
              messages={messages}
              onSendMessage={handleSendMessage}
              currentUser={CURRENT_VIEWER}
              onSendReaction={(emoji) => {
                const reactionMsg = ChatService.createChatMessage(CURRENT_VIEWER, emoji);
                handleSendMessage(reactionMsg);
              }}
            />
          </div>
        </div>

        {/* Modal Dialogs */}
        <TippingModal
          isOpen={isTippingOpen}
          onClose={() => setIsTippingOpen(false)}
          streamId={activeStream.id}
          creatorId={activeStream.creatorName}
          creatorName={activeStream.creatorName}
          onTipSuccess={handleTipSuccess}
        />

        <SubscriptionModal
          isOpen={isSubscribingOpen}
          onClose={() => setIsSubscribingOpen(false)}
          streamId={activeStream.id}
          creatorName={activeStream.creatorName}
          onSubscriptionSuccess={handleSubscriptionSuccess}
        />
      </div>
    </>
  );
}
