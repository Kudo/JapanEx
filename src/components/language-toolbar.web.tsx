import { Host, Picker } from '@expo/ui';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/constants/app-theme';
import { APP_LOCALE_OPTIONS, isAppLocale } from '@/i18n/locales';
import { t } from '@/i18n/translations';
import { useTracker } from '@/state/tracker-context';

export function LanguageToolbar() {
  const theme = useAppTheme();
  const { state, setLocale } = useTracker();

  return (
    <View
      accessibilityLabel={t(state.locale, 'language')}
      style={[styles.container, { backgroundColor: theme.surfaceMuted }]}
    >
      <Host matchContents seedColor={theme.accent} style={styles.host}>
        <Picker
          selectedValue={state.locale}
          onValueChange={(value) => {
            if (isAppLocale(value)) {
              setLocale(value);
            }
          }}
          appearance="menu"
          testID="header-language-picker"
        >
          {APP_LOCALE_OPTIONS.map((option) => (
            <Picker.Item key={option.value} value={option.value} label={option.shortLabel} />
          ))}
        </Picker>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 78,
    minHeight: 36,
    justifyContent: 'center',
    borderRadius: 10,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  host: {
    width: 78,
    minHeight: 36,
    justifyContent: 'center',
  },
});
