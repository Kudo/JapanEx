import { Button, Column, Host } from '@expo/ui';
import * as Linking from 'expo-linking';
import { Stack } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/constants/app-theme';
import { LanguageStackToolbar } from '@/components/language-stack-toolbar';
import { PREFECTURES } from '@/data/prefectures';
import { t } from '@/i18n/translations';
import { useBoundedContentWidth } from '@/hooks/use-bounded-content-width';
import { useTracker } from '@/state/tracker-context';

export function AboutScreen() {
  const theme = useAppTheme();
  const contentWidth = useBoundedContentWidth(760);
  const { state } = useTracker();

  return (
    <>
      <FlatList
        style={{ backgroundColor: theme.background }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { width: contentWidth }]}
        data={PREFECTURES}
        keyExtractor={(item) => item.code}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text selectable style={[styles.body, { color: theme.secondaryText }]}>{t(state.locale, 'projectCredit')}</Text>
            <Text selectable style={[styles.body, { color: theme.secondaryText }]}>{t(state.locale, 'flagCredit')}</Text>
            <Text selectable style={[styles.notice, { color: theme.secondaryText }]}>
              {t(state.locale, 'officialInsigniaNotice')}
            </Text>
            <Host
              matchContents={{ vertical: true }}
              seedColor={theme.accent}
              style={styles.nativeHost}
            >
              <Column style={{ width: '100%' }} spacing={9}>
                <Button
                  label={t(state.locale, 'sourceCode')}
                  variant="outlined"
                  onPress={() => Linking.openURL('https://github.com/ukyouz/JapanEx')}
                />
                <Button
                  label={t(state.locale, 'commonsCategory')}
                  variant="outlined"
                  onPress={() =>
                    Linking.openURL('https://commons.wikimedia.org/wiki/Category:SVG_flags_of_prefectures_of_Japan')
                  }
                />
              </Column>
            </Host>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.rowText}>
              <Text selectable style={[styles.name, { color: theme.text }]}>{item.names[state.locale]}</Text>
              <Text selectable style={[styles.meta, { color: theme.secondaryText }]}>{item.attribution.author}</Text>
              <Text selectable style={[styles.meta, { color: theme.secondaryText }]}>{item.attribution.license}</Text>
            </View>
            <Host matchContents seedColor={theme.accent}>
              <Button label={t(state.locale, 'source')} variant="text" onPress={() => Linking.openURL(item.attribution.sourceUrl)} />
            </Host>
          </View>
        )}
      />
      <Stack.Title>{t(state.locale, 'creditsTitle')}</Stack.Title>
      <LanguageStackToolbar />
    </>
  );
}

const styles = StyleSheet.create({
  nativeHost: { alignSelf: 'stretch' },
  content: {
    alignSelf: 'center',
    padding: 18,
    paddingBottom: 48,
    gap: 10,
  },
  header: { gap: 14, paddingBottom: 14 },
  body: { fontSize: 15, lineHeight: 23 },
  notice: { fontSize: 13, lineHeight: 20, fontStyle: 'italic' },
  row: { borderWidth: 1, borderRadius: 15, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowText: { flex: 1, gap: 3 },
  name: { fontSize: 17, fontWeight: '800' },
  meta: { fontSize: 12, lineHeight: 17 },
});
