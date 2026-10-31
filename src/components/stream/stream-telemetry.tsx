'use client';

import React from 'react';
import { StreamStats, StreamQuality } from '@/types/stream';
import { StreamService } from '@/lib/stream/stream-service';
import {
  Users,
  Clock,
  DollarSign,
  Activity,
  Gauge,
  Wifi,
} from 'lucide-react';

interface StreamTelemetryProps {
  stats: StreamStats;
  currentQuality: StreamQuality;
  onQualityChange: (quality: StreamQuality) => void;
}

export function StreamTelemetry({ stats }: StreamTelemetryProps) {
  const getHealthBadge = (health: string) => {
    switch (health) {
      case 'excellent':
        return (
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            HEALTH: EXCELLENT
          </span>
        );
      case 'good':
        return (
          <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
            HEALTH: GOOD
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400">
            HEALTH: POOR
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Real-Time Stream Telemetry</h3>
        </div>
        {getHealthBadge(stats.health)}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {/* Live Viewers */}
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5 text-blue-400" />
            <span>Live Viewers</span>
          </div>
          <div className="mt-1 text-lg font-bold text-foreground">
            {stats.viewerCount.toLocaleString()}
          </div>
          <div className="text-[10px] text-muted-foreground">
            Peak: {stats.peakViewers.toLocaleString()}
          </div>
        </div>

        {/* Stream Duration */}
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-emerald-400" />
            <span>Uptime</span>
          </div>
          <div className="mt-1 font-mono text-lg font-bold text-foreground">
            {StreamService.formatDuration(stats.durationSeconds)}
          </div>
          <div className="text-[10px] text-muted-foreground">Continuous</div>
        </div>

        {/* Tip Volume */}
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <DollarSign className="h-3.5 w-3.5 text-amber-400" />
            <span>Total Tips</span>
          </div>
          <div className="mt-1 text-lg font-bold text-foreground">
            ${stats.totalTipsAmount.toFixed(2)}
          </div>
          <div className="text-[10px] text-emerald-500 font-medium">Live Tipping Active</div>
        </div>

        {/* Bitrate */}
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Gauge className="h-3.5 w-3.5 text-indigo-400" />
            <span>Bitrate</span>
          </div>
          <div className="mt-1 text-lg font-bold text-foreground">
            {stats.currentBitrateKbps.toLocaleString()}{' '}
            <span className="text-xs font-normal text-muted-foreground">kbps</span>
          </div>
          <div className="text-[10px] text-muted-foreground">CBR WebRTC</div>
        </div>

        {/* Resolution & FPS */}
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Activity className="h-3.5 w-3.5 text-purple-400" />
            <span>Format</span>
          </div>
          <div className="mt-1 text-sm font-bold text-foreground truncate">
            {stats.resolution}
          </div>
          <div className="text-[10px] text-muted-foreground">{stats.fps} FPS H.264</div>
        </div>

        {/* Latency */}
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Wifi className="h-3.5 w-3.5 text-cyan-400" />
            <span>Latency</span>
          </div>
          <div className="mt-1 text-lg font-bold text-foreground">
            {(stats.latencyMs / 1000).toFixed(1)}{' '}
            <span className="text-xs font-normal text-muted-foreground">sec</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-medium">Sub-second WebRTC</div>
        </div>
      </div>
    </div>
  );
}
