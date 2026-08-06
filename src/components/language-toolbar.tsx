import { Host, Picker } from '@expo/ui';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/constants/app-theme';
import type { AppLocale } from '@/data/types';
import { useTracker } from '@/state/tracker-context';

export function LanguageToolbar() {
  const theme = useAppTheme();
  const { state, setLocale } = useTracker();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
    >
      <Host matchContents seedColor={theme.accent} style={styles.host}>
        <Picker
          selectedValue={state.locale}
          onValueChange={(value) => setLocale(value as AppLocale)}
          appearance="menu"
          testID="header-language-picker"
        >
          <Picker.Item value="ja" label="日本語" />
          <Picker.Item value="zh-Hant" label="繁中" />
          <Picker.Item value="en" label="EN" />
        </Picker>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 104,
    minHeight: 40,
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    overflow: 'hidden',
  },
  host: {
    width: 102,
    minHeight: 38,
    justifyContent: 'center',
  },
});
