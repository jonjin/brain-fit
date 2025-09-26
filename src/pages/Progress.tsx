import React, { useMemo } from 'react';
import { VStack, Heading, Text, Box, Stat, StatLabel, StatNumber, HStack } from '@chakra-ui/react';
import ProgressChart from '../components/dashboard/ProgressChart';
import NetworkVisualization from '../components/dashboard/NetworkVisualization';
import SessionCalendar from '../components/dashboard/SessionCalendar';
import progressJson from '../data/userProgress.json';
import { buildTrendSeries, estimateImprovementRate, normalizeNetworkStrength } from '../utils/dataAnalysis';

interface ProgressData {
  sessions: {
    id: string;
    date: string;
    duration: number;
    score: number;
    averageConcentration: number;
  }[];
  network: {
    nodes: {
      id: string;
      label: string;
      strength: number;
    }[];
    links: {
      source: string;
      target: string;
      value: number;
    }[];
  };
}

const data = progressJson as ProgressData;

const Progress: React.FC = () => {
  const trendSeries = useMemo(() => buildTrendSeries(data), []);
  const improvementRate = useMemo(() => estimateImprovementRate(data), []);
  const normalizedNodes = useMemo(() => normalizeNetworkStrength(data.network.nodes), []);

  const averageScore = Math.round(
    data.sessions.reduce((sum, session) => sum + session.score, 0) / data.sessions.length
  );

  const averageConcentration = Math.round(
    (data.sessions.reduce((sum, session) => sum + session.averageConcentration, 0) /
      data.sessions.length) *
      100
  );

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="md">训练进度与脑网络</Heading>
      <Text fontSize="sm" color="gray.600">
        跟踪训练表现、专注度以及功能网络的变化趋势，帮助评估认知训练效果。
      </Text>

      <HStack spacing={4} align="stretch">
        <Stat bg="white" p={4} rounded="lg" shadow="sm">
          <StatLabel>平均训练得分</StatLabel>
          <StatNumber>{averageScore}</StatNumber>
        </Stat>
        <Stat bg="white" p={4} rounded="lg" shadow="sm">
          <StatLabel>平均专注度</StatLabel>
          <StatNumber>{averageConcentration}%</StatNumber>
        </Stat>
        <Stat bg="white" p={4} rounded="lg" shadow="sm">
          <StatLabel>得分改善率</StatLabel>
          <StatNumber>{improvementRate} 分/天</StatNumber>
        </Stat>
      </HStack>

      <Box bg="white" p={4} rounded="lg" shadow="sm">
        <Heading size="sm" mb={4}>
          训练趋势
        </Heading>
        <ProgressChart data={trendSeries} />
      </Box>

      <Box bg="white" p={4} rounded="lg" shadow="sm">
        <Heading size="sm" mb={4}>
          脑网络变化
        </Heading>
        <NetworkVisualization nodes={normalizedNodes} links={data.network.links} />
      </Box>

      <Box bg="white" p={4} rounded="lg" shadow="sm">
        <SessionCalendar sessions={data.sessions} />
      </Box>
    </VStack>
  );
};

export default React.memo(Progress);
