import { Button, Column, Host, Picker, Text } from '@expo/ui';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text as RNText, View } from 'react-native';

import { LevelIndicator } from '@/components/level-indicator';
import { LanguageStackToolbar } from '@/components/language-stack-toolbar';
import { useAppTheme } from '@/constants/app-theme';
import { FLAG_ASSETS } from '@/data/flags';
import { isPrefectureCode, PREFECTURES_BY_CODE } from '@/data/prefectures';
import type { ExperienceLevel } from '@/data/types';
import { useBoundedContentStyle } from '@/hooks/use-bounded-content-width';
import { LEVEL_LABELS, REGION_LABELS, t } from '@/i18n/translations';
import { useTracker } from '@/state/tracker-context';

export function PrefectureDetailScreen() {
  const theme = useAppTheme();
  const contentStyle = useBoundedContentStyle(720);
  const router = useRouter();
  const { code = '' } = useLocalSearchParams<{ code: string }>();
  const { state, setLevel } = useTracker();
  const prefecture = isPrefectureCode(code) ? PREFECTURES_BY_CODE[code] : null;

  if (!prefecture) {
    return (
      <>
        <ScrollView
          style={{ backgroundColor: theme.background }}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.notFound}
        >
          <RNText selectable style={[styles.notFoundText, { color: theme.text }]}>
            {t(state.locale, 'notFound')}
          </RNText>
          <Host matchContents seedColor={theme.accent}>
            <Button label={t(state.locale, 'returnHome')} onPress={() => router.replace('/')} />
          </Host>
        </ScrollView>
        <Stack.Title>{t(state.locale, 'notFound')}</Stack.Title>
        <LanguageStackToolbar />
      </>
    );
  }

  const localizedName = prefecture.names[state.locale];

  return (
    <>
      <ScrollView
        style={{ backgroundColor: theme.background }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, contentStyle]}
      >
        <Image
          source={FLAG_ASSETS[prefecture.code]}
          contentFit="contain"
          style={[styles.flag, { backgroundColor: theme.surface, borderColor: theme.border }]}
          accessibilityLabel={`${localizedName} ${t(state.locale, 'flag')}`}
        />

        <View style={styles.titleBlock}>
          <RNText selectable style={[styles.region, { color: theme.secondaryText }]}>
            {REGION_LABELS[state.locale][prefecture.region]} · JIS {prefecture.code}
          </RNText>
          <LevelIndicator level={state.levels[prefecture.code]} locale={state.locale} />
        </View>

        <Host
          matchContents={{ vertical: true }}
          seedColor={theme.accent}
          style={styles.nativeHost}
        >
          <Column style={{ width: '100%' }} spacing={14}>
            <Text textStyle={{ fontSize: 16, fontWeight: '700', color: theme.text }}>
              {t(state.locale, 'level')}
            </Text>
            <Picker
              selectedValue={state.levels[prefecture.code]}
              onValueChange={(value) => setLevel(prefecture.code, value as ExperienceLevel)}
            >
              {([0, 1, 2, 3, 4, 5] as ExperienceLevel[]).map((level) => (
                <Picker.Item key={level} value={level} label={`${level} · ${LEVEL_LABELS[state.locale][level]}`} />
              ))}
            </Picker>
          </Column>
        </Host>

        <View style={[styles.creditCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <RNText style={[styles.creditHeading, { color: theme.text }]}>{t(state.locale, 'offline')}</RNText>
          <RNText selectable style={[styles.creditText, { color: theme.secondaryText }]}>
            {t(state.locale, 'author')}: {prefecture.attribution.author}
          </RNText>
          <RNText selectable style={[styles.creditText, { color: theme.secondaryText }]}>
            {t(state.locale, 'license')}: {prefecture.attribution.license}
          </RNText>
          <RNText selectable style={[styles.notice, { color: theme.secondaryText }]}>
            {t(state.locale, 'officialInsigniaNotice')}
          </RNText>
          <Host
            matchContents={{ vertical: true }}
            seedColor={theme.accent}
            style={styles.nativeHost}
          >
            <Column style={{ width: '100%' }} spacing={8}>
              <Button
                label={t(state.locale, 'source')}
                variant="outlined"
                onPress={() => Linking.openURL(prefecture.attribution.sourceUrl)}
              />
              <Button
                label={t(state.locale, 'license')}
                variant="text"
                onPress={() => Linking.openURL(prefecture.attribution.licenseUrl)}
              />
            </Column>
          </Host>
        </View>
      </ScrollView>
      <Stack.Title>{localizedName}</Stack.Title>
      <LanguageStackToolbar />
    </>
  );
}

const styles = StyleSheet.create({
  nativeHost: { alignSelf: 'stretch' },
  content: {
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 50,
    gap: 22,
  },
  flag: { alignSelf: 'stretch', aspectRatio: 1.5, borderWidth: 1, borderRadius: 20 },
  titleBlock: { alignItems: 'center', gap: 7 },
  region: { fontSize: 15 },
  creditCard: { borderWidth: 1, borderRadius: 18, padding: 18, gap: 10 },
  creditHeading: { fontSize: 18, fontWeight: '800' },
  creditText: { fontSize: 14, lineHeight: 21 },
  notice: { fontSize: 13, lineHeight: 19, fontStyle: 'italic' },
  notFound: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', gap: 18, padding: 20 },
  notFoundText: { fontSize: 22, fontWeight: '800' },
});
