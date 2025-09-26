import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  RadioGroup,
  Radio,
  Stack,
  HStack,
  Badge,
} from '@chakra-ui/react';

interface DigitSpanQuestion {
  id: string;
  type: 'digit_span';
  instruction: string;
  sequence: string;
  timeLimit: number;
}

interface WordListQuestion {
  id: string;
  type: 'word_list';
  instruction: string;
  words: string[];
  displayTime: number;
  recallDelay: number;
}

interface PictureNamingQuestion {
  id: string;
  type: 'picture_naming';
  instruction: string;
  image: string;
  correctAnswer: string;
}

interface RBANSQuestions {
  attention: DigitSpanQuestion[];
  memory: WordListQuestion[];
  language: PictureNamingQuestion[];
}

interface RBANSTestProps {
  questions: RBANSQuestions;
  onComplete: (score: number) => void;
}

const RBANSTest: React.FC<RBANSTestProps> = ({ questions, onComplete }) => {
  const [selectedAttention, setSelectedAttention] = useState<string>('partial');
  const [selectedMemory, setSelectedMemory] = useState<string>('partial');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('partial');

  const handleSubmit = () => {
    const mapping: Record<string, number> = {
      fail: 40,
      partial: 70,
      success: 95,
    };
    const total = Math.round(
      (mapping[selectedAttention] + mapping[selectedMemory] + mapping[selectedLanguage]) / 3
    );
    onComplete(total);
  };

  return (
    <VStack spacing={5} align="stretch">
      <Box>
        <Heading size="md" mb={2}>
          注意力测试
        </Heading>
        {questions.attention.map((question) => (
          <VStack key={question.id} align="stretch" spacing={3} bg="gray.50" p={4} rounded="md">
            <Text fontWeight="medium">{question.instruction}</Text>
            <Badge colorScheme="purple">序列：{question.sequence}</Badge>
            <Text fontSize="sm" color="gray.600">
              限时 {question.timeLimit} 秒
            </Text>
            <RadioGroup value={selectedAttention} onChange={setSelectedAttention}>
              <Stack direction="row" spacing={4}>
                <Radio value="fail">未完成</Radio>
                <Radio value="partial">部分完成</Radio>
                <Radio value="success">完全正确</Radio>
              </Stack>
            </RadioGroup>
          </VStack>
        ))}
      </Box>

      <Box>
        <Heading size="md" mb={2}>
          记忆测试
        </Heading>
        {questions.memory.map((question) => (
          <VStack key={question.id} align="stretch" spacing={3} bg="gray.50" p={4} rounded="md">
            <Text fontWeight="medium">{question.instruction}</Text>
            <HStack spacing={2} wrap="wrap">
              {question.words.map((word) => (
                <Badge key={word} colorScheme="blue">
                  {word}
                </Badge>
              ))}
            </HStack>
            <Text fontSize="sm" color="gray.600">
              展示 {question.displayTime} 秒，延迟 {Math.round(question.recallDelay / 60)} 分钟
            </Text>
            <RadioGroup value={selectedMemory} onChange={setSelectedMemory}>
              <Stack direction="row" spacing={4}>
                <Radio value="fail">未记住</Radio>
                <Radio value="partial">记住部分</Radio>
                <Radio value="success">全部记住</Radio>
              </Stack>
            </RadioGroup>
          </VStack>
        ))}
      </Box>

      <Box>
        <Heading size="md" mb={2}>
          语言功能
        </Heading>
        {questions.language.map((question) => (
          <VStack key={question.id} align="stretch" spacing={3} bg="gray.50" p={4} rounded="md">
            <Text fontWeight="medium">{question.instruction}</Text>
            <Text fontSize="sm" color="gray.600">
              正确答案：{question.correctAnswer}
            </Text>
            <RadioGroup value={selectedLanguage} onChange={setSelectedLanguage}>
              <Stack direction="row" spacing={4}>
                <Radio value="fail">未命中</Radio>
                <Radio value="partial">提示后完成</Radio>
                <Radio value="success">一次成功</Radio>
              </Stack>
            </RadioGroup>
          </VStack>
        ))}
      </Box>

      <Button colorScheme="blue" onClick={handleSubmit}>
        记录本次 RBANS 结果
      </Button>
    </VStack>
  );
};

export default React.memo(RBANSTest);
