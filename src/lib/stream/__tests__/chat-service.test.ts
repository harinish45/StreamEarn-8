import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ChatService } from '../chat-service';
import { ChatUser } from '../../../types/stream';

describe('ChatService', () => {
  const testUser: ChatUser = {
    id: 'u-tester',
    name: 'CyberDev',
    avatarUrl: '/avatar.png',
    badge: 'viewer',
  };

  describe('Validation', () => {
    it('validates content and trims whitespace', () => {
      const sanitized = ChatService.validateContent('   Hello stream!   ');
      assert.strictEqual(sanitized, 'Hello stream!');
    });

    it('rejects empty content', () => {
      assert.throws(() => {
        ChatService.validateContent('     ');
      }, /Message content cannot be empty/);
    });

    it('rejects overly long message exceeding 300 chars', () => {
      const longText = 'a'.repeat(305);
      assert.throws(() => {
        ChatService.validateContent(longText);
      }, /Message exceeds maximum limit/);
    });

    it('rejects content with malicious pattern', () => {
      assert.throws(() => {
        ChatService.validateContent('join our botnet now');
      }, /flagged by automated content moderation/);
    });
  });

  describe('Message Generation', () => {
    it('creates standard chat message', () => {
      const msg = ChatService.createChatMessage(testUser, 'Awesome stream quality!');
      assert.strictEqual(msg.type, 'chat');
      assert.strictEqual(msg.user.id, testUser.id);
      assert.strictEqual(msg.content, 'Awesome stream quality!');
      assert.ok(msg.id.startsWith('chat_'));
    });

    it('creates system announcement', () => {
      const msg = ChatService.createAnnouncement('Server maintenance in 1 hour');
      assert.strictEqual(msg.type, 'announcement');
      assert.strictEqual(msg.user.name, 'StreamEarn System');
      assert.strictEqual(msg.content, 'Server maintenance in 1 hour');
    });

    it('creates tip alert with custom gift details', () => {
      const msg = ChatService.createTipAlert('Satoshi', 50, 'To the moon!', {
        name: 'Super Rocket',
        icon: '🚀',
      });
      assert.strictEqual(msg.type, 'tip');
      assert.strictEqual(msg.user.name, 'Satoshi');
      assert.strictEqual(msg.user.badge, 'vip');
      assert.strictEqual(msg.tipDetails?.amount, 50);
      assert.strictEqual(msg.tipDetails?.giftName, 'Super Rocket');
      assert.strictEqual(msg.tipDetails?.giftIcon, '🚀');
    });

    it('creates subscription alert', () => {
      const msg = ChatService.createSubscriptionAlert('AdaLovelace', 'VIP Patron');
      assert.strictEqual(msg.type, 'subscription');
      assert.strictEqual(msg.user.name, 'AdaLovelace');
      assert.strictEqual(msg.tipDetails?.tier, 'VIP Patron');
    });
  });
});
