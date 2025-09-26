import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: '#E6F6FF',
      100: '#BAE3FF',
      500: '#3182CE',
      900: '#1A365D',
    },
  },
  fonts: {
    heading: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    body: '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
});

export default theme;
