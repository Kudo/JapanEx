import { Button, Column, Host } from '@expo/ui';
import * as Linking from 'expo-linking';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/constants/app-theme';
import { PREFECTURES } from '@/data/prefectures';
import { t } from '@/i18n/translations';
import { useTracker } from '@/state/tracker-context';

export function AboutScreen() {
  const theme = useAppTheme();
  const { state } = useTracker();

  return (
    <FlatList
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
      data={PREFECTURES}
      keyExtractor={(item) => item.code}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>{t(state.locale, 'creditsTitle')}</Text>
          <Text style={[styles.body, { color: theme.secondaryText }]}>{t(state.locale, 'projectCredit')}</Text>
          <Text style={[styles.body, { color: theme.secondaryText }]}>{t(state.locale, 'flagCredit')}</Text>
          <Text style={[styles.notice, { color: theme.secondaryText }]}>
            {t(state.locale, 'officialInsigniaNotice')}
          </Text>
          <Host matchContents seedColor={theme.accent}>
            <Column spacing={9} style={{ width: '100%' }}>
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
            <Text style={[styles.name, { color: theme.text }]}>{item.names[state.locale]}</Text>
            <Text style={[styles.meta, { color: theme.secondaryText }]}>{item.attribution.author}</Text>
            <Text style={[styles.meta, { color: theme.secondaryText }]}>{item.attribution.license}</Text>
          </View>
          <Host matchContents seedColor={theme.accent}>
            <Button label={t(state.locale, 'source')} variant="text" onPress={() => Linking.openURL(item.attribution.sourceUrl)} />
          </Host>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: 18, paddingBottom: 48, gap: 10 },
  header: { gap: 14, paddingBottom: 14 },
  title: { fontSize: 30, fontWeight: '900' },
  body: { fontSize: 15, lineHeight: 23 },
  notice: { fontSize: 13, lineHeight: 20, fontStyle: 'italic' },
  row: { borderWidth: 1, borderRadius: 15, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowText: { flex: 1, gap: 3 },
  name: { fontSize: 17, fontWeight: '800' },
  meta: { fontSize: 12, lineHeight: 17 },
});
