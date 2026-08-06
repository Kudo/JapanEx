import { Button, Column, Host } from '@expo/ui';
import * as Clipboard from 'expo-clipboard';
import { useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import type Svg from 'react-native-svg';

import { JapanMap } from '@/components/japan-map';
import { LevelIndicator } from '@/components/level-indicator';
import { PrefectureSheet } from '@/components/prefecture-sheet';
import { ResultCard } from '@/components/result-card';
import { useAppTheme } from '@/constants/app-theme';
import type { ExperienceLevel, PrefectureCode } from '@/data/types';
import { t } from '@/i18n/translations';
import { useTracker } from '@/state/tracker-context';
import { createResultAsset, saveResult, shareResult } from '@/utils/result-export';
import { buildShareUrl } from '@/utils/share-state';

export function MapScreen() {
  const theme = useAppTheme();
  const { state, score, isReady, hasStorageError } = useTracker();
  const [selectedCode, setSelectedCode] = useState<PrefectureCode | null>(null);
  const [status, setStatus] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const resultRef = useRef<Svg>(null);
  const markedPrefectures = Object.values(state.levels).filter((level) => level > 0).length;
  const progressWidth = `${(score / 235) * 100}%` as `${number}%`;

  const handleResultAction = async (action: 'share' | 'save') => {
    setIsExporting(true);
    setStatus('');
    try {
      const asset = await createResultAsset(resultRef.current);
      if (action === 'share') {
        await shareResult(asset);
        setStatus(t(state.locale, 'imageShared'));
      } else {
        await saveResult(asset);
        setStatus(t(state.locale, 'imageSaved'));
      }
    } catch {
      setStatus(t(state.locale, 'exportFailed'));
    } finally {
      setIsExporting(false);
    }
  };

  const copyLink = async () => {
    await Clipboard.setStringAsync(buildShareUrl(state));
    setStatus(t(state.locale, 'linkCopied'));
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={[styles.heroCard, { backgroundColor: theme.hero }]}>
          <View style={[styles.heroCircle, { borderColor: theme.heroMuted }]} />
          <View style={styles.heroTopRow}>
            <View style={styles.heroCopy}>
              <Text style={[styles.eyebrow, { color: theme.heroMuted }]}>
              {t(state.locale, 'score')}
              </Text>
              <View style={styles.scoreRow}>
                <Text style={[styles.score, { color: theme.heroText }]}>{score}</Text>
                <Text style={[styles.maxScore, { color: theme.heroMuted }]}>
                {t(state.locale, 'maxScore')}
                </Text>
              </View>
            </View>
            <View style={[styles.prefectureSeal, { backgroundColor: theme.accent }]}>
              {isReady ? (
                <>
                  <Text style={[styles.sealCount, { color: theme.heroText }]}>
                    {markedPrefectures}
                  </Text>
                  <Text style={[styles.sealTotal, { color: theme.heroText }]}>/ 47</Text>
                </>
              ) : (
                <ActivityIndicator color={theme.heroText} />
              )}
            </View>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: theme.heroMuted }]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: theme.gold, width: progressWidth },
              ]}
            />
          </View>
        </View>

        <View
          style={[
            styles.paperCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.helper, { color: theme.secondaryText }]}>
            {t(state.locale, 'tapPrefecture')}
          </Text>
          <JapanMap levels={state.levels} onSelect={setSelectedCode} />
        </View>

        <View
          style={[
            styles.legendPanel,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          {([5, 4, 3, 2, 1, 0] as ExperienceLevel[]).map((level) => (
            <LevelIndicator key={level} level={level} locale={state.locale} />
          ))}
        </View>

        <View
          style={[
            styles.actionPanel,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Host matchContents seedColor={theme.accent}>
            <Column spacing={10} style={{ width: '100%' }}>
              <Button
                label={t(state.locale, 'shareImage')}
                disabled={isExporting}
                onPress={() => handleResultAction('share')}
              />
              <Button
                label={t(state.locale, 'saveImage')}
                variant="outlined"
                disabled={isExporting}
                onPress={() => handleResultAction('save')}
              />
              <Button
                label={t(state.locale, 'copyStateLink')}
                variant="text"
                onPress={copyLink}
              />
            </Column>
          </Host>
        </View>

        {status ? <Text style={[styles.status, { color: theme.secondaryText }]}>{status}</Text> : null}
        {hasStorageError ? (
          <Text accessibilityRole="alert" style={[styles.status, { color: theme.danger }]}>
            {t(state.locale, 'persistenceError')}
          </Text>
        ) : null}
      </ScrollView>

      <View style={styles.exportSurface}>
        <ResultCard
          ref={resultRef}
          locale={state.locale}
          displayName={state.displayName}
          score={score}
          levels={state.levels}
        />
      </View>

      <PrefectureSheet code={selectedCode} onDismiss={() => setSelectedCode(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    width: '100%',
    maxWidth: 820,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 54,
    gap: 18,
  },
  heroCard: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 28,
    borderCurve: 'continuous',
    padding: 24,
    gap: 18,
    boxShadow: '0 14px 34px rgba(24, 43, 53, 0.20)',
  },
  heroCircle: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 30,
    opacity: 0.1,
    right: -78,
    top: -92,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  heroCopy: { flex: 1 },
  eyebrow: { fontSize: 13, fontWeight: '800', letterSpacing: 1.1, textTransform: 'uppercase' },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  score: { fontSize: 58, fontWeight: '900', lineHeight: 64, fontVariant: ['tabular-nums'] },
  maxScore: { fontSize: 15, fontWeight: '700' },
  prefectureSeal: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '3deg' }],
  },
  sealCount: { fontSize: 27, lineHeight: 30, fontWeight: '900', fontVariant: ['tabular-nums'] },
  sealTotal: { fontSize: 12, fontWeight: '800', opacity: 0.9 },
  progressTrack: { height: 5, borderRadius: 3, overflow: 'hidden', opacity: 0.55 },
  progressFill: { height: '100%', borderRadius: 3 },
  paperCard: {
    borderWidth: 1,
    borderRadius: 28,
    borderCurve: 'continuous',
    padding: 14,
    gap: 14,
    boxShadow: '0 8px 24px rgba(34, 48, 56, 0.10)',
  },
  helper: { fontSize: 15, lineHeight: 22, textAlign: 'center' },
  legendPanel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 22,
    borderCurve: 'continuous',
    padding: 14,
  },
  actionPanel: {
    borderWidth: 1,
    borderRadius: 22,
    borderCurve: 'continuous',
    padding: 16,
  },
  status: { fontSize: 14, lineHeight: 20, textAlign: 'center' },
  exportSurface: {
    position: 'absolute',
    left: -4096,
    top: 0,
    width: 2048,
    height: 2048,
    opacity: 0,
    pointerEvents: 'none',
  },
});
