import {
  StreamMetadata,
  VirtualGift,
  SubscriptionTier,
  ChatMessage,
  StreamRecording,
  PayoutRecord,
} from '../../types/stream';

export const DEFAULT_STREAMS: StreamMetadata[] = [
  {
    id: 'stream-ai-future-01',
    title: 'Building Real-Time AI Agents with WebRTC & Next.js 16',
    creatorName: 'Elena Rostova',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    category: 'AI & Engineering',
    tags: ['NextJS', 'WebRTC', 'Agents', 'TypeScript'],
    startedAt: Date.now() - 3600000 * 1.5,
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    webrtcIngestUrl: 'webrtc://live.streamearn.ai/live/ai-agents-prod',
    description: 'Live coding session demonstrating sub-second latency streaming with interactive tipping, WebRTC peer connections, and intelligent multi-agent pipelines.',
  },
  {
    id: 'stream-cyber-defense-02',
    title: 'Zero-Day Vulnerability Analysis & Live Threat Hunting',
    creatorName: 'Marcus Vance',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    category: 'Cybersecurity',
    tags: ['AppSec', 'ThreatHunting', 'Exploit', 'Network'],
    startedAt: Date.now() - 1800000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    webrtcIngestUrl: 'webrtc://live.streamearn.ai/live/cyber-defense',
    description: 'Hands-on live red team and blue team defense lab, packet inspection, and secure enclave demonstration.',
  },
  {
    id: 'stream-web3-earn-03',
    title: 'Monetizing Micro-SaaS with Stripe & Creator Tipping',
    creatorName: 'Sophia Lin',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    category: 'Product & Monetization',
    tags: ['Stripe', 'SaaS', 'Revenue', 'Founders'],
    startedAt: Date.now() - 5400000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    webrtcIngestUrl: 'webrtc://live.streamearn.ai/live/saas-monetization',
    description: 'Reviewing real-time payout architectures, conversion rates, and viewer retention strategies.',
  },
];

export const VIRTUAL_GIFTS: VirtualGift[] = [
  { id: 'gift-coffee', name: 'Coffee Boost', cost: 2, icon: '☕', animationType: 'hearts' },
  { id: 'gift-rocket', name: 'Super Rocket', cost: 5, icon: '🚀', animationType: 'rockets' },
  { id: 'gift-party', name: 'Confetti Cannon', cost: 10, icon: '🎉', animationType: 'confetti' },
  { id: 'gift-gem', name: 'Diamond Gem', cost: 25, icon: '💎', animationType: 'sparkles' },
  { id: 'gift-crown', name: 'King Crown', cost: 50, icon: '👑', animationType: 'crown' },
  { id: 'gift-trophy', name: 'Legendary Trophy', cost: 100, icon: '🏆', animationType: 'crown' },
];

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'fan',
    name: 'Supporter Fan',
    priceMonthly: 4.99,
    perks: ['Ad-free stream viewing', 'Exclusive Supporter Chat Badge', 'Access to subscriber-only chat'],
    badgeColor: '#3b82f6',
  },
  {
    id: 'superfan',
    name: 'Super Fan',
    priceMonthly: 9.99,
    perks: [
      'All Supporter Fan perks',
      'Highlighted chat messages',
      'Custom emote unlock',
      'Priority Q&A during live streams',
    ],
    badgeColor: '#8b5cf6',
  },
  {
    id: 'vip',
    name: 'VIP Patron',
    priceMonthly: 24.99,
    perks: [
      'All Super Fan perks',
      'VIP Gold Badge in stream chat',
      'Direct Discord access with creator',
      'Name listed in end-of-stream credits',
      'Uncapped VOD archival access',
    ],
    badgeColor: '#f59e0b',
  },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    timestamp: Date.now() - 120000,
    user: { id: 'u1', name: 'DevSamurai', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', badge: 'subscriber' },
    type: 'chat',
    content: 'Audio and video are crystal clear! What framework is the player using?',
  },
  {
    id: 'msg-2',
    timestamp: Date.now() - 95000,
    user: { id: 'u2', name: 'StreamBot', avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100', badge: 'moderator' },
    type: 'announcement',
    content: 'Welcome everyone! Tip goals are active: at $250 total tips, Elena will open-source the WebRTC signaling gateway.',
  },
  {
    id: 'msg-3',
    timestamp: Date.now() - 60000,
    user: { id: 'u3', name: 'CryptoWhale', avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100', badge: 'vip' },
    type: 'tip',
    content: 'Keep up the incredible engineering streams! Best tech breakdown on the net.',
    tipDetails: { amount: 50, currency: 'USD', giftName: 'King Crown', giftIcon: '👑' },
  },
  {
    id: 'msg-4',
    timestamp: Date.now() - 35000,
    user: { id: 'u4', name: 'CodeNinja99', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100', badge: 'viewer' },
    type: 'chat',
    content: 'Does this handle automatic adaptive bitrate switching when bandwidth drops?',
  },
  {
    id: 'msg-5',
    timestamp: Date.now() - 12000,
    user: { id: 'u5', name: 'TechInnovator', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', badge: 'subscriber' },
    type: 'subscription',
    content: 'Just upgraded to Super Fan tier! Let us build that agent pipeline!',
    tipDetails: { amount: 9.99, currency: 'USD', tier: 'Super Fan' },
  },
];

export const MOCK_RECORDINGS: StreamRecording[] = [
  {
    id: 'vod-101',
    title: 'High-Concurrency WebRTC Signaling Architecture Masterclass',
    durationSeconds: 5240,
    recordedAt: Date.now() - 86400000 * 2,
    fileSizeBytes: 1420000000,
    resolution: '1080p60',
    views: 4280,
    downloadUrl: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'vod-102',
    title: 'Building Zero-Knowledge Authentication in Next.js 16',
    durationSeconds: 4120,
    recordedAt: Date.now() - 86400000 * 5,
    fileSizeBytes: 1180000000,
    resolution: '1080p60',
    views: 7120,
    downloadUrl: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'vod-103',
    title: 'Full-Stack Stripe Connect Payouts & Marketplace Accounting',
    durationSeconds: 3680,
    recordedAt: Date.now() - 86400000 * 9,
    fileSizeBytes: 980000000,
    resolution: '720p60',
    views: 3890,
    downloadUrl: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
  },
];

export const MOCK_PAYOUTS: PayoutRecord[] = [
  {
    id: 'pay-7701',
    createdAt: Date.now() - 86400000 * 3,
    amount: 1420.50,
    currency: 'USD',
    status: 'completed',
    payoutMethod: 'Stripe Express (Direct Deposit)',
    destinationAccount: '•••• 4242',
  },
  {
    id: 'pay-7702',
    createdAt: Date.now() - 86400000 * 10,
    amount: 890.00,
    currency: 'USD',
    status: 'completed',
    payoutMethod: 'Stripe Express (Direct Deposit)',
    destinationAccount: '•••• 4242',
  },
  {
    id: 'pay-7703',
    createdAt: Date.now() - 86400000 * 17,
    amount: 2150.75,
    currency: 'USD',
    status: 'completed',
    payoutMethod: 'Stripe Express (Direct Deposit)',
    destinationAccount: '•••• 4242',
  },
];
