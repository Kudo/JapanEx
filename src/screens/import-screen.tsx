import { Button, Column, Host } from '@expo/ui';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/constants/app-theme';
import { LanguageStackToolbar } from '@/components/language-stack-toolbar';
import { t } from '@/i18n/translations';
import { useBoundedContentWidth } from '@/hooks/use-bounded-content-width';
import { useTracker } from '@/state/tracker-context';
import { parseImportParams, type ImportParams } from '@/utils/share-state';

export function ImportScreen() {
  const theme = useAppTheme();
  const cardWidth = useBoundedContentWidth(620, 40);
  const router = useRouter();
  const params = useLocalSearchParams<ImportParams>();
  const { state, replaceState } = useTracker();
  const result = parseImportParams(params);

  return (
    <>
      <ScrollView
        style={{ backgroundColor: theme.background }}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.screen}
      >
        <View
          style={[
            styles.card,
            { width: cardWidth, backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          {result.ok ? (
            <>
              <Text style={[styles.heading, { color: theme.text }]}>{t(state.locale, 'importPreview')}</Text>
              <Text selectable style={[styles.detail, { color: theme.secondaryText }]}>
                {t(state.locale, 'currentScore')}: {result.score} / 235
              </Text>
              {result.state.displayName ? (
                <Text selectable style={[styles.detail, { color: theme.secondaryText }]}>
                  {t(state.locale, 'name')}: {result.state.displayName}
                </Text>
              ) : null}
              <Text selectable style={[styles.warning, { color: theme.danger }]}>
                {t(state.locale, 'importWarning')}
              </Text>
              <Host
                matchContents={{ vertical: true }}
                seedColor={theme.accent}
                style={styles.nativeHost}
              >
                <Column style={{ width: '100%' }} spacing={10}>
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
              <Text selectable accessibilityRole="alert" style={[styles.warning, { color: theme.danger }]}>
                {t(state.locale, 'importInvalid')}
              </Text>
              <Host matchContents seedColor={theme.accent}>
                <Button label={t(state.locale, 'returnHome')} onPress={() => router.replace('/')} />
              </Host>
            </>
          )}
        </View>
      </ScrollView>
      <Stack.Title>{t(state.locale, 'importTitle')}</Stack.Title>
      <LanguageStackToolbar />
    </>
  );
}

const styles = StyleSheet.create({
  nativeHost: { alignSelf: 'stretch' },
  screen: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  card: {
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 22,
    borderCurve: 'continuous',
    padding: 24,
    gap: 16,
  },
  heading: { fontSize: 18, fontWeight: '800' },
  detail: { fontSize: 16, lineHeight: 24 },
  warning: { fontSize: 14, lineHeight: 21 },
});
