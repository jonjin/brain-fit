import React from 'react';
import { Flex, Icon, Text, VStack } from '@chakra-ui/react';
import { FiHome, FiActivity, FiClipboard, FiTrendingUp, FiSettings } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

interface TabItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const tabs: TabItem[] = [
  { label: '首页', icon: FiHome, path: '/' },
  { label: '训练', icon: FiActivity, path: '/training' },
  { label: '评估', icon: FiClipboard, path: '/assessment' },
  { label: '进度', icon: FiTrendingUp, path: '/progress' },
  { label: '设置', icon: FiSettings, path: '/settings' },
];

const TabBar: React.FC = () => {
  return (
    <Flex
      as="nav"
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="white"
      borderTop="1px solid"
      borderColor="gray.100"
      py={2}
      justify="space-around"
      zIndex={10}
    >
      {tabs.map((tab) => (
        <VStack
          key={tab.path}
          as={NavLink}
          to={tab.path}
          spacing={1}
          align="center"
          fontSize="xs"
          color="gray.500"
          _activeLink={{ color: 'brand.500' }}
          style={{ textDecoration: 'none' }}
        >
          <Icon as={tab.icon} boxSize={5} />
          <Text>{tab.label}</Text>
        </VStack>
      ))}
    </Flex>
  );
};

export default React.memo(TabBar);
