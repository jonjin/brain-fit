import React from 'react';
import { Avatar, Box, Flex, Heading, IconButton, Text, VStack } from '@chakra-ui/react';
import { FiLogOut, FiMoon, FiSun } from 'react-icons/fi';
import { useColorMode } from '@chakra-ui/react';

interface HeaderProps {
  user: {
    name: string;
    age: number;
  } | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box bg="white" shadow="sm" px={4} py={3} position="sticky" top={0} zIndex={10}>
      <Flex justify="space-between" align="center">
        <Flex align="center">
          <Avatar name={user?.name} size="sm" mr={3} />
          <VStack align="flex-start" spacing={0}>
            <Heading size="sm">BrainFit 脑健康训练</Heading>
            <Text fontSize="xs" color="gray.500">
              {user ? `${user.name} · ${user.age} 岁` : '欢迎体验认知训练'}
            </Text>
          </VStack>
        </Flex>
        <Flex align="center" gap={2}>
          <IconButton
            aria-label="切换主题"
            size="sm"
            icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
            variant="ghost"
            onClick={toggleColorMode}
          />
          {user && onLogout && (
            <IconButton
              aria-label="退出登录"
              size="sm"
              icon={<FiLogOut />}
              variant="ghost"
              onClick={onLogout}
            />
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default React.memo(Header);
