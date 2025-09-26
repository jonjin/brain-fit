import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type TaskId = 'shopping' | 'cards' | 'recall';

interface TaskResult {
  id: TaskId;
  score: number;
  completedAt: number;
}

const TASK_FLOW: TaskId[] = ['shopping', 'cards', 'recall'];

const useTrainingSession = () => {
  const [isActive, setIsActive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [results, setResults] = useState<TaskResult[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    timerRef.current = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isActive]);

  const currentTask = TASK_FLOW[currentTaskIndex];

  const start = useCallback(() => {
    setIsActive(true);
    setElapsedSeconds(0);
    setCurrentTaskIndex(0);
    setResults([]);
  }, []);

  const completeTask = useCallback((score: number) => {
    setResults((prev) => [
      ...prev,
      {
        id: TASK_FLOW[currentTaskIndex],
        score,
        completedAt: Date.now(),
      },
    ]);

    if (currentTaskIndex < TASK_FLOW.length - 1) {
      setCurrentTaskIndex((prev) => prev + 1);
    } else {
      setIsActive(false);
    }
  }, [currentTaskIndex]);

  const totalScore = useMemo(() => results.reduce((acc, item) => acc + item.score, 0), [results]);

  return {
    isActive,
    elapsedSeconds,
    currentTask,
    totalScore,
    results,
    start,
    completeTask,
  };
};

export type { TaskId, TaskResult };
export default useTrainingSession;
