import { Stack } from 'expo-router';

import { AppStack } from '@/components/app-stack';
import { useAppTheme } from '@/constants/app-theme';
import { t } from '@/i18n/translations';
import { useTracker } from '@/state/tracker-context';

export const unstable_settings = {
  anchor: 'settings',
};

export default function SettingsStackLayout() {
  const theme = useAppTheme();
  const { state } = useTracker();

  return (
    <AppStack>
      <Stack.Screen
        name="settings"
        options={{
          headerBlurEffect: 'none',
          headerLargeStyle: { backgroundColor: 'transparent' },
          headerTransparent: true,
        }}
      >
        <Stack.Title large>{t(state.locale, 'tabsSettings')}</Stack.Title>
      </Stack.Screen>
      <Stack.Screen
        name="about"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.75, 1],
          sheetGrabberVisible: true,
          contentStyle: { backgroundColor: theme.background },
        }}
      />
    </AppStack>
  );
}
