/**
 * Types and interfaces for StreamEarn Live Streaming, Telemetry, and Monetization.
 */

export type StreamState = 'live' | 'paused' | 'ended' | 'reconnecting' | 'buffering';

export type StreamQuality = 'auto' | '1080p' | '720p' | '480p' | '360p';

export type UserBadge = 'creator' | 'vip' | 'moderator' | 'subscriber' | 'viewer';

export interface ChatUser {
  id: string;
  name: string;
  avatarUrl: string;
  badge: UserBadge;
}

export type ChatMessageType = 'chat' | 'tip' | 'announcement' | 'subscription' | 'gift';

export interface ChatMessage {
  id: string;
  timestamp: number;
  user: ChatUser;
  type: ChatMessageType;
  content: string;
  tipDetails?: {
    amount: number;
    currency: string;
    tier?: string;
    giftIcon?: string;
    giftName?: string;
  };
}

export interface StreamStats {
  viewerCount: number;
  peakViewers: number;
  durationSeconds: number;
  totalTipsAmount: number;
  currentBitrateKbps: number;
  resolution: string;
  fps: number;
  latencyMs: number;
  health: 'excellent' | 'good' | 'poor';
}

export interface StreamMetadata {
  id: string;
  title: string;
  creatorName: string;
  creatorAvatar: string;
  category: string;
  tags: string[];
  startedAt: number;
  thumbnailUrl: string;
  webrtcIngestUrl: string;
  description: string;
}

export interface VirtualGift {
  id: string;
  name: string;
  cost: number;
  icon: string;
  animationType: 'confetti' | 'rockets' | 'hearts' | 'sparkles' | 'crown';
}

export interface SubscriptionTier {
  id: 'fan' | 'superfan' | 'vip';
  name: string;
  priceMonthly: number;
  perks: string[];
  badgeColor: string;
}

export interface TipRequest {
  streamId: string;
  creatorId: string;
  amount: number;
  currency: string;
  senderName: string;
  message: string;
  giftId?: string;
  paymentMethod: 'card' | 'apple_pay' | 'google_pay';
}

export interface TipResponse {
  success: boolean;
  transactionId: string;
  amount: number;
  creatorNet: number;
  fee: number;
  message: string;
  timestamp: number;
}

export interface PayoutRecord {
  id: string;
  createdAt: number;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'processing';
  payoutMethod: string;
  destinationAccount: string;
}

export interface StreamRecording {
  id: string;
  title: string;
  durationSeconds: number;
  recordedAt: number;
  fileSizeBytes: number;
  resolution: string;
  views: number;
  downloadUrl: string;
  thumbnailUrl: string;
}
