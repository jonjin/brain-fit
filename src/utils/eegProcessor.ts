import { EEGData } from '../hooks/useEEG';

export interface ProcessedEEGMetrics {
  attentionTrend: number[];
  meditationTrend: number[];
  averageAttention: number;
  calmnessIndex: number;
}

export function processEEGStream(history: EEGData[], windowSize = 30): ProcessedEEGMetrics {
  const recentEntries = history.slice(-windowSize);
  const attentionTrend = recentEntries.map((data) => Math.round(data.attention * 100));
  const meditationTrend = recentEntries.map((data) => Math.round(data.meditation * 100));

  const averageAttention = attentionTrend.length
    ? attentionTrend.reduce((acc, value) => acc + value, 0) / attentionTrend.length
    : 0;

  const calmnessIndex = meditationTrend.length
    ? meditationTrend.reduce((acc, value) => acc + value, 0) / meditationTrend.length
    : 0;

  return {
    attentionTrend,
    meditationTrend,
    averageAttention: Math.round(averageAttention),
    calmnessIndex: Math.round(calmnessIndex),
  };
}

export function calculateCognitiveLoad(sample: EEGData): number {
  const { beta, gamma, alpha } = sample;
  const loadScore = beta * 0.5 + gamma * 0.3 - alpha * 0.2;
  return Math.min(100, Math.max(0, Math.round(loadScore * 100)));
}
