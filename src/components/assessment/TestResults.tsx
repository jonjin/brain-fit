import React from 'react';
import { Box, HStack, Stat, StatLabel, StatNumber, VStack, Text } from '@chakra-ui/react';

interface TestResultsProps {
  rbansScore: number | null;
  rbmtScore: number | null;
  notes?: string;
}

const TestResults: React.FC<TestResultsProps> = ({ rbansScore, rbmtScore, notes }) => (
  <VStack spacing={4} align="stretch">
    <HStack spacing={4} align="stretch">
      <Stat bg="gray.50" p={4} rounded="md">
        <StatLabel>RBANS 综合得分</StatLabel>
        <StatNumber>{rbansScore ?? '--'}</StatNumber>
      </Stat>
      <Stat bg="gray.50" p={4} rounded="md">
        <StatLabel>RBMT 记忆指数</StatLabel>
        <StatNumber>{rbmtScore ?? '--'}</StatNumber>
      </Stat>
    </HStack>
    {notes && (
      <Box bg="gray.50" p={4} rounded="md">
        <Text fontWeight="medium" mb={2}>
          评估摘要
        </Text>
        <Text fontSize="sm" color="gray.600">
          {notes}
        </Text>
      </Box>
    )}
  </VStack>
);

export default React.memo(TestResults);
