import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useTrainingSession from './useTrainingSession';

describe('useTrainingSession', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('starts timer and tracks elapsed seconds', () => {
    const { result } = renderHook(() => useTrainingSession());

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.isActive).toBe(true);
    expect(result.current.elapsedSeconds).toBe(3);
  });

  it('advances through each task sequentially and accumulates score', () => {
    const { result } = renderHook(() => useTrainingSession());

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.completeTask(80);
    });
    expect(result.current.currentTask).toBe('cards');

    act(() => {
      result.current.completeTask(70);
    });
    expect(result.current.currentTask).toBe('recall');

    act(() => {
      result.current.completeTask(90);
    });

    expect(result.current.isActive).toBe(false);
    expect(result.current.totalScore).toBe(240);
    expect(result.current.results).toHaveLength(3);
  });
});
