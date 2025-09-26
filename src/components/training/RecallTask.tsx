import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Text,
  HStack,
  Tag,
  Input,
  Button,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react';

interface RecallItem {
  id: string;
  name: string;
}

interface RecallTaskProps {
  items: RecallItem[];
  onComplete: (score: number) => void;
}

const DISPLAY_DURATION = 20; // seconds

const RecallTask: React.FC<RecallTaskProps> = ({ items, onComplete }) => {
  const [phase, setPhase] = useState<'study' | 'recall'>('study');
  const [timeRemaining, setTimeRemaining] = useState(DISPLAY_DURATION);
  const [answers, setAnswers] = useState<string[]>(['', '', '', '', '']);
  const toast = useToast();

  const studyItems = items.slice(0, 5);

  useEffect(() => {
    if (phase !== 'study') {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setPhase('recall');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase]);

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers((prev) => {
      const clone = [...prev];
      clone[index] = value;
      return clone;
    });
  };

  const handleSubmit = () => {
    const normalizedAnswers = answers.map((answer) => answer.trim());
    const correct = normalizedAnswers.filter((answer) =>
      studyItems.some((item) => item.name === answer)
    );
    const score = Math.round((correct.length / studyItems.length) * 100);

    toast({
      title: '回想任务完成',
      description: `正确项目：${correct.length} / ${studyItems.length}`,
      status: 'success',
      duration: 2000,
    });

    onComplete(score);
  };

  return (
    <VStack spacing={6} p={6} align="stretch">
      {phase === 'study' ? (
        <Box>
          <HStack justify="space-between" mb={4}>
            <Text fontSize="lg" fontWeight="bold">
              记忆回想训练
            </Text>
            <Text fontSize="sm" color="gray.500">
              剩余时间：{timeRemaining} 秒
            </Text>
          </HStack>
          <SimpleGrid columns={2} spacing={3}>
            {studyItems.map((item) => (
              <Tag key={item.id} size="lg" justifyContent="center" py={3}>
                {item.name}
              </Tag>
            ))}
          </SimpleGrid>
        </Box>
      ) : (
        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            输入你记得的物品名称
          </Text>
          <VStack spacing={3} align="stretch">
            {answers.map((answer, index) => (
              <Input
                key={index}
                placeholder={`记忆物品 ${index + 1}`}
                value={answer}
                onChange={(event) => handleAnswerChange(index, event.target.value)}
              />
            ))}
          </VStack>
          <Button mt={6} colorScheme="blue" onClick={handleSubmit}>
            提交答案
          </Button>
        </Box>
      )}
    </VStack>
  );
};

export default React.memo(RecallTask);
