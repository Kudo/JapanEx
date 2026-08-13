import { Button, Column, Host, Picker, TextInput, useNativeState } from '@expo/ui';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Share, StyleSheet, Text as RNText, View } from 'react-native';

import { LanguageStackToolbar } from '@/components/language-stack-toolbar';
import { useAppTheme } from '@/constants/app-theme';
import { APP_LOCALE_OPTIONS, isAppLocale } from '@/i18n/locales';
import { useBoundedContentStyle } from '@/hooks/use-bounded-content-width';
import { t } from '@/i18n/translations';
import { useTracker } from '@/state/tracker-context';
import { buildShareUrl } from '@/utils/share-state';

export function SettingsScreen() {
  const theme = useAppTheme();
  const { isReady } = useTracker();

  if (!isReady) {
    return (
      <>
        <View style={[styles.loading, { backgroundColor: theme.background }]}>
          <ActivityIndicator color={theme.accent} />
        </View>
        <LanguageStackToolbar />
      </>
    );
  }

  return (
    <>
      <ReadySettingsScreen />
      <LanguageStackToolbar />
    </>
  );
}

function ReadySettingsScreen() {
  const theme = useAppTheme();
  const contentStyle = useBoundedContentStyle(720);
  const router = useRouter();
  const { state, score, setDisplayName, setLocale, resetLevels } = useTracker();
  const nameValue = useNativeState(state.displayName);
  const [status, setStatus] = useState('');

  const copyLink = async () => {
    await Clipboard.setStringAsync(buildShareUrl(state));
    setStatus(t(state.locale, 'linkCopied'));
  };

  const shareLink = async () => {
    await Share.share({ message: buildShareUrl(state), title: 'JapanEx' });
  };

  const confirmReset = () => {
    Alert.alert(t(state.locale, 'resetTitle'), t(state.locale, 'resetMessage'), [
      { text: t(state.locale, 'cancel'), style: 'cancel' },
      { text: t(state.locale, 'reset'), style: 'destructive', onPress: resetLevels },
    ]);
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      alwaysBounceVertical
      contentInsetAdjustmentBehavior="always"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.content, contentStyle]}
    >
      <View style={[styles.summary, { backgroundColor: theme.hero }]}>
        <View style={[styles.scoreSeal, { backgroundColor: theme.accent }]}>
          <RNText selectable style={[styles.score, { color: theme.heroText }]}>{score}</RNText>
          <RNText selectable style={[styles.scoreMax, { color: theme.heroText }]}>/ 235</RNText>
        </View>
        <View style={styles.summaryCopy}>
          <RNText style={[styles.summaryEyebrow, { color: theme.heroMuted }]}>
            {t(state.locale, 'score')}
          </RNText>
          <RNText style={[styles.subtitle, { color: theme.heroText }]}>
            {t(state.locale, 'settingsSubtitle')}
          </RNText>
        </View>
      </View>

      <View
        style={[
          styles.sectionCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <RNText style={[styles.sectionTitle, { color: theme.text }]}>
          {t(state.locale, 'displayName')}
        </RNText>
        <Host
          matchContents={{ vertical: true }}
          seedColor={theme.accent}
          style={styles.nativeHost}
        >
          <TextInput
            value={nameValue}
            onChangeText={setDisplayName}
            placeholder={t(state.locale, 'optionalName')}
            placeholderTextColor={theme.secondaryText}
            maxLength={40}
            autoCapitalize="words"
            textStyle={{ color: theme.text, fontSize: 16, lineHeight: 20 }}
            style={{
              width: '100%',
              height: 48,
              paddingHorizontal: 14,
              paddingVertical: 13,
              backgroundColor: theme.surface,
              borderColor: theme.border,
              borderWidth: 1,
              borderRadius: 14,
            }}
          />
        </Host>
      </View>

      <View
        style={[
          styles.sectionCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <RNText style={[styles.sectionTitle, { color: theme.text }]}>
          {t(state.locale, 'language')}
        </RNText>
        <Host matchContents seedColor={theme.accent}>
          <Picker
            selectedValue={state.locale}
            onValueChange={(value) => {
              if (isAppLocale(value)) {
                setLocale(value);
              }
            }}
          >
            {APP_LOCALE_OPTIONS.map((option) => (
              <Picker.Item key={option.value} value={option.value} label={option.label} />
            ))}
          </Picker>
        </Host>
      </View>

      <View
        style={[
          styles.sectionCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <Host
          matchContents={{ vertical: true }}
          seedColor={theme.accent}
          style={styles.nativeHost}
        >
          <Column style={{ width: '100%' }} spacing={10}>
            <Button label={t(state.locale, 'shareView')} onPress={shareLink} />
            <Button label={t(state.locale, 'copyViewLink')} variant="outlined" onPress={copyLink} />
            <Button
              label={t(state.locale, 'aboutCredits')}
              variant="outlined"
              onPress={() => router.push('/about')}
            />
            <Button
              label={t(state.locale, 'privacyPolicy')}
              variant="outlined"
              onPress={() => Linking.openURL('https://japanex.expo.app/privacy/')}
            />
            <Button label={t(state.locale, 'resetProgress')} variant="text" onPress={confirmReset} />
          </Column>
        </Host>
      </View>

      {status ? <RNText selectable style={[styles.status, { color: theme.secondaryText }]}>{status}</RNText> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  nativeHost: { alignSelf: 'stretch' },
  content: {
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 54,
    gap: 16,
  },
  summary: {
    minHeight: 146,
    borderRadius: 28,
    borderCurve: 'continuous',
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    boxShadow: '0 14px 34px rgba(24, 43, 53, 0.18)',
  },
  scoreSeal: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-3deg' }],
  },
  score: { fontSize: 38, lineHeight: 42, fontWeight: '900', fontVariant: ['tabular-nums'] },
  scoreMax: { fontSize: 12, fontWeight: '800', opacity: 0.9 },
  summaryCopy: { flex: 1, gap: 6 },
  summaryEyebrow: { fontSize: 12, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  subtitle: { fontSize: 16, lineHeight: 23, fontWeight: '700' },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 22,
    borderCurve: 'continuous',
    padding: 17,
    gap: 12,
    boxShadow: '0 6px 18px rgba(34, 48, 56, 0.07)',
  },
  sectionTitle: { fontSize: 15, fontWeight: '900', letterSpacing: 0.2 },
  status: { textAlign: 'center', fontSize: 14 },
});
