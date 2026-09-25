import { Button, Column, Host } from '@expo/ui';
import * as Clipboard from 'expo-clipboard';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, PixelRatio, ScrollView, StyleSheet, Text, View } from 'react-native';
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
import { getResultCardRenderSize } from '@/utils/result-card-size';
import { withTimeout } from '@/utils/promise-timeout';

// @ref LLP 0000#result-rendering-and-export
const RESULT_CARD_READY_TIMEOUT_MS = 15_000;

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
  const [exportPhase, setExportPhase] = useState<'idle' | 'preparing' | 'sharing'>('idle');
  const isExporting = exportPhase !== 'idle';
  const renderSize = getResultCardRenderSize(process.env.EXPO_OS, PixelRatio.get());
  const resultRef = useRef<Svg | null>(null);
  const resolveResultRef = useRef<((result: Svg) => void) | null>(null);
  const layoutReadyRef = useRef(false);
  const resolveLayoutReadyRef = useRef<(() => void) | null>(null);
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

  const handleResultLayout = useCallback(() => {
    layoutReadyRef.current = true;
    resolveLayoutReadyRef.current?.();
    resolveLayoutReadyRef.current = null;
  }, []);

  const waitForResultCard = async () => {
    const resultCard = resultRef.current ?? await new Promise<Svg>((resolve) => {
      resolveResultRef.current = resolve;
    });

    if (!layoutReadyRef.current) {
      await new Promise<void>((resolve) => {
        resolveLayoutReadyRef.current = resolve;
      });
    }

    if (showFlags && !flagsReadyRef.current) {
      await new Promise<void>((resolve) => {
        resolveFlagsReadyRef.current = resolve;
      });
    }

    return resultCard;
  };

  const handleShareResult = async () => {
    layoutReadyRef.current = false;
    flagsReadyRef.current = false;
    setExportPhase('preparing');
    setStatus('');
    try {
      const resultCard = await withTimeout(
        waitForResultCard(),
        RESULT_CARD_READY_TIMEOUT_MS,
        'Result card did not become ready',
      );
      const asset = await createResultAsset(resultCard);
      setExportPhase('sharing');
      const wasShared = await shareResult(asset);
      if (wasShared) {
        setStatus(t(state.locale, 'imageShared'));
      }
    } catch (error) {
      console.error('Result image export failed', error);
      setStatus(t(state.locale, 'exportFailed'));
    } finally {
      resolveResultRef.current = null;
      resolveLayoutReadyRef.current = null;
      resolveFlagsReadyRef.current = null;
      setExportPhase('idle');
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
          {exportPhase === 'preparing' ? (
            <View style={styles.exportProgress}>
              <ActivityIndicator color={theme.accent} />
              <Text
                accessibilityLiveRegion="polite"
                style={[styles.exportProgressText, { color: theme.secondaryText }]}
              >
                {t(state.locale, 'preparingImage')}
              </Text>
            </View>
          ) : null}
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
        <View style={[styles.exportSurface, { left: -renderSize * 2, width: renderSize, height: renderSize }]}>
          <ResultCard
            ref={handleResultRef}
            locale={state.locale}
            displayName={state.displayName}
            score={score}
            levels={state.levels}
            onFlagsReady={handleFlagsReady}
            onLayout={handleResultLayout}
            showFlags={showFlags}
            renderSize={renderSize}
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
  exportProgress: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  exportProgressText: { flex: 1, fontSize: 14, lineHeight: 20 },
  status: { fontSize: 14, lineHeight: 20, textAlign: 'center' },
  exportSurface: {
    position: 'absolute',
    top: 0,
    opacity: 0,
    pointerEvents: 'none',
  },
});
