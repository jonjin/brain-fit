import React, { useEffect, useMemo, useState } from 'react';
import { Box, Grid, GridItem, Text, VStack, Button, HStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface Card {
  id: string;
  content: string;
  pair: string;
}

interface CardSet {
  id: string;
  difficulty: string;
  cards: Card[];
}

interface CardMatchingProps {
  cards: CardSet;
  concentration: number;
  onComplete: (score: number) => void;
}

const MotionBox = motion(Box);

type ActiveCard = Card & { index: number };

const CardMatching: React.FC<CardMatchingProps> = ({ cards, concentration, onComplete }) => {
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedCards, setMatchedCards] = useState<string[]>([]);
  const [activeCards, setActiveCards] = useState<ActiveCard[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [isComplete, setIsComplete] = useState(false);

  const shuffledCards = useMemo(() => {
    return [...cards.cards].sort(() => Math.random() - 0.5);
  }, [cards.cards]);

  useEffect(() => {
    if (isComplete) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  useEffect(() => {
    if (activeCards.length === 2) {
      const [first, second] = activeCards;
      setAttempts((prev) => prev + 1);

      if (first.id === second.pair || second.id === first.pair) {
        setMatchedCards((prev) => [...prev, first.id, second.id]);
        setActiveCards([]);
      } else {
        const timeout = window.setTimeout(() => {
          setFlippedCards((prev) => prev.filter((id) => id !== first.id && id !== second.id));
          setActiveCards([]);
        }, 800);
        return () => window.clearTimeout(timeout);
      }
    }

    if (matchedCards.length === shuffledCards.length && shuffledCards.length > 0 && !isComplete) {
      handleComplete();
    }

    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCards, matchedCards, shuffledCards.length]);

  const handleCardClick = (card: Card, index: number) => {
    if (isComplete) {
      return;
    }

    if (flippedCards.includes(card.id) || matchedCards.includes(card.id) || activeCards.length === 2) {
      return;
    }

    setFlippedCards((prev) => [...prev, card.id]);
    setActiveCards((prev) => [...prev, { ...card, index }]);
  };

  const handleComplete = () => {
    if (isComplete) {
      return;
    }

    setIsComplete(true);
    const accuracy = shuffledCards.length ? matchedCards.length / shuffledCards.length : 0;
    const focusModifier = concentration / 100;
    const attemptEfficiency = attempts ? Math.min(1, shuffledCards.length / (attempts * 2)) : 1;
    const timeEfficiency = Math.min(1, timeRemaining / 120 + 0.2);
    const score = Math.round((accuracy * 0.5 + focusModifier * 0.3 + attemptEfficiency * 0.1 + timeEfficiency * 0.1) * 100);
    onComplete(score);
  };

  const resetGame = () => {
    setFlippedCards([]);
    setMatchedCards([]);
    setActiveCards([]);
    setAttempts(0);
    setTimeRemaining(120);
    setIsComplete(false);
  };

  return (
    <VStack spacing={4} p={6} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="lg" fontWeight="bold">
          卡片匹配训练
        </Text>
        <Text fontSize="sm" color="gray.500">
          剩余时间：{timeRemaining} 秒
        </Text>
      </HStack>
      <Grid templateColumns="repeat(4, 1fr)" gap={3}>
        {shuffledCards.map((card, index) => {
          const isFlipped = flippedCards.includes(card.id) || matchedCards.includes(card.id);
          return (
            <GridItem key={`${card.id}-${index}`}>
              <MotionBox
                onClick={() => handleCardClick(card, index)}
                bg={isFlipped ? 'blue.100' : 'gray.100'}
                rounded="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="70px"
                cursor="pointer"
                whileTap={{ scale: 0.95 }}
              >
                <Text fontSize="2xl">{isFlipped ? card.content : '?'}</Text>
              </MotionBox>
            </GridItem>
          );
        })}
      </Grid>
      <Button variant="outline" onClick={resetGame}>
        重新开始
      </Button>
    </VStack>
  );
};

export default React.memo(CardMatching);
