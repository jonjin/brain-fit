import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Container, useColorModeValue } from '@chakra-ui/react';
import TabBar from './components/common/TabBar';
import Header from './components/common/Header';
import LoadingScreen from './components/common/LoadingScreen';

const Home = lazy(() => import('./pages/Home'));
const Training = lazy(() => import('./pages/Training'));
const Assessment = lazy(() => import('./pages/Assessment'));
const Progress = lazy(() => import('./pages/Progress'));
const Settings = lazy(() => import('./pages/Settings'));

interface BrainFitUserData {
  id: string;
  name: string;
  age: number;
  lastSession?: string;
}

const App: React.FC = () => {
  const [userData, setUserData] = useState<BrainFitUserData | null>(null);
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  useEffect(() => {
    const savedData = localStorage.getItem('brainFitUserData');
    if (savedData) {
      try {
        setUserData(JSON.parse(savedData));
      } catch (error) {
        console.error('Failed to parse saved BrainFit user data', error);
      }
    }
  }, []);

  useEffect(() => {
    if (userData) {
      localStorage.setItem('brainFitUserData', JSON.stringify(userData));
    }
  }, [userData]);

  return (
    <Router>
      <Box minH="100vh" bg={bgColor} pb="80px">
        <Header user={userData} onLogout={() => setUserData(null)} />
        <Container maxW="container.md" px={4} pt={4} pb={12}>
          <Suspense fallback={<LoadingScreen message="正在载入页面…" />}>
            <Routes>
              <Route path="/" element={<Home onProfileUpdate={setUserData} user={userData} />} />
              <Route path="/training" element={<Training />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/settings" element={<Settings user={userData} onProfileUpdate={setUserData} />} />
            </Routes>
          </Suspense>
        </Container>
        <TabBar />
      </Box>
    </Router>
  );
};

export default App;
