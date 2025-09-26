import React, { useState } from 'react';
import {
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Button,
  useToast,
  Divider,
  Box,
} from '@chakra-ui/react';
import useLocalStorage from '../hooks/useLocalStorage';

interface SettingsProps {
  user: {
    id: string;
    name: string;
    age: number;
  } | null;
  onProfileUpdate: (payload: { id: string; name: string; age: number }) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onProfileUpdate }) => {
  const toast = useToast();
  const [notifications, setNotifications] = useLocalStorage('brainFitNotifications', true);
  const [offlineMode, setOfflineMode] = useLocalStorage('brainFitOfflineMode', true);

  const [name, setName] = useState(user?.name ?? '');
  const [age, setAge] = useState(user?.age?.toString() ?? '');

  const handleSaveProfile = () => {
    const ageNumber = Number(age);
    if (!name || Number.isNaN(ageNumber)) {
      toast({
        title: '请填写完整信息',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    onProfileUpdate({
      id: user?.id ?? 'user-001',
      name,
      age: ageNumber,
    });

    toast({
      title: '资料已更新',
      status: 'success',
      duration: 2000,
    });
  };

  const handleResetData = () => {
    localStorage.removeItem('brainFitUserData');
    toast({
      title: '本地数据已清除',
      description: '重新登录或创建新档案后继续使用',
      status: 'info',
      duration: 3000,
    });
  };

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="md">偏好设置</Heading>
      <Text fontSize="sm" color="gray.600">
        配置账号与训练偏好，BrainFit 将根据您的设置调整认知训练节奏。
      </Text>

      <Box bg="white" p={4} rounded="lg" shadow="sm">
        <Heading size="sm" mb={4}>
          个人资料
        </Heading>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel fontSize="sm">姓名</FormLabel>
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="请输入姓名" />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm">年龄</FormLabel>
            <Input
              type="number"
              value={age}
              onChange={(event) => setAge(event.target.value)}
              placeholder="请输入年龄"
            />
          </FormControl>
          <Button colorScheme="blue" onClick={handleSaveProfile}>
            保存资料
          </Button>
        </VStack>
      </Box>

      <Box bg="white" p={4} rounded="lg" shadow="sm">
        <Heading size="sm" mb={4}>
          功能设置
        </Heading>
        <VStack spacing={4} align="stretch">
          <FormControl display="flex" alignItems="center" justifyContent="space-between">
            <FormLabel htmlFor="notifications" mb="0" fontSize="sm">
              训练提醒通知
            </FormLabel>
            <Switch
              id="notifications"
              isChecked={notifications}
              onChange={(event) => setNotifications(event.target.checked)}
            />
          </FormControl>
          <FormControl display="flex" alignItems="center" justifyContent="space-between">
            <FormLabel htmlFor="offline" mb="0" fontSize="sm">
              离线模式（自动保存本地数据）
            </FormLabel>
            <Switch id="offline" isChecked={offlineMode} onChange={(event) => setOfflineMode(event.target.checked)} />
          </FormControl>
        </VStack>
      </Box>

      <Divider />

      <Button variant="outline" colorScheme="red" onClick={handleResetData}>
        清除本地数据
      </Button>
    </VStack>
  );
};

export default React.memo(Settings);
