import React from 'react';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = '加载中，请稍候…' }) => (
  <Box h="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
    <VStack spacing={4}>
      <Spinner size="xl" color="brand.500" thickness="4px" speed="0.8s" />
      <Text color="gray.600">{message}</Text>
    </VStack>
  </Box>
);

export default React.memo(LoadingScreen);
