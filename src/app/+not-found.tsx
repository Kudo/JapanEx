import { Button, Host } from '@expo/ui';
import { Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/constants/app-theme';
import { LanguageStackToolbar } from '@/components/language-stack-toolbar';
import { t } from '@/i18n/translations';
import { useTracker } from '@/state/tracker-context';

export default function NotFoundRoute() {
  const theme = useAppTheme();
  const router = useRouter();
  const { state } = useTracker();

  return (
    <>
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <Text selectable style={[styles.title, { color: theme.text }]}>
          {t(state.locale, 'notFound')}
        </Text>
        <Host matchContents seedColor={theme.accent}>
          <Button label={t(state.locale, 'returnHome')} onPress={() => router.replace('/')} />
        </Host>
      </View>
      <Stack.Title>{t(state.locale, 'notFound')}</Stack.Title>
      <LanguageStackToolbar />
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18 },
  title: { fontSize: 24, fontWeight: '900' },
});
