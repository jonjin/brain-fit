import React, { useState } from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, VStack, Heading, Text } from '@chakra-ui/react';
import RBANSTest from '../components/assessment/RBANSTest';
import RBMTTest from '../components/assessment/RBMTTest';
import TestResults from '../components/assessment/TestResults';
import questionsJson from '../data/assessmentQuestions.json';

interface AssessmentData {
  RBANS: React.ComponentProps<typeof RBANSTest>['questions'];
  RBMT: {
    everyday_memory: React.ComponentProps<typeof RBMTTest>['questions'];
  };
}

const data = questionsJson as AssessmentData;

const Assessment: React.FC = () => {
  const [rbansScore, setRbansScore] = useState<number | null>(null);
  const [rbmtScore, setRbmtScore] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="md">标准化认知评估</Heading>
      <Text fontSize="sm" color="gray.600">
        根据 RBANS 与 RBMT 评估注意力、记忆与日常功能表现。保留每次评估的数据，用于观察认知趋势。
      </Text>
      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>RBANS</Tab>
          <Tab>RBMT</Tab>
          <Tab>评估记录</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <RBANSTest
              questions={data.RBANS}
              onComplete={(score) => {
                setRbansScore(score);
              }}
            />
          </TabPanel>
          <TabPanel>
            <RBMTTest
              questions={data.RBMT.everyday_memory}
              onComplete={(score, memo) => {
                setRbmtScore(score);
                setNotes(memo);
              }}
            />
          </TabPanel>
          <TabPanel>
            <TestResults rbansScore={rbansScore} rbmtScore={rbmtScore} notes={notes} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default React.memo(Assessment);
