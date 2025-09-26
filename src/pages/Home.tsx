import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Stack,
  HStack,
  Icon,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiActivity, FiClock, FiTrendingUp } from 'react-icons/fi';
import trainingData from '../data/trainingData.json';
import useLocalStorage from '../hooks/useLocalStorage';

interface HomeProps {
  user: {
    id: string;
    name: string;
    age: number;
  } | null;
  onProfileUpdate: (payload: { id: string; name: string; age: number }) => void;
}

const Home: React.FC<HomeProps> = ({ user, onProfileUpdate }) => {
  const [lastSession, setLastSession] = useLocalStorage<string | null>('brainFitLastSession', null);
  const cardBg = useColorModeValue('white', 'gray.800');

  const handleQuickStart = () => {
    const profile =
      user ?? {
        id: 'user-001',
        name: '新用户',
        age: 68,
      };
    onProfileUpdate(profile);
    setLastSession(new Date().toISOString());
  };

  return (
    <VStack spacing={5} align="stretch">
      <Box bg={cardBg} p={5} rounded="lg" shadow="sm">
        <Heading size="md">欢迎回来{user ? `，${user.name}` : ''}</Heading>
        <Text mt={2} color="gray.600" fontSize="sm">
          本周建议完成 {trainingData.trainingSchedule.sessionsPerWeek} 次训练，每次约 {trainingData.trainingSchedule.sessionDuration} 分钟。
        </Text>
        <Button mt={4} colorScheme="blue" onClick={handleQuickStart}>
          开始今日训练
        </Button>
      </Box>

      <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
        <Box flex={1} bg={cardBg} p={4} rounded="lg" shadow="sm">
          <HStack mb={2} spacing={2}>
            <Icon as={FiClock} />
            <Heading size="sm">训练计划</Heading>
          </HStack>
          <Text fontSize="sm" color="gray.600">
            共有 {trainingData.trainingSchedule.totalWeeks} 周训练周期，目前处于第 1 周。
          </Text>
          <Badge mt={3} colorScheme="blue">
            下一次训练：周三 15:00
          </Badge>
        </Box>
        <Box flex={1} bg={cardBg} p={4} rounded="lg" shadow="sm">
          <HStack mb={2} spacing={2}>
            <Icon as={FiTrendingUp} />
            <Heading size="sm">最近进展</Heading>
          </HStack>
          <Text fontSize="sm" color="gray.600">
            最近一次训练得分提升 5%，平均专注度 72%。
          </Text>
          {lastSession && (
            <Text fontSize="xs" color="gray.500" mt={2}>
              上次训练：{new Date(lastSession).toLocaleString()}
            </Text>
          )}
        </Box>
      </Stack>

      <Box bg={cardBg} p={4} rounded="lg" shadow="sm">
        <HStack mb={3} spacing={2}>
          <Icon as={FiActivity} />
          <Heading size="sm">今日任务</Heading>
        </HStack>
        <Stack spacing={3} fontSize="sm" color="gray.600">
          <Text>1. 购物清单记忆训练</Text>
          <Text>2. 卡片匹配注意力训练</Text>
          <Text>3. 延迟回想测试</Text>
        </Stack>
      </Box>
    </VStack>
  );
};

export default React.memo(Home);
