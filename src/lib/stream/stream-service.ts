import { StreamQuality, StreamState, StreamStats } from '../../types/stream';

export interface QualityProfile {
  quality: StreamQuality;
  resolution: string;
  bitrateKbps: number;
  fps: number;
}

export const QUALITY_PROFILES: Record<StreamQuality, QualityProfile> = {
  auto: { quality: 'auto', resolution: '1080p (Dynamic)', bitrateKbps: 6000, fps: 60 },
  '1080p': { quality: '1080p', resolution: '1920x1080', bitrateKbps: 6000, fps: 60 },
  '720p': { quality: '720p', resolution: '1280x720', bitrateKbps: 3200, fps: 60 },
  '480p': { quality: '480p', resolution: '854x480', bitrateKbps: 1500, fps: 30 },
  '360p': { quality: '360p', resolution: '640x360', bitrateKbps: 800, fps: 30 },
};

export class StreamService {
  private static readonly VALID_TRANSITIONS: Record<StreamState, StreamState[]> = {
    live: ['paused', 'reconnecting', 'ended'],
    paused: ['live', 'ended', 'reconnecting'],
    reconnecting: ['live', 'ended', 'paused'],
    buffering: ['live', 'reconnecting', 'ended'],
    ended: ['live'],
  };

  /**
   * Validate if state transition is legally allowed.
   */
  public static canTransition(current: StreamState, next: StreamState): boolean {
    if (current === next) return true;
    const allowed = this.VALID_TRANSITIONS[current] || [];
    return allowed.includes(next);
  }

  /**
   * Execute state transition with boundary checks.
   */
  public static transitionState(current: StreamState, next: StreamState): StreamState {
    if (!this.canTransition(current, next)) {
      throw new Error(`Illegal stream state transition: cannot change from ${current} to ${next}`);
    }
    return next;
  }

  /**
   * Compute simulated jittered bitrate and telemetry based on chosen quality.
   */
  public static computeTelemetry(
    quality: StreamQuality,
    currentUptimeSec: number,
    baseViewerCount: number,
    totalTips: number
  ): StreamStats {
    const profile = QUALITY_PROFILES[quality];
    const jitter = Math.floor(Math.sin(currentUptimeSec / 10) * 150) + Math.floor(Math.random() * 50);
    const calculatedBitrate = Math.max(500, profile.bitrateKbps + jitter);
    const viewerFluctuation = Math.floor(Math.cos(currentUptimeSec / 15) * 8);
    const viewerCount = Math.max(1, baseViewerCount + viewerFluctuation);

    return {
      viewerCount,
      peakViewers: Math.max(viewerCount, Math.floor(baseViewerCount * 1.35)),
      durationSeconds: currentUptimeSec,
      totalTipsAmount: Number(totalTips.toFixed(2)),
      currentBitrateKbps: calculatedBitrate,
      resolution: profile.resolution,
      fps: profile.fps,
      latencyMs: quality === '1080p' ? 1200 : 950,
      health: calculatedBitrate > 2000 ? 'excellent' : 'good',
    };
  }

  /**
   * Format seconds to HH:MM:SS format
   */
  public static formatDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return hrs > 0 ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}` : `${pad(mins)}:${pad(secs)}`;
  }
}
