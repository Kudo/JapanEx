import { Stack } from 'expo-router';

import { AppStack } from '@/components/app-stack';
import { t } from '@/i18n/translations';
import { useTracker } from '@/state/tracker-context';

export const unstable_settings = {
  map: { anchor: 'index' },
  flags: { anchor: 'flags' },
};

export default function MapFlagsStackLayout({ segment }: { segment: string }) {
  const { state } = useTracker();
  const tab = segment.match(/\((.*)\)/)?.[1] === 'flags' ? 'flags' : 'map';
  const rootScreen = tab === 'flags' ? 'flags' : 'index';
  const title = t(state.locale, tab === 'flags' ? 'tabsFlags' : 'tabsMap');

  return (
    <AppStack>
      <Stack.Screen
        name={rootScreen}
        options={{
          headerBlurEffect: 'none',
          headerLargeStyle: { backgroundColor: 'transparent' },
          headerTransparent: true,
        }}
      >
        <Stack.Title large>{title}</Stack.Title>
      </Stack.Screen>
      <Stack.Screen name="prefecture/[code]" />
    </AppStack>
  );
}
