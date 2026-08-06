import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useAppTheme } from '@/constants/app-theme';
import { t } from '@/i18n/translations';
import { useTracker } from '@/state/tracker-context';

export default function TabLayout() {
  const theme = useAppTheme();
  const { state } = useTracker();

  return (
    <NativeTabs
      backgroundColor={theme.surface}
      iconColor={{ default: theme.secondaryText, selected: theme.accent }}
      labelStyle={{
        default: { color: theme.secondaryText, fontWeight: '600' },
        selected: { color: theme.accent, fontWeight: '700' },
      }}
      minimizeBehavior="onScrollDown"
      shadowColor={theme.border}
      tintColor={theme.accent}
    >
      <NativeTabs.Trigger name="(map)">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'map', selected: 'map.fill' }}
          md="map"
        />
        <NativeTabs.Trigger.Label>{t(state.locale, 'tabsMap')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(flags)">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'flag', selected: 'flag.fill' }}
          md="flag"
        />
        <NativeTabs.Trigger.Label>{t(state.locale, 'tabsFlags')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(settings)">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'gearshape', selected: 'gearshape.fill' }}
          md="settings"
        />
        <NativeTabs.Trigger.Label>{t(state.locale, 'tabsSettings')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
