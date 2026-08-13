import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { JapanMap } from '@/components/japan-map';
import { LevelIndicator } from '@/components/level-indicator';
import { useAppTheme } from '@/constants/app-theme';
import type { AppLocale, ExperienceLevel, PrefectureCode } from '@/data/types';

type TrackerSnapshotProps = {
  levels: Record<PrefectureCode, ExperienceLevel>;
  locale: AppLocale;
  score: number;
  isReady?: boolean;
  showFlags: boolean;
  helperText: string;
  scoreLabel: string;
  maxScoreLabel: string;
  onSelect: (code: PrefectureCode) => void;
};

export function TrackerSnapshot({
  levels,
  locale,
  score,
  isReady = true,
  showFlags,
  helperText,
  scoreLabel,
  maxScoreLabel,
  onSelect,
}: TrackerSnapshotProps) {
  const theme = useAppTheme();
  const markedPrefectures = Object.values(levels).filter((level) => level > 0).length;
  const remainingProgress = 235 - score;

  return (
    <View style={styles.container}>
      <View style={[styles.heroCard, { backgroundColor: theme.hero }]}>
        <View style={[styles.heroCircle, { borderColor: theme.heroMuted }]} />
        <View style={styles.heroTopRow}>
          <View style={styles.heroCopy}>
            <Text style={[styles.eyebrow, { color: theme.heroMuted }]}>{scoreLabel}</Text>
            <View style={styles.scoreRow}>
              <Text selectable style={[styles.score, { color: theme.heroText }]}>
                {score}
              </Text>
              <Text style={[styles.maxScore, { color: theme.heroMuted }]}>{maxScoreLabel}</Text>
            </View>
          </View>
          <View style={[styles.prefectureSeal, { backgroundColor: theme.accent }]}>
            {isReady ? (
              <>
                <Text selectable style={[styles.sealCount, { color: theme.heroText }]}>
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
              styles.progressSegment,
              { backgroundColor: theme.gold, flexGrow: score },
            ]}
          />
          <View style={[styles.progressSegment, { flexGrow: remainingProgress }]} />
        </View>
      </View>

      <View style={[styles.paperCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.helper, { color: theme.secondaryText }]}>{helperText}</Text>
        <JapanMap
          levels={levels}
          locale={locale}
          showFlags={showFlags}
          onSelect={onSelect}
        />
      </View>

      <View style={[styles.legendPanel, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {([5, 4, 3, 2, 1, 0] as ExperienceLevel[]).map((level) => (
          <LevelIndicator key={level} level={level} locale={locale} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 18 },
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
  progressTrack: {
    height: 5,
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
    opacity: 0.55,
  },
  progressSegment: { flexBasis: 0 },
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
});
