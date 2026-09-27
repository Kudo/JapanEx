import { Tabs } from 'expo-router';

import { TabBarIcon } from '@/components/tab-bar-icon';
import { useAppTheme } from '@/constants/app-theme';
import { t } from '@/i18n/translations';
import { useTracker } from '@/state/tracker-context';

export default function TabLayout() {
  const theme = useAppTheme();
  const { state } = useTracker();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.secondaryText,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarHideOnKeyboard: true,
        sceneStyle: { backgroundColor: theme.background },
      }}
    >
      <Tabs.Screen
        name="(map)"
        options={{
          title: t(state.locale, 'tabsMap'),
          tabBarIcon: ({ color }) => <TabBarIcon color={color} name="map" />,
        }}
      />
      <Tabs.Screen
        name="(flags)"
        options={{
          title: t(state.locale, 'tabsFlags'),
          tabBarIcon: ({ color }) => <TabBarIcon color={color} name="flag" />,
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          title: t(state.locale, 'tabsSettings'),
          tabBarIcon: ({ color }) => <TabBarIcon color={color} name="settings" />,
        }}
      />
    </Tabs>
  );
}
