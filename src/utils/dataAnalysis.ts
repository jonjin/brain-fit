interface SessionSummary {
  date: string;
  duration: number;
  score: number;
  averageConcentration: number;
}

interface NetworkNode {
  id: string;
  label: string;
  strength: number;
}

interface NetworkLink {
  source: string;
  target: string;
  value: number;
}

interface ProgressData {
  sessions: SessionSummary[];
  network: {
    nodes: NetworkNode[];
    links: NetworkLink[];
  };
}

export interface TrendPoint {
  date: string;
  score: number;
  concentration: number;
}

export function buildTrendSeries(progress: ProgressData): TrendPoint[] {
  return progress.sessions.map((session) => ({
    date: session.date,
    score: session.score,
    concentration: Math.round(session.averageConcentration * 100),
  }));
}

export function estimateImprovementRate(progress: ProgressData): number {
  if (progress.sessions.length < 2) {
    return 0;
  }

  const sorted = [...progress.sessions].sort((a, b) => a.date.localeCompare(b.date));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const daysBetween = (new Date(last.date).getTime() - new Date(first.date).getTime()) / (1000 * 60 * 60 * 24);
  if (daysBetween <= 0) {
    return 0;
  }

  const improvement = last.score - first.score;
  return Math.round((improvement / daysBetween) * 10) / 10;
}

export function normalizeNetworkStrength(nodes: NetworkNode[]): NetworkNode[] {
  const maxStrength = Math.max(...nodes.map((node) => node.strength), 1);
  return nodes.map((node) => ({
    ...node,
    strength: Math.round((node.strength / maxStrength) * 100) / 100,
  }));
}
