import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/constants/app-theme';
import { APP_STORE_URL, GOOGLE_PLAY_URL } from '@/constants/native-app-links';
import { t } from '@/i18n/translations';
import { useTracker } from '@/state/tracker-context';

export function NativeAppBanner() {
  const theme = useAppTheme();
  const { state } = useTracker();

  if (!APP_STORE_URL && !GOOGLE_PLAY_URL) {
    return null;
  }

  const linkStyle = {
    color: theme.accent,
    fontFamily: 'system-ui, sans-serif',
    fontSize: 14,
    fontWeight: 700,
    lineHeight: '20px',
    padding: '12px 0',
  };

  return (
    <View style={[styles.banner, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>{t(state.locale, 'getNativeApp')}</Text>
        <View style={styles.links}>
          {APP_STORE_URL ? (
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>
              {t(state.locale, 'downloadAppStore')}
            </a>
          ) : null}
          {GOOGLE_PLAY_URL ? (
            <a href={GOOGLE_PLAY_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>
              {t(state.locale, 'downloadGooglePlay')}
            </a>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { borderBottomWidth: 1, paddingHorizontal: 18, paddingVertical: 4 },
  content: { width: '100%', maxWidth: 1080, alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', columnGap: 24 },
  title: { fontSize: 14, fontWeight: '700', paddingVertical: 8 },
  links: { maxWidth: '100%', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 24 },
});
