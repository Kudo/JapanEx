import { Button, Column, Host } from '@expo/ui';
import * as Clipboard from 'expo-clipboard';
import { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type Svg from 'react-native-svg';

import { LanguageStackToolbar } from '@/components/language-stack-toolbar';
import { PrefectureSheet } from '@/components/prefecture-sheet';
import { ResultCard } from '@/components/result-card';
import { TrackerSnapshot } from '@/components/tracker-snapshot';
import { useAppTheme } from '@/constants/app-theme';
import type { PrefectureCode } from '@/data/types';
import { useBoundedContentStyle } from '@/hooks/use-bounded-content-width';
import { t } from '@/i18n/translations';
import { useTracker } from '@/state/tracker-context';
import { createResultAsset, shareResult } from '@/utils/result-export';
import { buildShareUrl } from '@/utils/share-state';
import { RESULT_CARD_RENDER_SIZE } from '@/utils/svg-capture';

type MapScreenProps = {
  showFlags: boolean;
  onToggleFlags: () => void;
};

export function MapScreen({ showFlags, onToggleFlags }: MapScreenProps) {
  const theme = useAppTheme();
  const contentStyle = useBoundedContentStyle(820);
  const { state, score, isReady, hasStorageError } = useTracker();
  const [selectedCode, setSelectedCode] = useState<PrefectureCode | null>(null);
  const [status, setStatus] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const resultRef = useRef<Svg | null>(null);
  const resolveResultRef = useRef<((result: Svg) => void) | null>(null);
  const flagsReadyRef = useRef(false);
  const resolveFlagsReadyRef = useRef<(() => void) | null>(null);

  const handleResultRef = useCallback((result: Svg | null) => {
    resultRef.current = result;
    if (result && resolveResultRef.current) {
      resolveResultRef.current(result);
      resolveResultRef.current = null;
    }
  }, []);

  const handleFlagsReady = useCallback(() => {
    flagsReadyRef.current = true;
    resolveFlagsReadyRef.current?.();
    resolveFlagsReadyRef.current = null;
  }, []);

  const waitForResultCard = async () => {
    const resultCard = resultRef.current ?? await new Promise<Svg>((resolve) => {
      resolveResultRef.current = resolve;
    });

    if (showFlags && !flagsReadyRef.current) {
      await new Promise<void>((resolve) => {
        resolveFlagsReadyRef.current = resolve;
      });
    }

    return resultCard;
  };

  const handleShareResult = async () => {
    flagsReadyRef.current = false;
    setIsExporting(true);
    setStatus('');
    try {
      const resultCard = await waitForResultCard();
      const asset = await createResultAsset(resultCard);
      await shareResult(asset);
      setStatus(t(state.locale, 'imageShared'));
    } catch {
      setStatus(t(state.locale, 'exportFailed'));
    } finally {
      resolveResultRef.current = null;
      resolveFlagsReadyRef.current = null;
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
        alwaysBounceVertical
        contentInsetAdjustmentBehavior="always"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, contentStyle]}
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
                onPress={handleShareResult}
              />
              <Button
                label={t(state.locale, 'copyViewLink')}
                variant="outlined"
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

      {isExporting ? (
        <View style={styles.exportSurface}>
          <ResultCard
            ref={handleResultRef}
            locale={state.locale}
            displayName={state.displayName}
            score={score}
            levels={state.levels}
            onFlagsReady={handleFlagsReady}
            showFlags={showFlags}
          />
        </View>
      ) : null}

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
    left: -RESULT_CARD_RENDER_SIZE * 2,
    top: 0,
    width: RESULT_CARD_RENDER_SIZE,
    height: RESULT_CARD_RENDER_SIZE,
    opacity: 0,
    pointerEvents: 'none',
  },
});
