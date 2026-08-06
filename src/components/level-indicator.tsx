import { StyleSheet, Text, View } from 'react-native';

import { LEVEL_COLORS, useAppTheme } from '@/constants/app-theme';
import type { AppLocale, ExperienceLevel } from '@/data/types';
import { LEVEL_LABELS } from '@/i18n/translations';

type LevelIndicatorProps = {
  level: ExperienceLevel;
  locale: AppLocale;
  compact?: boolean;
};

export function LevelIndicator({ level, locale, compact = false }: LevelIndicatorProps) {
  const theme = useAppTheme();

  return (
    <View
      accessible
      accessibilityLabel={`${level}: ${LEVEL_LABELS[locale][level]}`}
      style={[
        styles.container,
        { backgroundColor: theme.surfaceMuted, borderColor: theme.border },
        compact && styles.compactContainer,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: LEVEL_COLORS[level] }]} />
      <Text selectable style={[styles.level, { color: theme.text }]}>{level}</Text>
      {!compact && (
        <Text selectable numberOfLines={1} style={[styles.label, { color: theme.secondaryText }]}>
          {LEVEL_LABELS[locale][level]}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    minHeight: 34,
    borderWidth: 1,
    borderRadius: 17,
    paddingHorizontal: 10,
  },
  compactContainer: {
    minWidth: 58,
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#55606B',
  },
  level: {
    fontWeight: '800',
  },
  label: {
    maxWidth: 170,
    fontSize: 13,
  },
});
