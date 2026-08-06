import { Column, Host, Picker, TextInput, useNativeState } from '@expo/ui';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { LevelIndicator } from '@/components/level-indicator';
import { LEVEL_COLORS, useAppTheme } from '@/constants/app-theme';
import { FLAG_ASSETS } from '@/data/flags';
import { PREFECTURES } from '@/data/prefectures';
import { REGION_CODES, type ExperienceLevel, type RegionCode } from '@/data/types';
import { REGION_LABELS, t } from '@/i18n/translations';
import { useTracker } from '@/state/tracker-context';

export function FlagsScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { state } = useTracker();
  const { width } = useWindowDimensions();
  const searchValue = useNativeState('');
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState<'all' | RegionCode>('all');
  const [level, setLevel] = useState<'all' | `${ExperienceLevel}`>('all');
  const columns = width >= 820 ? 2 : 1;

  const filteredPrefectures = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();
    return PREFECTURES.filter((prefecture) => {
      const matchesSearch =
        !normalizedSearch ||
        Object.values(prefecture.names).some((name) =>
          name.toLocaleLowerCase().includes(normalizedSearch),
        );
      const matchesRegion = region === 'all' || prefecture.region === region;
      const matchesLevel = level === 'all' || state.levels[prefecture.code] === Number(level);
      return matchesSearch && matchesRegion && matchesLevel;
    });
  }, [level, region, search, state.levels]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <FlatList
        key={`flags-${columns}`}
        data={filteredPrefectures}
        numColumns={columns}
        keyExtractor={(item) => item.code}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={columns > 1 ? styles.columnWrapper : undefined}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View
            style={[
              styles.filterPanel,
              { backgroundColor: theme.hero, borderColor: theme.border },
            ]}
          >
            <View style={styles.filterHeading}>
              <Text style={[styles.filterTitle, { color: theme.heroText }]}>
                {t(state.locale, 'flagCollection')}
              </Text>
              <View style={[styles.countBadge, { backgroundColor: theme.accent }]}>
                <Text style={[styles.countText, { color: theme.heroText }]}>
                  {filteredPrefectures.length} / 47
                </Text>
              </View>
            </View>
            <Host seedColor={theme.accent} style={styles.filterHost}>
              <Column spacing={10} style={{ width: '100%' }}>
                <TextInput
                  value={searchValue}
                  onChangeText={setSearch}
                  placeholder={t(state.locale, 'searchPlaceholder')}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{
                    width: '100%',
                    height: 48,
                    paddingHorizontal: 14,
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                    borderWidth: 1,
                    borderRadius: 14,
                  }}
                />
                <Picker
                  selectedValue={region}
                  onValueChange={(value) => setRegion(value as typeof region)}
                >
                  <Picker.Item value="all" label={t(state.locale, 'allRegions')} />
                  {REGION_CODES.map((regionCode) => (
                    <Picker.Item
                      key={regionCode}
                      value={regionCode}
                      label={REGION_LABELS[state.locale][regionCode]}
                    />
                  ))}
                </Picker>
                <Picker
                  selectedValue={level}
                  onValueChange={(value) => setLevel(value as typeof level)}
                >
                  <Picker.Item value="all" label={t(state.locale, 'allLevels')} />
                  {([0, 1, 2, 3, 4, 5] as ExperienceLevel[]).map((value) => (
                    <Picker.Item
                      key={value}
                      value={`${value}`}
                      label={`${t(state.locale, 'level')} ${value}`}
                    />
                  ))}
                </Picker>
              </Column>
            </Host>
          </View>
        }
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.secondaryText }]}>
            {t(state.locale, 'noMatches')}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.cardCell}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={item.names[state.locale]}
              onPress={() => router.push(`/prefecture/${item.code}`)}
              style={({ pressed }) => [
                styles.card,
                columns === 1 ? styles.listCard : styles.gridCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  borderTopColor: LEVEL_COLORS[state.levels[item.code]],
                },
                pressed && styles.pressed,
              ]}
            >
              <View
                style={[
                  styles.flagFrame,
                  columns === 1 ? styles.listFlagFrame : styles.gridFlagFrame,
                ]}
              >
                <Image
                  source={FLAG_ASSETS[item.code]}
                  contentFit="contain"
                  style={styles.flag}
                  accessibilityLabel={`${item.names[state.locale]} flag`}
                />
              </View>
              <View style={styles.cardBody}>
                <View style={styles.nameRow}>
                  <Text numberOfLines={1} style={[styles.name, { color: theme.text }]}>
                    {item.names[state.locale]}
                  </Text>
                  <Text style={[styles.code, { color: theme.accent }]}> {item.code}</Text>
                </View>
                <Text style={[styles.region, { color: theme.secondaryText }]}>
                  {REGION_LABELS[state.locale][item.region]}
                </Text>
                <LevelIndicator level={state.levels[item.code]} locale={state.locale} />
              </View>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    width: '100%',
    maxWidth: 980,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 54,
    gap: 14,
  },
  columnWrapper: { gap: 14 },
  filterHost: { width: '100%' },
  filterPanel: {
    borderWidth: 1,
    borderRadius: 26,
    borderCurve: 'continuous',
    padding: 18,
    gap: 14,
    marginBottom: 4,
    boxShadow: '0 12px 30px rgba(24, 43, 53, 0.16)',
  },
  filterHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  filterTitle: { fontSize: 22, fontWeight: '900', letterSpacing: 0.2 },
  countBadge: { borderRadius: 15, paddingHorizontal: 12, paddingVertical: 6 },
  countText: { fontSize: 13, fontWeight: '900', fontVariant: ['tabular-nums'] },
  cardCell: { flex: 1 },
  card: {
    flex: 1,
    borderWidth: 1,
    borderTopWidth: 4,
    borderRadius: 22,
    borderCurve: 'continuous',
    padding: 13,
    gap: 14,
    boxShadow: '0 6px 18px rgba(34, 48, 56, 0.08)',
  },
  listCard: { flexDirection: 'row', minHeight: 136, alignItems: 'center' },
  gridCard: { minHeight: 270 },
  pressed: { opacity: 0.76, transform: [{ scale: 0.99 }] },
  flagFrame: {
    overflow: 'hidden',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: 8,
  },
  listFlagFrame: { width: 132, height: 90 },
  gridFlagFrame: { width: '100%', height: 142 },
  flag: { width: '100%', height: '100%' },
  cardBody: { flex: 1, alignItems: 'flex-start', gap: 5 },
  nameRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: { fontSize: 20, fontWeight: '800' },
  code: { fontSize: 13, fontWeight: '900', fontVariant: ['tabular-nums'] },
  region: { fontSize: 14, paddingBottom: 4 },
  empty: { textAlign: 'center', paddingVertical: 64, fontSize: 16 },
});
