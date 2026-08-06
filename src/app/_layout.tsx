import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppStack } from '@/components/app-stack';
import { useAppTheme } from '@/constants/app-theme';
import { TrackerProvider } from '@/state/tracker-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = useAppTheme();
  const navigationTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const themedNavigation = {
    ...navigationTheme,
    colors: {
      ...navigationTheme.colors,
      primary: theme.accent,
      background: theme.background,
      card: theme.surface,
      text: theme.text,
      border: theme.border,
      notification: theme.accent,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TrackerProvider>
        <ThemeProvider value={themedNavigation}>
          <AppStack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="import"
              options={{
                presentation: 'formSheet',
                sheetAllowedDetents: [0.5, 1],
                sheetGrabberVisible: true,
                sheetInitialDetentIndex: 0,
              }}
            />
            <Stack.Screen name="+not-found" />
          </AppStack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </TrackerProvider>
    </GestureHandlerRootView>
  );
}
