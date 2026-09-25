import { Host, Picker, TextInput, useNativeState } from '@expo/ui';
import { Image } from 'expo-image';
import { Link, Stack } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { FlatList, Keyboard, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { SearchBarCommands } from 'react-native-screens';

import { LevelIndicator } from '@/components/level-indicator';
import { LanguageStackToolbar } from '@/components/language-stack-toolbar';
import { LARGE_TEXT_FONT_SCALE } from '@/constants/accessibility-layout';
import { LEVEL_COLORS, useAppTheme } from '@/constants/app-theme';
import { FLAG_THUMBNAIL_ASSETS } from '@/data/flags';
import { PREFECTURES } from '@/data/prefectures';
import { REGION_CODES, type ExperienceLevel, type RegionCode } from '@/data/types';
import {
  useBoundedContentStyle,
  useViewportWidth,
} from '@/hooks/use-bounded-content-width';
import { experienceAccessibilityLabel, REGION_LABELS, t } from '@/i18n/translations';
import { useTracker } from '@/state/tracker-context';

export function FlagsScreen() {
  const theme = useAppTheme();
  const { state } = useTracker();
  const width = useViewportWidth();
  const largeText = useWindowDimensions().fontScale >= LARGE_TEXT_FONT_SCALE;
  const contentStyle = useBoundedContentStyle(980);
  const searchValue = useNativeState('');
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState<'all' | RegionCode>('all');
  const [level, setLevel] = useState<'all' | `${ExperienceLevel}`>('all');
  const searchBarRef = useRef<SearchBarCommands | null>(null);
  const columns = width >= 820 ? 2 : 1;

  const dismissSearchKeyboard = () => {
    searchBarRef.current?.blur();
    Keyboard.dismiss();
  };

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
    <>
      <FlatList
        style={[styles.screen, { backgroundColor: theme.background }]}
        alwaysBounceVertical
        key={`flags-${columns}`}
        data={filteredPrefectures}
        numColumns={columns}
        keyExtractor={(item) => item.code}
        contentInsetAdjustmentBehavior="always"
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={columns > 1 ? styles.columnWrapper : undefined}
        contentContainerStyle={[styles.content, contentStyle]}
        ItemSeparatorComponent={FlagCardSeparator}
        ListHeaderComponent={
          <View
            style={[
              styles.filterPanel,
              { backgroundColor: theme.hero, borderColor: theme.border },
            ]}
          >
            <View style={[styles.filterHeading, largeText && styles.filterHeadingLarge]}>
              <Text style={[styles.filterTitle, { color: theme.heroText }]}>
                {t(state.locale, 'flagCollection')}
              </Text>
              <View style={[styles.countBadge, { backgroundColor: theme.accent }]}>
                <Text style={[styles.countText, { color: theme.heroText }]}>
                  {filteredPrefectures.length}
                </Text>
              </View>
            </View>
            {process.env.EXPO_OS === 'web' ? (
              <Host matchContents seedColor={theme.accent} style={styles.filterHost}>
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
              </Host>
            ) : null}
            <View style={[styles.filterControls, largeText && styles.filterControlsLarge]}>
              <Host
                matchContents={{ vertical: true }}
                seedColor={theme.accent}
                style={[styles.filterControlHost, largeText && styles.filterControlHostLarge]}
              >
                <Picker
                  selectedValue={region}
                  onValueChange={(value) => {
                    dismissSearchKeyboard();
                    setRegion(value as typeof region);
                  }}
                  testID="region-filter"
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
              </Host>
              <Host
                matchContents={{ vertical: true }}
                seedColor={theme.accent}
                style={[styles.filterControlHost, largeText && styles.filterControlHostLarge]}
              >
                <Picker
                  selectedValue={level}
                  onValueChange={(value) => {
                    dismissSearchKeyboard();
                    setLevel(value as typeof level);
                  }}
                  testID="level-filter"
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
              </Host>
            </View>
          </View>
        }
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.secondaryText }]}>
            {t(state.locale, 'noMatches')}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.cardCell}>
            <Link href={`/prefecture/${item.code}`} asChild>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={experienceAccessibilityLabel(state.locale, item.names[state.locale], state.levels[item.code])}
                style={({ pressed }) => [
                  styles.card,
                  columns === 1 ? styles.listCard : styles.gridCard,
                  largeText && columns === 1 && styles.listCardLarge,
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
                    source={FLAG_THUMBNAIL_ASSETS[item.code]}
                    contentFit="contain"
                    style={styles.flag}
                    accessibilityLabel={`${item.names[state.locale]} ${t(state.locale, 'flag')}`}
                  />
                </View>
              <View style={[styles.cardBody, largeText && styles.cardBodyLarge]}>
                <View style={[styles.nameRow, largeText && styles.nameRowLarge]}>
                  <Text numberOfLines={largeText ? undefined : 1} style={[styles.name, { color: theme.text }]}>
                      {item.names[state.locale]}
                    </Text>
                    <Text selectable style={[styles.code, { color: theme.accent }]}> {item.code}</Text>
                  </View>
                  <Text style={[styles.region, { color: theme.secondaryText }]}>
                    {REGION_LABELS[state.locale][item.region]}
                  </Text>
                  <LevelIndicator level={state.levels[item.code]} locale={state.locale} />
                </View>
              </Pressable>
            </Link>
          </View>
        )}
      />
      {process.env.EXPO_OS !== 'web' ? (
        <Stack.SearchBar
          ref={searchBarRef}
          autoCapitalize="none"
          hideWhenScrolling={false}
          onCancelButtonPress={() => setSearch('')}
          onChangeText={(event) => setSearch(event.nativeEvent.text)}
          onClose={() => setSearch('')}
          placeholder={t(state.locale, 'searchPlaceholder')}
          placement="stacked"
        />
      ) : null}
      <LanguageStackToolbar />
    </>
  );
}

function FlagCardSeparator() {
  return <View style={styles.cardSeparator} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 54,
  },
  columnWrapper: { gap: 14 },
  filterHost: { alignSelf: 'stretch' },
  filterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterControlsLarge: { flexDirection: 'column', alignItems: 'stretch' },
  filterControlHost: {
    flex: 1,
    minWidth: 0,
  },
  filterControlHostLarge: { flex: 0, width: '100%' },
  filterPanel: {
    borderWidth: 1,
    borderRadius: 26,
    borderCurve: 'continuous',
    padding: 18,
    gap: 14,
    marginBottom: 18,
    boxShadow: '0 12px 30px rgba(24, 43, 53, 0.16)',
  },
  filterHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  filterHeadingLarge: { flexDirection: 'column', alignItems: 'flex-start' },
  filterTitle: { fontSize: 22, fontWeight: '900', letterSpacing: 0.2 },
  countBadge: { borderRadius: 15, paddingHorizontal: 12, paddingVertical: 6 },
  countText: { fontSize: 13, fontWeight: '900', fontVariant: ['tabular-nums'] },
  cardSeparator: { height: 24 },
  cardCell: { flex: 1 },
  card: {
    flex: 1,
    borderWidth: 1,
    borderTopWidth: 4,
    borderRadius: 22,
    borderCurve: 'continuous',
    padding: 13,
    gap: 20,
    boxShadow: '0 6px 18px rgba(34, 48, 56, 0.08)',
  },
  listCard: { flexDirection: 'row', minHeight: 136, alignItems: 'center' },
  listCardLarge: { flexDirection: 'column', alignItems: 'stretch' },
  gridCard: { minHeight: 270 },
  pressed: { opacity: 0.76, transform: [{ scale: 0.99 }] },
  flagFrame: {
    overflow: 'hidden',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: 8,
  },
  listFlagFrame: { width: 132, height: 90 },
  gridFlagFrame: { alignSelf: 'stretch', height: 142 },
  flag: { flex: 1 },
  cardBody: { flex: 1, alignItems: 'flex-start', gap: 5 },
  cardBodyLarge: { alignSelf: 'stretch' },
  nameRow: {
    paddingTop: 8,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  nameRowLarge: { flexWrap: 'wrap' },
  name: { fontSize: 20, fontWeight: '800' },
  code: { fontSize: 13, fontWeight: '900', fontVariant: ['tabular-nums'] },
  region: { fontSize: 14, paddingBottom: 4 },
  empty: { textAlign: 'center', paddingVertical: 64, fontSize: 16 },
});
