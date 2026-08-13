import type { PropsWithChildren } from 'react';
import { Stack } from 'expo-router/stack';

import { LanguageToolbar } from '@/components/language-toolbar';
import { useAppTheme } from '@/constants/app-theme';

export function AppStack({ children }: PropsWithChildren) {
  const theme = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
        headerShadowVisible: false,
        headerTintColor: theme.text,
        headerTitleStyle: { color: theme.text },
        headerLargeTitleStyle: { color: theme.text },
        headerRight: process.env.EXPO_OS === 'web' ? () => <LanguageToolbar /> : undefined,
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      {children}
    </Stack>
  );
}
