import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { LanguageToolbar } from '@/components/language-toolbar';
import { useAppTheme } from '@/constants/app-theme';
import { t } from '@/i18n/translations';
import { useTracker } from '@/state/tracker-context';

export default function TabLayout() {
  const theme = useAppTheme();
  const { state } = useTracker();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.secondaryText,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
        tabBarHideOnKeyboard: true,
        sceneStyle: { backgroundColor: theme.background },
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        headerShadowVisible: false,
        headerTitleStyle: { fontSize: 20, fontWeight: '800' },
        headerRight: () => <LanguageToolbar />,
        headerRightContainerStyle: { paddingRight: 14 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t(state.locale, 'tabsMap'),
          tabBarIcon: ({ color }) => (
            <SymbolView name="map.fill" tintColor={color} style={{ width: 24, height: 24 }} />
          ),
        }}
      />
      <Tabs.Screen
        name="flags"
        options={{
          title: t(state.locale, 'tabsFlags'),
          tabBarIcon: ({ color }) => (
            <SymbolView name="flag.fill" tintColor={color} style={{ width: 24, height: 24 }} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t(state.locale, 'tabsSettings'),
          tabBarIcon: ({ color }) => (
            <SymbolView name="gearshape.fill" tintColor={color} style={{ width: 24, height: 24 }} />
          ),
        }}
      />
    </Tabs>
  );
}
