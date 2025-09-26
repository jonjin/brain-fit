import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Textarea,
  useToast,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';

interface RBMTQuestion {
  id: string;
  type: string;
  instruction: string;
  checkTime: number;
}

interface RBMTTestProps {
  questions: RBMTQuestion[];
  onComplete: (score: number, notes: string) => void;
}

const RBMTTest: React.FC<RBMTTestProps> = ({ questions, onComplete }) => {
  const [notes, setNotes] = useState('');
  const toast = useToast();

  const handleComplete = () => {
    const score = notes.trim().length > 0 ? 90 : 60;
    onComplete(score, notes);
    toast({
      title: '已记录 RBMT 评估',
      description: `分数估计：${score}`,
      status: 'success',
      duration: 2000,
    });
    setNotes('');
  };

  return (
    <VStack spacing={4} align="stretch">
      {questions.map((question) => (
        <Box key={question.id} bg="gray.50" p={4} rounded="md">
          <Heading size="sm" mb={2}>
            日常记忆任务
          </Heading>
          <Text fontSize="sm" color="gray.600">
            {question.instruction}
          </Text>
          <Text fontSize="xs" color="gray.500" mt={2}>
            评估时间：{Math.round(question.checkTime / 60)} 分钟后
          </Text>
        </Box>
      ))}
      <FormControl>
        <FormLabel fontSize="sm">评估记录</FormLabel>
        <Textarea
          placeholder="记录受试者的表现、提示语和回忆情况"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={4}
        />
      </FormControl>
      <Button colorScheme="blue" onClick={handleComplete}>
        保存 RBMT 评估
      </Button>
    </VStack>
  );
};

export default React.memo(RBMTTest);
