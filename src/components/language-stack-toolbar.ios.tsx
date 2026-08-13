import { MenuView } from '@expo/ui/community/menu';
import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/constants/app-theme';
import { APP_LOCALE_OPTIONS } from '@/i18n/locales';
import { t } from '@/i18n/translations';
import { useTracker } from '@/state/tracker-context';

type LanguageStackToolbarProps = {
  showFlags?: boolean;
  onToggleFlags?: () => void;
};

export function LanguageStackToolbar({
  showFlags = false,
  onToggleFlags,
}: LanguageStackToolbarProps) {
  const theme = useAppTheme();
  const { state, setLocale } = useTracker();
  const currentLocale = APP_LOCALE_OPTIONS.find((option) => option.value === state.locale)!;

  return (
    <Stack.Screen
      options={{
        headerRight: () => (
          <View style={styles.actions}>
            {onToggleFlags ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t(state.locale, showFlags ? 'hideFlags' : 'showFlags')}
                hitSlop={8}
                onPress={onToggleFlags}
                style={styles.button}
              >
                <Image
                  source={showFlags ? 'sf:flag.fill' : 'sf:flag'}
                  contentFit="contain"
                  tintColor={theme.accent}
                  style={styles.icon}
                />
              </Pressable>
            ) : null}
            <MenuView
              title={t(state.locale, 'language')}
              actions={APP_LOCALE_OPTIONS.map((option) => ({
                id: option.value,
                title: option.label,
                state:
                  option.value === state.locale ? ('on' as const) : ('off' as const),
              }))}
              onPressAction={(event) => {
                const locale = APP_LOCALE_OPTIONS.find(
                  (option) => option.value === event.nativeEvent.event,
                );
                if (locale) {
                  setLocale(locale.value);
                }
              }}
              style={styles.menu}
            >
              <View
                accessible
                accessibilityRole="button"
                accessibilityLabel={`${t(state.locale, 'language')}: ${currentLocale.label}`}
                style={styles.button}
              >
                <Image
                  source="sf:globe"
                  contentFit="contain"
                  tintColor={theme.accent}
                  style={styles.icon}
                />
              </View>
            </MenuView>
          </View>
        ),
      }}
    />
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  button: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 22,
    height: 22,
  },
  menu: {
    width: 32,
    height: 32,
  },
});
