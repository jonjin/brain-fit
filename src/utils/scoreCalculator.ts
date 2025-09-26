interface TaskScoreInput {
  accuracy: number;
  speed: number;
  concentration: number;
}

export function calculateTaskScore({ accuracy, speed, concentration }: TaskScoreInput): number {
  const weighted = accuracy * 0.6 + speed * 0.2 + concentration * 0.2;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function calculateSessionSummary(scores: number[]) {
  if (!scores.length) {
    return {
      averageScore: 0,
      bestScore: 0,
      sessionsCompleted: 0,
    };
  }

  const bestScore = Math.max(...scores);
  const averageScore = Math.round(scores.reduce((acc, value) => acc + value, 0) / scores.length);

  return {
    averageScore,
    bestScore,
    sessionsCompleted: scores.length,
  };
}
