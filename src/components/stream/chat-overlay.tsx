'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatUser } from '@/types/stream';
import { ChatService } from '@/lib/stream/chat-service';
import {
  Send,
  Sparkles,
  ShieldAlert,
  Crown,
  Heart,
  Flame,
  Rocket,
  PartyPopper,
  Gem,
  Award,
} from 'lucide-react';

interface ChatOverlayProps {
  messages: ChatMessage[];
  onSendMessage: (msg: ChatMessage) => void;
  currentUser: ChatUser;
  onSendReaction?: (emoji: string) => void;
}

const QUICK_REACTIONS = [
  { emoji: '🔥', icon: Flame, color: 'text-orange-500' },
  { emoji: '❤️', icon: Heart, color: 'text-red-500' },
  { emoji: '🚀', icon: Rocket, color: 'text-indigo-400' },
  { emoji: '💎', icon: Gem, color: 'text-cyan-400' },
  { emoji: '🎉', icon: PartyPopper, color: 'text-yellow-400' },
];

export function ChatOverlay({
  messages,
  onSendMessage,
  currentUser,
  onSendReaction,
}: ChatOverlayProps) {
  const [inputText, setInputText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      const chatMsg = ChatService.createChatMessage(currentUser, inputText);
      onSendMessage(chatMsg);
      setInputText('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Failed to send message');
      }
    }
  };

  const handleReactionClick = (emoji: string) => {
    const id = Date.now() + Math.random();
    const x = 30 + Math.random() * 40; // percentage
    setFloatingReactions((prev) => [...prev, { id, emoji, x }]);

    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    }, 1800);

    if (onSendReaction) {
      onSendReaction(emoji);
    }
  };

  const renderBadge = (badge: string) => {
    switch (badge) {
      case 'creator':
        return (
          <span className="flex items-center gap-0.5 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
            <Crown className="h-2.5 w-2.5" /> CREATOR
          </span>
        );
      case 'vip':
        return (
          <span className="flex items-center gap-0.5 rounded bg-purple-500/20 px-1.5 py-0.5 text-[10px] font-bold text-purple-400">
            <Sparkles className="h-2.5 w-2.5" /> VIP
          </span>
        );
      case 'moderator':
        return (
          <span className="flex items-center gap-0.5 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
            <ShieldAlert className="h-2.5 w-2.5" /> MOD
          </span>
        );
      case 'subscriber':
        return (
          <span className="flex items-center gap-0.5 rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-bold text-blue-400">
            <Award className="h-2.5 w-2.5" /> SUB
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative flex h-[580px] w-full flex-col rounded-xl border border-border bg-card shadow-lg">
      {/* Floating Animated Reaction Sprites */}
      <div className="pointer-events-none absolute inset-x-0 bottom-24 top-0 overflow-hidden z-20">
        {floatingReactions.map((reaction) => (
          <div
            key={reaction.id}
            style={{ left: `${reaction.x}%` }}
            className="absolute bottom-0 text-3xl animate-floating-emoji"
          >
            {reaction.emoji}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-3.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-sm font-semibold text-foreground">Live Stream Chat</h3>
        </div>
        <span className="text-xs text-muted-foreground">{messages.length} messages</span>
      </div>

      {/* Chat Messages List */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 scroll-smooth">
        {messages.map((msg) => {
          if (msg.type === 'tip') {
            return (
              <div
                key={msg.id}
                className="relative overflow-hidden rounded-lg border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-3 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{msg.tipDetails?.giftIcon || '💰'}</span>
                    <span className="text-xs font-bold text-foreground">{msg.user.name}</span>
                    {renderBadge(msg.user.badge)}
                  </div>
                  <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-black text-amber-400">
                    +${msg.tipDetails?.amount.toFixed(2)}
                  </span>
                </div>
                {msg.content && (
                  <p className="mt-2 text-xs font-medium text-amber-200/90">{msg.content}</p>
                )}
                {msg.tipDetails?.giftName && (
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    Sent <span className="font-semibold text-foreground">{msg.tipDetails.giftName}</span>
                  </div>
                )}
              </div>
            );
          }

          if (msg.type === 'subscription') {
            return (
              <div
                key={msg.id}
                className="rounded-lg border border-indigo-500/40 bg-gradient-to-r from-indigo-500/15 via-indigo-500/5 to-transparent p-3"
              >
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-bold text-foreground">{msg.user.name}</span>
                  <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-bold text-indigo-300">
                    {msg.tipDetails?.tier || 'NEW SUBSCRIBER'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-indigo-200">{msg.content}</p>
              </div>
            );
          }

          if (msg.type === 'announcement') {
            return (
              <div
                key={msg.id}
                className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-2.5 text-xs text-blue-200"
              >
                <div className="flex items-center gap-1.5 font-bold text-blue-300 mb-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Announcement</span>
                </div>
                {msg.content}
              </div>
            );
          }

          // Standard chat message
          return (
            <div key={msg.id} className="group flex items-start gap-2.5 text-xs">
              <div className="h-7 w-7 flex-shrink-0 overflow-hidden rounded-full bg-muted border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={msg.user.avatarUrl} alt={msg.user.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-foreground truncate">{msg.user.name}</span>
                  {renderBadge(msg.user.badge)}
                  <span className="text-[10px] text-muted-foreground opacity-60">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="mt-0.5 break-words text-muted-foreground/90">{msg.content}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Reaction Bar */}
      <div className="flex items-center justify-between border-t border-border px-3 py-2 bg-muted/30">
        <span className="text-[11px] text-muted-foreground">React:</span>
        <div className="flex items-center gap-1.5">
          {QUICK_REACTIONS.map((r) => (
            <button
              key={r.emoji}
              onClick={() => handleReactionClick(r.emoji)}
              aria-label={`React ${r.emoji}`}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-background border border-border text-xs hover:scale-125 transition-transform shadow-sm"
            >
              {r.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="border-t border-border p-3">
        {errorMsg && (
          <p className="mb-2 text-[11px] text-destructive">{errorMsg}</p>
        )}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Send a message to live stream..."
            maxLength={300}
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            aria-label="Send Message"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
