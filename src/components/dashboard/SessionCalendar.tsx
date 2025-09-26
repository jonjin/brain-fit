import React from 'react';
import { Grid, GridItem, Text, VStack } from '@chakra-ui/react';

interface SessionCalendarProps {
  sessions: {
    id: string;
    date: string;
    score: number;
  }[];
}

const formatDate = (date: string) => new Date(date).getDate();

const SessionCalendar: React.FC<SessionCalendarProps> = ({ sessions }) => {
  const daysInMonth = 30;
  const sessionMap = sessions.reduce<Record<number, { score: number }>>((acc, session) => {
    const day = formatDate(session.date);
    acc[day] = { score: session.score };
    return acc;
  }, {});

  return (
    <VStack align="stretch" spacing={3}>
      <Text fontWeight="medium">训练日历</Text>
      <Grid templateColumns="repeat(6, 1fr)" gap={2}>
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const session = sessionMap[day];
          return (
            <GridItem
              key={day}
              bg={session ? 'blue.100' : 'gray.100'}
              rounded="md"
              textAlign="center"
              py={3}
            >
              <Text fontSize="xs" fontWeight="bold">
                {day}
              </Text>
              {session && (
                <Text fontSize="2xs" color="blue.700">
                  {session.score} 分
                </Text>
              )}
            </GridItem>
          );
        })}
      </Grid>
    </VStack>
  );
};

export default React.memo(SessionCalendar);
