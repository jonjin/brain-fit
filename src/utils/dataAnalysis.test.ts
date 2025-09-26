import { describe, expect, it } from 'vitest';
import { buildTrendSeries, estimateImprovementRate, normalizeNetworkStrength } from './dataAnalysis';

describe('buildTrendSeries', () => {
  it('maps sessions to simple trend points', () => {
    const trend = buildTrendSeries({
      sessions: [
        { id: 'a', date: '2024-05-01', duration: 40, score: 80, averageConcentration: 0.7 },
        { id: 'b', date: '2024-05-02', duration: 38, score: 84, averageConcentration: 0.72 },
      ],
      network: { nodes: [], links: [] },
    });

    expect(trend).toEqual([
      { date: '2024-05-01', score: 80, concentration: 70 },
      { date: '2024-05-02', score: 84, concentration: 72 },
    ]);
  });
});

describe('estimateImprovementRate', () => {
  it('returns zero when insufficient sessions', () => {
    const rate = estimateImprovementRate({
      sessions: [{ id: 'only', date: '2024-05-01', duration: 30, score: 75, averageConcentration: 0.6 }],
      network: { nodes: [], links: [] },
    });
    expect(rate).toBe(0);
  });

  it('calculates daily improvement between first and last sessions', () => {
    const rate = estimateImprovementRate({
      sessions: [
        { id: 'start', date: '2024-05-01', duration: 35, score: 70, averageConcentration: 0.6 },
        { id: 'end', date: '2024-05-11', duration: 40, score: 90, averageConcentration: 0.75 },
      ],
      network: { nodes: [], links: [] },
    });
    expect(rate).toBe(2);
  });
});

describe('normalizeNetworkStrength', () => {
  it('returns unscaled strengths when peak is <= 1', () => {
    const normalized = normalizeNetworkStrength([
      { id: 'a', label: 'A', strength: 0.6 },
      { id: 'b', label: 'B', strength: 0.3 },
    ]);

    expect(normalized).toEqual([
      { id: 'a', label: 'A', strength: 0.6 },
      { id: 'b', label: 'B', strength: 0.3 },
    ]);
  });

  it('scales values relative to the maximum when greater than 1', () => {
    const normalized = normalizeNetworkStrength([
      { id: 'a', label: 'A', strength: 2 },
      { id: 'b', label: 'B', strength: 1 },
    ]);

    expect(normalized).toEqual([
      { id: 'a', label: 'A', strength: 1 },
      { id: 'b', label: 'B', strength: 0.5 },
    ]);
  });
});
