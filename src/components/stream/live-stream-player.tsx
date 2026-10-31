'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { StreamQuality, StreamState } from '@/types/stream';
import { StreamService, QUALITY_PROFILES } from '@/lib/stream/stream-service';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCw,
  Radio,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface LiveStreamPlayerProps {
  streamId: string;
  streamTitle: string;
  creatorName: string;
  state: StreamState;
  onStateChange: (newState: StreamState) => void;
  quality: StreamQuality;
  onQualityChange: (newQuality: StreamQuality) => void;
  activeCelebration?: string | null;
}

export function LiveStreamPlayer({
  streamTitle,
  creatorName,
  state,
  onStateChange,
  quality,
  onQualityChange,
  activeCelebration,
}: LiveStreamPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [showQualityMenu, setShowQualityMenu] = useState<boolean>(false);

  // Canvas visual rendering for realistic WebRTC stream simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tick = 0;

    const render = () => {
      tick++;
      const width = canvas.width;
      const height = canvas.height;

      // Dark futuristic streaming studio gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#0a0d14');
      gradient.addColorStop(0.5, '#121829');
      gradient.addColorStop(1, '#080a10');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      if (state === 'live' || state === 'buffering') {
        // Tech Grid overlay
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.lineWidth = 1;
        const gridSize = 40;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Live Audio visualizer waveform
        const bars = 48;
        const barWidth = width / bars - 4;
        for (let i = 0; i < bars; i++) {
          const wave = Math.sin(tick * 0.05 + i * 0.2) * 45 + Math.cos(tick * 0.03 + i * 0.1) * 30;
          const barHeight = Math.max(8, Math.abs(wave) + 20);
          const x = i * (barWidth + 4);
          const y = height / 2 - barHeight / 2;

          const barGrad = ctx.createLinearGradient(x, y, x, y + barHeight);
          barGrad.addColorStop(0, '#38bdf8');
          barGrad.addColorStop(1, '#6366f1');
          ctx.fillStyle = barGrad;
          ctx.fillRect(x, y, barWidth, barHeight);
        }

        // Animated scanline
        const scanlineY = (tick * 2) % height;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.fillRect(0, scanlineY, width, 4);

        // Watermark HUD
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '13px monospace';
        ctx.fillText(`WEB-RTC INGEST • ${QUALITY_PROFILES[quality].resolution} • ${QUALITY_PROFILES[quality].fps}fps`, 24, 36);

        // Simulation clock
        const now = new Date();
        const timeStr = now.toISOString().substring(11, 19) + ' UTC';
        ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
        ctx.fillText(timeStr, width - 140, 36);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state, quality]);

  // Fullscreen toggle handler
  const handleToggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-black shadow-2xl select-none"
    >
      {/* Video Canvas Feed */}
      <canvas ref={canvasRef} width={1280} height={720} className="h-full w-full object-cover" />

      {/* Floating Celebration Overlay on Tips / Gifts */}
      {activeCelebration && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center animate-bounce">
          <div className="flex items-center gap-3 rounded-full border border-yellow-400/50 bg-black/80 px-6 py-3 text-lg font-bold text-yellow-300 shadow-xl backdrop-blur-md">
            <Sparkles className="h-6 w-6 text-yellow-400 animate-spin" />
            <span>{activeCelebration}</span>
          </div>
        </div>
      )}

      {/* State Overlays */}
      {state === 'paused' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm">
          <div className="mb-4 rounded-full bg-primary/20 p-4 text-primary">
            <Pause className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-bold text-white">Stream Paused</h3>
          <p className="mt-1 text-sm text-muted-foreground">The creator has temporarily paused the broadcast.</p>
          <button
            onClick={() => onStateChange(StreamService.transitionState(state, 'live'))}
            className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Resume Live
          </button>
        </div>
      )}

      {state === 'reconnecting' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md">
          <RotateCw className="h-10 w-10 text-amber-400 animate-spin" />
          <h3 className="mt-4 text-xl font-bold text-white">Reconnecting Stream...</h3>
          <p className="mt-1 text-sm text-muted-foreground">Attempting to re-establish WebRTC peer connection</p>
          <button
            onClick={() => onStateChange('live')}
            className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20"
          >
            Force Reconnect Now
          </button>
        </div>
      )}

      {state === 'ended' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 p-6 text-center">
          <div className="rounded-full bg-red-500/20 p-4 text-red-400">
            <Radio className="h-10 w-10" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-white">Stream Ended</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Thank you for tuning in to &ldquo;{streamTitle}&rdquo; by {creatorName}. The VOD recording is being archived.
          </p>
          <button
            onClick={() => onStateChange('live')}
            className="mt-5 rounded-lg bg-zinc-800 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
          >
            Replay Stream
          </button>
        </div>
      )}

      {/* Top Banner Status Bar */}
      <div className="absolute left-4 top-4 z-10 flex items-center gap-3">
        {state === 'live' ? (
          <span className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
            <span className="h-2 w-2 rounded-full bg-white animate-ping" />
            LIVE
          </span>
        ) : (
          <span className="flex items-center gap-1.5 rounded-full bg-zinc-800 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-300">
            {state}
          </span>
        )}
        <span className="rounded-md bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
          {streamTitle}
        </span>
      </div>

      {/* Bottom Floating Control Bar */}
      <div
        className={`absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Left Controls: Play/Pause, Volume */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const next = state === 'live' ? 'paused' : 'live';
                onStateChange(StreamService.transitionState(state, next));
              }}
              aria-label={state === 'live' ? 'Pause' : 'Play'}
              className="rounded-lg p-2 text-white hover:bg-white/20 transition-colors"
            >
              {state === 'live' ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="rounded-lg p-2 text-white hover:bg-white/20 transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="h-1.5 w-20 cursor-pointer accent-primary"
              />
            </div>
          </div>

          {/* Right Controls: Quality, State Switcher, Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Quick State Switcher for testing/reconnection */}
            <select
              value={state}
              onChange={(e) => onStateChange(e.target.value as StreamState)}
              className="h-8 rounded-lg border border-white/20 bg-black/60 px-2 text-xs font-medium text-white backdrop-blur-md"
            >
              <option value="live">Live</option>
              <option value="paused">Pause</option>
              <option value="reconnecting">Reconnecting</option>
              <option value="ended">Ended</option>
            </select>

            {/* Quality Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/60 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md hover:bg-white/20"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>{quality.toUpperCase()}</span>
              </button>
              {showQualityMenu && (
                <div className="absolute bottom-10 right-0 z-30 w-36 rounded-lg border border-border bg-popover/95 p-1 shadow-2xl backdrop-blur-md">
                  {(['auto', '1080p', '720p', '480p', '360p'] as StreamQuality[]).map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        onQualityChange(q);
                        setShowQualityMenu(false);
                      }}
                      className={`w-full rounded px-2.5 py-1.5 text-left text-xs font-medium transition-colors ${
                        quality === q ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent'
                      }`}
                    >
                      {q.toUpperCase()} {q === '1080p' ? '(HD)' : ''}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={handleToggleFullscreen}
              aria-label="Toggle Fullscreen"
              className="rounded-lg p-2 text-white hover:bg-white/20 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
