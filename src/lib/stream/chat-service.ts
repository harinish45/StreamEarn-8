import { ChatMessage, ChatUser } from '../../types/stream';

export class ChatService {
  private static readonly MAX_MESSAGE_LENGTH = 300;
  private static readonly BANNED_PATTERNS = [/botnet/i, /phishing-url/i];

  /**
   * Validate incoming chat message payload.
   */
  public static validateContent(content: string): string {
    const trimmed = content.trim();
    if (!trimmed) {
      throw new Error('Message content cannot be empty');
    }
    if (trimmed.length > this.MAX_MESSAGE_LENGTH) {
      throw new Error(`Message exceeds maximum limit of ${this.MAX_MESSAGE_LENGTH} characters`);
    }
    for (const pattern of this.BANNED_PATTERNS) {
      if (pattern.test(trimmed)) {
        throw new Error('Message flagged by automated content moderation rules');
      }
    }
    return trimmed;
  }

  /**
   * Create standard chat message object.
   */
  public static createChatMessage(user: ChatUser, text: string): ChatMessage {
    const sanitized = this.validateContent(text);
    return {
      id: `chat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      user,
      type: 'chat',
      content: sanitized,
    };
  }

  /**
   * Create system announcement message.
   */
  public static createAnnouncement(announcement: string): ChatMessage {
    return {
      id: `sys_${Date.now()}`,
      timestamp: Date.now(),
      user: {
        id: 'sys-bot',
        name: 'StreamEarn System',
        avatarUrl: '/streamearn-mark.svg',
        badge: 'moderator',
      },
      type: 'announcement',
      content: announcement,
    };
  }

  /**
   * Create tip alert chat message.
   */
  public static createTipAlert(
    senderName: string,
    amount: number,
    message: string,
    giftDetails?: { name: string; icon: string }
  ): ChatMessage {
    return {
      id: `tip_${Date.now()}`,
      timestamp: Date.now(),
      user: {
        id: `donor_${Date.now()}`,
        name: senderName,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        badge: amount >= 25 ? 'vip' : 'subscriber',
      },
      type: 'tip',
      content: message || `Sent a $${amount.toFixed(2)} tip!`,
      tipDetails: {
        amount,
        currency: 'USD',
        giftName: giftDetails?.name,
        giftIcon: giftDetails?.icon,
      },
    };
  }

  /**
   * Create subscription celebration alert message.
   */
  public static createSubscriptionAlert(subscriberName: string, tierName: string): ChatMessage {
    return {
      id: `sub_${Date.now()}`,
      timestamp: Date.now(),
      user: {
        id: `sub_${Date.now()}`,
        name: subscriberName,
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100',
        badge: 'subscriber',
      },
      type: 'subscription',
      content: `Subscribed to ${tierName} tier!`,
      tipDetails: {
        amount: 0,
        currency: 'USD',
        tier: tierName,
      },
    };
  }
}
