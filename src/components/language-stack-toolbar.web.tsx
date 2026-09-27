import { Stack } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { LanguageToolbar } from '@/components/language-toolbar';
import { TabBarIcon } from '@/components/tab-bar-icon';
import { useAppTheme } from '@/constants/app-theme';
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
  const { state } = useTracker();

  if (!onToggleFlags) {
    return null;
  }

  // @ref LLP 0000#application-shell-and-navigation
  return (
    <Stack.Screen
      options={{
        headerRight: () => (
          <View style={styles.actions}>
            <Pressable
              accessibilityLabel={t(state.locale, showFlags ? 'hideFlags' : 'showFlags')}
              accessibilityRole="button"
              accessibilityState={{ selected: showFlags }}
              onPress={onToggleFlags}
              style={[
                styles.flagButton,
                { backgroundColor: showFlags ? theme.accentSoft : theme.surfaceMuted },
              ]}
            >
              <TabBarIcon color={theme.accent} name="flag" />
            </Pressable>
            <LanguageToolbar />
          </View>
        ),
      }}
    />
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  flagButton: {
    width: 40,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderCurve: 'continuous',
  },
});
