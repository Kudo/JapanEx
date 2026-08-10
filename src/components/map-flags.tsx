import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { G, Image as SvgImage, Rect } from 'react-native-svg';

import { FLAG_ASSETS, FLAG_THUMBNAIL_ASSETS } from '@/data/flags';
import { PREFECTURES } from '@/data/prefectures';
import type { AppLocale } from '@/data/types';
import {
  MAP_FLAG_HEIGHT,
  MAP_FLAG_WIDTH,
  MAP_SIZE,
  MAP_X,
  MAP_Y,
  getPrefectureMapAnnotations,
} from '@/utils/map-layout';

type MapFlagsProps = {
  frameWidth: number;
  locale: AppLocale;
};

const RESULT_FLAG_PADDING = 1.5;

export function MapFlags({ frameWidth, locale }: MapFlagsProps) {
  if (frameWidth === 0) {
    return null;
  }

  const mapScale = frameWidth / MAP_SIZE;
  const badgeWidth = MAP_FLAG_WIDTH * mapScale;
  const badgeHeight = MAP_FLAG_HEIGHT * mapScale;
  const annotations = getPrefectureMapAnnotations(locale, true);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {PREFECTURES.map((prefecture) => {
        const flag = annotations[prefecture.code].flag;

        if (!flag) {
          return null;
        }

        return (
          <View
            key={prefecture.code}
            style={[
              styles.flagBadge,
              {
                width: badgeWidth,
                height: badgeHeight,
                left: (flag.x - MAP_X) * mapScale,
                top: (flag.y - MAP_Y) * mapScale,
                borderRadius: 2 * mapScale,
                padding: RESULT_FLAG_PADDING * mapScale,
              },
            ]}
          >
            <Image source={FLAG_ASSETS[prefecture.code]} contentFit="contain" style={styles.flag} />
          </View>
        );
      })}
    </View>
  );
}

export function ResultMapFlags({
  visible,
  locale,
}: {
  visible: boolean;
  locale: AppLocale;
}) {
  const annotations = getPrefectureMapAnnotations(locale, true);

  return (
    <G opacity={visible ? 1 : 0} pointerEvents="none">
      {PREFECTURES.map((prefecture) => {
        const flag = annotations[prefecture.code].flag;

        if (!flag) {
          return null;
        }

        return (
          <G key={prefecture.code}>
            <Rect
              x={flag.x}
              y={flag.y}
              width={flag.width}
              height={flag.height}
              rx={2}
              fill="#FFFFFF"
              stroke="#17212B"
              strokeOpacity={0.42}
              strokeWidth={0.8}
            />
            <SvgImage
              x={flag.x + RESULT_FLAG_PADDING}
              y={flag.y + RESULT_FLAG_PADDING}
              width={flag.width - RESULT_FLAG_PADDING * 2}
              height={flag.height - RESULT_FLAG_PADDING * 2}
              href={FLAG_THUMBNAIL_ASSETS[prefecture.code]}
              preserveAspectRatio="xMidYMid meet"
            />
          </G>
        );
      })}
    </G>
  );
}

const styles = StyleSheet.create({
  flagBadge: {
    position: 'absolute',
    overflow: 'hidden',
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(23, 33, 43, 0.42)',
    backgroundColor: '#FFFFFF',
  },
  flag: {
    width: '100%',
    height: '100%',
  },
});
