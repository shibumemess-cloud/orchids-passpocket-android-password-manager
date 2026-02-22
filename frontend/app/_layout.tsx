import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { ErrorBoundary } from './error-boundary';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <ErrorBoundary>
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="add-password"
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen
            name="password-detail"
            options={{ presentation: 'card' }}
          />
        </Stack>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
