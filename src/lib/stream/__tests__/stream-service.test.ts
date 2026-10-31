import { describe, it } from 'node:test';
import assert from 'node:assert';
import { StreamService, QUALITY_PROFILES } from '../stream-service';
import { StreamState } from '../../../types/stream';

describe('StreamService', () => {
  describe('State Transitions', () => {
    it('allows valid transitions from live', () => {
      assert.strictEqual(StreamService.canTransition('live', 'paused'), true);
      assert.strictEqual(StreamService.canTransition('live', 'reconnecting'), true);
      assert.strictEqual(StreamService.canTransition('live', 'ended'), true);
    });

    it('allows valid transitions from paused', () => {
      assert.strictEqual(StreamService.canTransition('paused', 'live'), true);
      assert.strictEqual(StreamService.canTransition('paused', 'ended'), true);
    });

    it('allows valid transitions from reconnecting', () => {
      assert.strictEqual(StreamService.canTransition('reconnecting', 'live'), true);
      assert.strictEqual(StreamService.canTransition('reconnecting', 'ended'), true);
    });

    it('throws error on illegal transition', () => {
      assert.throws(() => {
        StreamService.transitionState('ended', 'paused');
      }, /Illegal stream state transition/);
    });
  });

  describe('Duration Formatter', () => {
    it('formats seconds into MM:SS when under 1 hour', () => {
      assert.strictEqual(StreamService.formatDuration(65), '01:05');
      assert.strictEqual(StreamService.formatDuration(590), '09:50');
    });

    it('formats seconds into HH:MM:SS when over 1 hour', () => {
      assert.strictEqual(StreamService.formatDuration(3665), '01:01:05');
      assert.strictEqual(StreamService.formatDuration(7200), '02:00:00');
    });
  });

  describe('Telemetry Computation', () => {
    it('calculates telemetry correctly for 1080p', () => {
      const stats = StreamService.computeTelemetry('1080p', 3600, 1000, 250);
      assert.ok(stats.viewerCount >= 900 && stats.viewerCount <= 1100);
      assert.ok(stats.peakViewers >= 1000);
      assert.strictEqual(stats.durationSeconds, 3600);
      assert.strictEqual(stats.totalTipsAmount, 250);
      assert.strictEqual(stats.resolution, QUALITY_PROFILES['1080p'].resolution);
      assert.strictEqual(stats.fps, 60);
      assert.strictEqual(stats.health, 'excellent');
    });

    it('calculates telemetry for 480p with appropriate latency', () => {
      const stats = StreamService.computeTelemetry('480p', 120, 50, 10);
      assert.strictEqual(stats.resolution, QUALITY_PROFILES['480p'].resolution);
      assert.strictEqual(stats.fps, 30);
      assert.strictEqual(stats.latencyMs, 950);
    });
  });
});
