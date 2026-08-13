import { Button, Column, Host } from '@expo/ui';
import * as Clipboard from 'expo-clipboard';
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type Svg from 'react-native-svg';

import { LanguageStackToolbar } from '@/components/language-stack-toolbar';
import { PrefectureSheet } from '@/components/prefecture-sheet';
import { ResultCard } from '@/components/result-card';
import { TrackerSnapshot } from '@/components/tracker-snapshot';
import { useAppTheme } from '@/constants/app-theme';
import type { PrefectureCode } from '@/data/types';
import { useBoundedContentWidth } from '@/hooks/use-bounded-content-width';
import { t } from '@/i18n/translations';
import { useTracker } from '@/state/tracker-context';
import { createResultAsset, saveResult, shareResult } from '@/utils/result-export';
import { buildShareUrl } from '@/utils/share-state';

type MapScreenProps = {
  showFlags: boolean;
  onToggleFlags: () => void;
};

export function MapScreen({ showFlags, onToggleFlags }: MapScreenProps) {
  const theme = useAppTheme();
  const contentWidth = useBoundedContentWidth(820);
  const { state, score, isReady, hasStorageError } = useTracker();
  const [selectedCode, setSelectedCode] = useState<PrefectureCode | null>(null);
  const [status, setStatus] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const resultRef = useRef<Svg>(null);

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
    <>
      <ScrollView
        style={[styles.screen, { backgroundColor: theme.background }]}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { width: contentWidth }]}
      >
        <TrackerSnapshot
          levels={state.levels}
          locale={state.locale}
          score={score}
          isReady={isReady}
          showFlags={showFlags}
          helperText={t(state.locale, 'tapPrefecture')}
          scoreLabel={t(state.locale, 'score')}
          maxScoreLabel={t(state.locale, 'maxScore')}
          onSelect={setSelectedCode}
        />

        <View
          style={[
            styles.actionPanel,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Host
            matchContents={{ vertical: true }}
            seedColor={theme.accent}
            style={styles.nativeHost}
          >
            <Column style={{ width: '100%' }} spacing={10}>
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
                label={t(state.locale, 'copyViewLink')}
                variant="text"
                onPress={copyLink}
              />
            </Column>
          </Host>
        </View>

        {status ? (
          <Text selectable style={[styles.status, { color: theme.secondaryText }]}>
            {status}
          </Text>
        ) : null}
        {hasStorageError ? (
          <Text
            selectable
            accessibilityRole="alert"
            style={[styles.status, { color: theme.danger }]}
          >
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
          showFlags={showFlags}
        />
      </View>

      <PrefectureSheet code={selectedCode} onDismiss={() => setSelectedCode(null)} />
      <LanguageStackToolbar showFlags={showFlags} onToggleFlags={onToggleFlags} />
    </>
  );
}

const styles = StyleSheet.create({
  nativeHost: { alignSelf: 'stretch' },
  screen: { flex: 1 },
  content: {
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 54,
    gap: 18,
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
