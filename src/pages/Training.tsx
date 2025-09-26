import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  Progress as ChakraProgress,
  useToast,
  Badge,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { FiBluetooth, FiTarget } from 'react-icons/fi';
import ShoppingList from '../components/training/ShoppingList';
import CardMatching from '../components/training/CardMatching';
import RecallTask from '../components/training/RecallTask';
import ConcentrationMeter from '../components/training/ConcentrationMeter';
import useEEG from '../hooks/useEEG';
import trainingDataJson from '../data/trainingData.json';
import { calculateSessionSummary } from '../utils/scoreCalculator';

interface TrainingData {
  shoppingItems: { id: string; name: string; image: string; category: string }[];
  cardSets: {
    id: string;
    difficulty: string;
    cards: { id: string; content: string; pair: string }[];
  }[];
  trainingSchedule: {
    sessionsPerWeek: number;
    sessionDuration: number;
    totalWeeks: number;
  };
}

const trainingData = trainingDataJson as TrainingData;

const Training: React.FC = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentTask, setCurrentTask] = useState<'shopping' | 'cards' | 'recall'>('shopping');
  const [sessionTime, setSessionTime] = useState(0);
  const [concentration, setConcentration] = useState(0);
  const [sessionScores, setSessionScores] = useState<number[]>([]);
  const [averageConcentration, setAverageConcentration] = useState(0);

  const { isConnected, connectDevice, eegData } = useEEG();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (eegData) {
      const newConcentration = Math.min(100, Math.max(0, Math.round(eegData.attention * 100)));
      setConcentration(newConcentration);
      setAverageConcentration((prev) => Math.round((prev + newConcentration) / 2));
    }
  }, [eegData]);

  const handleTaskComplete = useCallback(
    (score: number) => {
      setSessionScores((prev) => [...prev, score]);

      if (currentTask === 'shopping') {
        setCurrentTask('cards');
        toast({
          title: '购物清单完成！',
          description: `得分：${score}`,
          status: 'success',
          duration: 2000,
        });
      } else if (currentTask === 'cards') {
        setCurrentTask('recall');
      } else {
        onOpen();
      }
    },
    [currentTask, onOpen, toast]
  );

  const totalScore = useMemo(() => sessionScores.reduce((sum, value) => sum + value, 0), [sessionScores]);
  const progressValue = currentTask === 'shopping' ? 33 : currentTask === 'cards' ? 66 : 100;

  const sessionSummary = calculateSessionSummary(sessionScores);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <VStack spacing={4} align="stretch">
      <HStack justify="space-between" bg="white" p={4} rounded="lg" shadow="sm">
        <HStack>
          <Icon as={FiBluetooth} color={isConnected ? 'green.500' : 'gray.400'} />
          <Text fontSize="sm">{isConnected ? 'EEG 已连接' : '设备未连接'}</Text>
        </HStack>
        {!isConnected && (
          <Button size="sm" colorScheme="blue" onClick={connectDevice}>
            连接设备
          </Button>
        )}
      </HStack>

      <Box bg="white" p={4} rounded="lg" shadow="sm">
        <HStack justify="space-between" mb={3} align="flex-start">
          <VStack align="flex-start" spacing={1}>
            <Text fontSize="xs" color="gray.500">
              训练时长
            </Text>
            <Text fontSize="lg" fontWeight="bold">
              {formatTime(sessionTime)}
            </Text>
          </VStack>
          <VStack align="center" spacing={1}>
            <Text fontSize="xs" color="gray.500">
              当前任务
            </Text>
            <Badge colorScheme="purple" fontSize="md" px={3} py={1} rounded="full">
              {currentTask === 'shopping' ? '购物清单' : currentTask === 'cards' ? '卡片匹配' : '记忆回想'}
            </Badge>
          </VStack>
          <VStack align="flex-end" spacing={1}>
            <Text fontSize="xs" color="gray.500">
              总得分
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="green.500">
              {totalScore}
            </Text>
          </VStack>
        </HStack>
        <ConcentrationMeter concentration={concentration} />
      </Box>

      <Box bg="white" p={4} rounded="lg" shadow="sm">
        <HStack mb={2} spacing={2}>
          <Icon as={FiTarget} color="blue.500" />
          <Text fontSize="sm" fontWeight="medium">
            任务进度
          </Text>
        </HStack>
        <ChakraProgress value={progressValue} colorScheme="blue" rounded="full" size="sm" />
      </Box>

      <Box bg="white" rounded="lg" shadow="sm" overflow="hidden">
        {currentTask === 'shopping' && (
          <ShoppingList
            items={trainingData.shoppingItems}
            concentration={concentration}
            onComplete={handleTaskComplete}
          />
        )}
        {currentTask === 'cards' && (
          <CardMatching cards={trainingData.cardSets[0]} concentration={concentration} onComplete={handleTaskComplete} />
        )}
        {currentTask === 'recall' && (
          <RecallTask items={trainingData.shoppingItems} onComplete={handleTaskComplete} />
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent mx={4} pb={4}>
          <ModalHeader>训练完成！</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} py={2}>
              <Text fontSize="3xl" fontWeight="bold" color="green.500">
                {totalScore} 分
              </Text>
              <Text>训练时长：{formatTime(sessionTime)}</Text>
              <Text>平均专注度：{averageConcentration}%</Text>
              <VStack spacing={1} fontSize="sm" color="gray.600">
                <Text>平均得分：{sessionSummary.averageScore}</Text>
                <Text>最佳表现：{sessionSummary.bestScore}</Text>
                <Text>完成任务数：{sessionSummary.sessionsCompleted}</Text>
              </VStack>
              <Button colorScheme="blue" width="full" onClick={onClose}>
                查看详细报告
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default React.memo(Training);
