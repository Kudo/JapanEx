import { Button, Column, Host } from '@expo/ui';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ReadOnlyPrefectureSheet } from '@/components/read-only-prefecture-sheet';
import { TrackerSnapshot } from '@/components/tracker-snapshot';
import { useAppTheme } from '@/constants/app-theme';
import type { PrefectureCode } from '@/data/types';
import { t } from '@/i18n/translations';
import { getInitialLocale } from '@/state/tracker-state';
import { parseSharedStateParams, type SharedStateParams } from '@/utils/share-state';

export function SharedViewScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams<SharedStateParams>();
  const result = parseSharedStateParams(params);
  const locale = result.ok ? result.state.locale : getInitialLocale();
  const [showFlags, setShowFlags] = useState(false);
  const [selectedCode, setSelectedCode] = useState<PrefectureCode | null>(null);

  return (
    <>
      <ScrollView
        style={{ backgroundColor: theme.background }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {result.ok ? (
          <>
            <View style={[styles.noticeCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.viewOnly, { color: theme.accent }]}>
                {t(locale, 'sharedViewOnly')}
              </Text>
              {result.state.displayName ? (
                <Text selectable style={[styles.sharedBy, { color: theme.text }]}>
                  {t(locale, 'sharedBy')}: {result.state.displayName}
                </Text>
              ) : null}
              <Text selectable style={[styles.notice, { color: theme.secondaryText }]}>
                {t(locale, 'sharedViewNotice')}
              </Text>
            </View>

            <TrackerSnapshot
              levels={result.state.levels}
              locale={locale}
              score={result.score}
              showFlags={showFlags}
              helperText={t(locale, 'tapPrefectureView')}
              scoreLabel={t(locale, 'score')}
              maxScoreLabel={t(locale, 'maxScore')}
              onSelect={setSelectedCode}
            />

            <View style={[styles.actions, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Host matchContents seedColor={theme.accent}>
                <Column spacing={10} style={{ width: '100%' }}>
                  <Button
                    label={t(locale, showFlags ? 'hideFlags' : 'showFlags')}
                    variant="outlined"
                    onPress={() => setShowFlags((current) => !current)}
                  />
                  <Button
                    label={t(locale, 'viewMyMap')}
                    variant="text"
                    onPress={() => router.replace('/')}
                  />
                </Column>
              </Host>
            </View>
          </>
        ) : (
          <View style={[styles.errorCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text selectable accessibilityRole="alert" style={[styles.error, { color: theme.danger }]}>
              {t(locale, 'sharedViewInvalid')}
            </Text>
            <Host matchContents seedColor={theme.accent}>
              <Button label={t(locale, 'viewMyMap')} onPress={() => router.replace('/')} />
            </Host>
          </View>
        )}
      </ScrollView>

      <Stack.Title>{t(locale, 'sharedViewTitle')}</Stack.Title>
      {result.ok ? (
        <ReadOnlyPrefectureSheet
          code={selectedCode}
          levels={result.state.levels}
          locale={locale}
          onDismiss={() => setSelectedCode(null)}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 820,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 54,
    gap: 18,
  },
  noticeCard: {
    borderWidth: 1,
    borderRadius: 22,
    borderCurve: 'continuous',
    padding: 18,
    gap: 8,
  },
  viewOnly: { fontSize: 12, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  sharedBy: { fontSize: 18, lineHeight: 24, fontWeight: '800' },
  notice: { fontSize: 14, lineHeight: 21 },
  actions: {
    borderWidth: 1,
    borderRadius: 22,
    borderCurve: 'continuous',
    padding: 16,
  },
  errorCard: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    marginVertical: 'auto',
    borderWidth: 1,
    borderRadius: 22,
    borderCurve: 'continuous',
    padding: 24,
    gap: 18,
  },
  error: { fontSize: 16, lineHeight: 24, textAlign: 'center' },
});
