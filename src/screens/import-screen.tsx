import { Button, Column, Host } from '@expo/ui';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/constants/app-theme';
import { t } from '@/i18n/translations';
import { useTracker } from '@/state/tracker-context';
import { parseImportParams, type ImportParams } from '@/utils/share-state';

export function ImportScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams<ImportParams>();
  const { state, replaceState } = useTracker();
  const result = parseImportParams(params);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ title: t(state.locale, 'importTitle') }} />
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>{t(state.locale, 'importTitle')}</Text>
        {result.ok ? (
          <>
            <Text style={[styles.heading, { color: theme.text }]}>{t(state.locale, 'importPreview')}</Text>
            <Text style={[styles.detail, { color: theme.secondaryText }]}>
              {t(state.locale, 'currentScore')}: {result.score} / 235
            </Text>
            {result.state.displayName ? (
              <Text style={[styles.detail, { color: theme.secondaryText }]}>
                {t(state.locale, 'name')}: {result.state.displayName}
              </Text>
            ) : null}
            <Text style={[styles.warning, { color: theme.danger }]}>{t(state.locale, 'importWarning')}</Text>
            <Host matchContents seedColor={theme.accent}>
              <Column spacing={10} style={{ width: '100%' }}>
                <Button
                  label={t(state.locale, 'importConfirm')}
                  onPress={() => {
                    replaceState(result.state);
                    router.replace('/');
                  }}
                />
                <Button label={t(state.locale, 'cancel')} variant="text" onPress={() => router.replace('/')} />
              </Column>
            </Host>
          </>
        ) : (
          <>
            <Text accessibilityRole="alert" style={[styles.warning, { color: theme.danger }]}>
              {t(state.locale, 'importInvalid')}
            </Text>
            <Host matchContents seedColor={theme.accent}>
              <Button label={t(state.locale, 'returnHome')} onPress={() => router.replace('/')} />
            </Host>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20, justifyContent: 'center' },
  card: { width: '100%', maxWidth: 620, alignSelf: 'center', borderWidth: 1, borderRadius: 22, padding: 24, gap: 16 },
  title: { fontSize: 27, fontWeight: '900' },
  heading: { fontSize: 18, fontWeight: '800' },
  detail: { fontSize: 16, lineHeight: 24 },
  warning: { fontSize: 14, lineHeight: 21 },
});
