import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/constants/app-theme';
import { APP_STORE_URL, GOOGLE_PLAY_URL } from '@/constants/native-app-links';
import { t } from '@/i18n/translations';
import { useTracker } from '@/state/tracker-context';

export function AppStoreLinks() {
  const theme = useAppTheme();
  const { state } = useTracker();

  if (!APP_STORE_URL && !GOOGLE_PLAY_URL) {
    return null;
  }

  const linkStyle = {
    color: theme.accent,
    fontFamily: 'system-ui, sans-serif',
    fontSize: 15,
    lineHeight: '22px',
    padding: '11px 0',
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={[styles.title, { color: theme.text }]}>{t(state.locale, 'getNativeApp')}</Text>
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
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 22, padding: 17, gap: 4 },
  title: { fontSize: 15, fontWeight: '900', letterSpacing: 0.2, marginBottom: 8 },
});
