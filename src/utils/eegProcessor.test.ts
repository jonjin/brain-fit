import { describe, expect, it } from 'vitest';
import { calculateCognitiveLoad, processEEGStream } from './eegProcessor';
import type { EEGData } from '../hooks/useEEG';

describe('processEEGStream', () => {
  const history: EEGData[] = Array.from({ length: 5 }).map((_, index) => ({
    attention: 0.5 + index * 0.1,
    meditation: 0.4 + index * 0.05,
    delta: 0.1,
    theta: 0.2,
    alpha: 0.3,
    beta: 0.4,
    gamma: 0.5,
    timestamp: index,
  }));

  it('trims history to window size and calculates rounded metrics', () => {
    const result = processEEGStream(history, 3);
    expect(result.attentionTrend).toEqual([70, 80, 90]);
    expect(result.meditationTrend).toEqual([50, 55, 60]);
    expect(result.averageAttention).toBe(80);
    expect(result.calmnessIndex).toBe(55);
  });
});

describe('calculateCognitiveLoad', () => {
  it('produces bounded cognitive load score', () => {
    const sample: EEGData = {
      attention: 0.8,
      meditation: 0.6,
      delta: 0.1,
      theta: 0.2,
      alpha: 0.5,
      beta: 0.8,
      gamma: 0.9,
      timestamp: Date.now(),
    };

    const score = calculateCognitiveLoad(sample);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
