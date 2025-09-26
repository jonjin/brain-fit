import { describe, expect, it } from 'vitest';
import { calculateSessionSummary, calculateTaskScore } from './scoreCalculator';

describe('calculateTaskScore', () => {
  it('weights accuracy most heavily', () => {
    const highAccuracy = calculateTaskScore({ accuracy: 95, speed: 40, concentration: 40 });
    const lowAccuracy = calculateTaskScore({ accuracy: 60, speed: 40, concentration: 40 });
    expect(highAccuracy).toBeGreaterThan(lowAccuracy);
    expect(highAccuracy).toBe(73);
  });

  it('clamps score between 0 and 100', () => {
    expect(calculateTaskScore({ accuracy: 200, speed: 200, concentration: 200 })).toBe(100);
    expect(calculateTaskScore({ accuracy: -20, speed: -10, concentration: -30 })).toBe(0);
  });
});

describe('calculateSessionSummary', () => {
  it('returns zeroed summary when no scores provided', () => {
    expect(calculateSessionSummary([])).toEqual({
      averageScore: 0,
      bestScore: 0,
      sessionsCompleted: 0,
    });
  });

  it('computes average, best score and count', () => {
    const summary = calculateSessionSummary([70, 80, 90]);
    expect(summary).toEqual({
      averageScore: 80,
      bestScore: 90,
      sessionsCompleted: 3,
    });
  });
});
