import React from 'react';
import { Box, HStack, Text, VStack, Progress } from '@chakra-ui/react';

interface NetworkNode {
  id: string;
  label: string;
  strength: number;
}

interface NetworkLink {
  source: string;
  target: string;
  value: number;
}

interface NetworkVisualizationProps {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

const NetworkVisualization: React.FC<NetworkVisualizationProps> = ({ nodes, links }) => (
  <VStack spacing={4} align="stretch">
    <Box bg="gray.50" p={4} rounded="md">
      <Text fontWeight="medium" mb={3}>
        功能网络节点
      </Text>
      <VStack spacing={3} align="stretch">
        {nodes.map((node) => (
          <Box key={node.id}>
            <HStack justify="space-between" mb={1}>
              <Text fontSize="sm">{node.label}</Text>
              <Text fontSize="xs" color="gray.500">
                强度 {Math.round(node.strength * 100)}%
              </Text>
            </HStack>
            <Progress value={node.strength * 100} colorScheme="blue" size="sm" rounded="full" />
          </Box>
        ))}
      </VStack>
    </Box>
    <Box bg="gray.50" p={4} rounded="md">
      <Text fontWeight="medium" mb={3}>
        网络连接强度
      </Text>
      <VStack spacing={2} align="stretch">
        {links.map((link) => (
          <Text key={`${link.source}-${link.target}`} fontSize="sm" color="gray.600">
            {link.source} ↔ {link.target} · {Math.round(link.value * 100)}%
          </Text>
        ))}
      </VStack>
    </Box>
  </VStack>
);

export default React.memo(NetworkVisualization);
