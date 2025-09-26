import React from 'react';
import { CircularProgress, CircularProgressLabel, Text, VStack } from '@chakra-ui/react';

interface ConcentrationMeterProps {
  concentration: number;
}

const ConcentrationMeter: React.FC<ConcentrationMeterProps> = ({ concentration }) => {
  const getLabel = () => {
    if (concentration < 30) return '需要集中';
    if (concentration < 60) return '良好';
    return '优秀';
  };

  const getColor = () => {
    if (concentration < 30) return 'red.400';
    if (concentration < 60) return 'yellow.400';
    return 'green.400';
  };

  return (
    <VStack spacing={2} py={4}>
      <Text fontSize="sm" color="gray.600" fontWeight="medium">
        专注度水平
      </Text>
      <CircularProgress
        value={concentration}
        size="120px"
        thickness="12px"
        color={getColor()}
        trackColor="gray.200"
      >
        <CircularProgressLabel>
          <VStack spacing={0}>
            <Text fontSize="2xl" fontWeight="bold">
              {Math.round(concentration)}%
            </Text>
            <Text fontSize="xs" color="gray.500">
              {getLabel()}
            </Text>
          </VStack>
        </CircularProgressLabel>
      </CircularProgress>
    </VStack>
  );
};

export default React.memo(ConcentrationMeter);
