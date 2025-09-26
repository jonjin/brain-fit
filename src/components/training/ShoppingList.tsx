import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Image,
  Button,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShoppingItem {
  id: string;
  name: string;
  image: string;
  category: string;
}

interface ShoppingListProps {
  items: ShoppingItem[];
  concentration: number;
  onComplete: (score: number) => void;
}

const MotionBox = motion(Box);

const ShoppingList: React.FC<ShoppingListProps> = ({ items, concentration, onComplete }) => {
  const [phase, setPhase] = useState<'display' | 'memorize'>('display');
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [rememberedItems, setRememberedItems] = useState<string[]>([]);

  const visibleItems = useMemo(() => {
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }, [items]);

  const opacity = Math.max(0.3, concentration / 100);

  useEffect(() => {
    if (phase !== 'display') {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setPhase('memorize');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase]);

  const handleItemClick = (itemId: string) => {
    setRememberedItems((prev) => (prev.includes(itemId) ? prev : [...prev, itemId]));
  };

  const handleSubmit = () => {
    const correctCount = rememberedItems.filter((id) => visibleItems.some((item) => item.id === id)).length;
    const score = visibleItems.length ? Math.round((correctCount / visibleItems.length) * 100) : 0;
    onComplete(score);
  };

  return (
    <VStack spacing={4} p={6} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="lg" fontWeight="bold">
          {phase === 'display' ? '记住这些物品' : '选择你记得的物品'}
        </Text>
        {phase === 'display' && (
          <Text fontSize="sm" color="gray.500">
            剩余时间：{timeRemaining} 秒
          </Text>
        )}
      </HStack>

      {phase === 'display' ? (
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          <AnimatePresence>
            {visibleItems.map((item) => (
              <GridItem key={item.id}>
                <MotionBox
                  bg="gray.100"
                  rounded="lg"
                  p={3}
                  textAlign="center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image src={item.image} alt={item.name} boxSize="60px" mx="auto" mb={2} />
                  <Text fontSize="xs" fontWeight="medium">
                    {item.name}
                  </Text>
                </MotionBox>
              </GridItem>
            ))}
          </AnimatePresence>
        </Grid>
      ) : (
        <VStack spacing={4} align="stretch">
          <Grid templateColumns="repeat(3, 1fr)" gap={3}>
            {items.map((item) => {
              const selected = rememberedItems.includes(item.id);
              return (
                <GridItem key={item.id}>
                  <Box
                    bg={selected ? 'green.100' : 'gray.100'}
                    rounded="lg"
                    p={3}
                    textAlign="center"
                    cursor="pointer"
                    onClick={() => handleItemClick(item.id)}
                    transition="transform 0.2s"
                    _hover={{ transform: 'scale(1.05)' }}
                  >
                    <Image src={item.image} alt={item.name} boxSize="50px" mx="auto" mb={2} />
                    <Text fontSize="xs">{item.name}</Text>
                  </Box>
                </GridItem>
              );
            })}
          </Grid>
          <Button colorScheme="blue" onClick={handleSubmit}>
            提交答案
          </Button>
        </VStack>
      )}
    </VStack>
  );
};

export default React.memo(ShoppingList);
