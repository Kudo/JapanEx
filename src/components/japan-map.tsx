import { Button, Host, Row } from '@expo/ui';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Rect } from 'react-native-svg';

import { MapRegions } from '@/components/map-regions';
import { useAppTheme } from '@/constants/app-theme';
import type { ExperienceLevel, PrefectureCode } from '@/data/types';
import { t } from '@/i18n/translations';
import { useTracker } from '@/state/tracker-context';

const MAP_X = 318;
const MAP_Y = -317.5;
const MAP_SIZE = 1147.5;
const MIN_ZOOM = 1;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.5;

type JapanMapProps = {
  levels: Record<PrefectureCode, ExperienceLevel>;
  onSelect: (code: PrefectureCode) => void;
};

export function JapanMap({ levels, onSelect }: JapanMapProps) {
  const theme = useAppTheme();
  const { state } = useTracker();
  const [zoomLevel, setZoomLevel] = useState(MIN_ZOOM);
  const scale = useSharedValue(MIN_ZOOM);
  const savedScale = useSharedValue(MIN_ZOOM);
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const savedTranslationX = useSharedValue(0);
  const savedTranslationY = useSharedValue(0);
  const mapWidth = useSharedValue(320);

  const gesture = useMemo(() => {
    const pinch = Gesture.Pinch()
      .onStart(() => {
        savedScale.set(scale.get());
      })
      .onUpdate((event) => {
        scale.set(clampWorklet(savedScale.get() * event.scale, MIN_ZOOM, MAX_ZOOM));
      })
      .onEnd(() => {
        const nextScale = clampWorklet(scale.get(), MIN_ZOOM, MAX_ZOOM);
        scale.set(withTiming(nextScale));
        if (nextScale === MIN_ZOOM) {
          translationX.set(withTiming(0));
          translationY.set(withTiming(0));
        } else {
          const maximum = (mapWidth.get() * (nextScale - 1)) / 2;
          translationX.set(withTiming(clampWorklet(translationX.get(), -maximum, maximum)));
          translationY.set(withTiming(clampWorklet(translationY.get(), -maximum, maximum)));
        }
        runOnJS(setZoomLevel)(nextScale);
      });

    const pan = Gesture.Pan()
      .minDistance(8)
      .onStart(() => {
        savedTranslationX.set(translationX.get());
        savedTranslationY.set(translationY.get());
      })
      .onUpdate((event) => {
        const maximum = (mapWidth.get() * (scale.get() - 1)) / 2;
        translationX.set(
          clampWorklet(savedTranslationX.get() + event.translationX, -maximum, maximum),
        );
        translationY.set(
          clampWorklet(savedTranslationY.get() + event.translationY, -maximum, maximum),
        );
      });

    return Gesture.Simultaneous(pinch, pan);
  }, [mapWidth, savedScale, savedTranslationX, savedTranslationY, scale, translationX, translationY]);

  const animatedMapStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.get() },
      { translateY: translationY.get() },
      { scale: scale.get() },
    ],
  }));

  const animateToZoom = (requestedZoom: number) => {
    const nextZoom = clamp(requestedZoom, MIN_ZOOM, MAX_ZOOM);
    setZoomLevel(nextZoom);
    scale.set(withTiming(nextZoom));

    if (nextZoom === MIN_ZOOM) {
      translationX.set(withTiming(0));
      translationY.set(withTiming(0));
      return;
    }

    const maximum = (mapWidth.get() * (nextZoom - 1)) / 2;
    translationX.set(withTiming(clamp(translationX.get(), -maximum, maximum)));
    translationY.set(withTiming(clamp(translationY.get(), -maximum, maximum)));
  };

  return (
    <View style={styles.wrapper}>
      <GestureDetector gesture={gesture}>
        <View
          onLayout={(event) => mapWidth.set(event.nativeEvent.layout.width)}
          style={[
            styles.mapFrame,
            { backgroundColor: theme.ocean, borderColor: theme.border },
          ]}
        >
          <Animated.View style={[styles.animatedMap, animatedMapStyle]}>
            <Svg
              width="100%"
              height="100%"
              viewBox={`${MAP_X} ${MAP_Y} ${MAP_SIZE} ${MAP_SIZE}`}
              preserveAspectRatio="xMidYMid meet"
            >
              <Rect x={MAP_X} y={MAP_Y} width={MAP_SIZE} height={MAP_SIZE} fill={theme.ocean} />
              <MapRegions
                levels={levels}
                locale={state.locale}
                stroke={theme.mapStroke}
                strokeWidth={zoomLevel > 1 ? 3 : 4}
                onSelect={onSelect}
              />
            </Svg>
          </Animated.View>
        </View>
      </GestureDetector>

      <Host matchContents seedColor={theme.accent}>
        <Row spacing={8} alignment="center">
          <Button
            label={t(state.locale, 'zoomOut')}
            variant="outlined"
            disabled={zoomLevel <= MIN_ZOOM}
            onPress={() => animateToZoom(zoomLevel - ZOOM_STEP)}
          />
          <Button
            label={t(state.locale, 'resetView')}
            variant="text"
            onPress={() => animateToZoom(MIN_ZOOM)}
          />
          <Button
            label={t(state.locale, 'zoomIn')}
            variant="outlined"
            disabled={zoomLevel >= MAX_ZOOM}
            onPress={() => animateToZoom(zoomLevel + ZOOM_STEP)}
          />
        </Row>
      </Host>
    </View>
  );
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

function clampWorklet(value: number, minimum: number, maximum: number): number {
  'worklet';
  return Math.min(Math.max(value, minimum), maximum);
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 12,
    alignItems: 'center',
  },
  mapFrame: {
    width: '100%',
    maxWidth: 680,
    aspectRatio: 1,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  animatedMap: {
    position: 'absolute',
    inset: 0,
  },
});
