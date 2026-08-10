import { G, Polygon, Rect, Text as SvgText } from 'react-native-svg';

import { LEVEL_COLORS } from '@/constants/app-theme';
import { PREFECTURES } from '@/data/prefectures';
import type { AppLocale, ExperienceLevel, PrefectureCode } from '@/data/types';
import { getPrefectureMapAnnotations } from '@/utils/map-layout';

const LABEL_COLOR = '#17212B';
const LABEL_OUTLINE_COLOR = '#FFFFFF';

type MapRegionsProps = {
  levels: Record<PrefectureCode, ExperienceLevel>;
  locale: AppLocale;
  stroke: string;
  strokeWidth?: number;
  showFlags?: boolean;
  onSelect?: (code: PrefectureCode) => void;
};

export function MapRegions({
  levels,
  locale,
  stroke,
  strokeWidth = 4,
  showFlags = false,
  onSelect,
}: MapRegionsProps) {
  const annotations = getPrefectureMapAnnotations(locale, showFlags);

  return (
    <>
      {PREFECTURES.map((prefecture) => {
        const selectPrefecture = () => onSelect?.(prefecture.code);
        const shapeInteractionProps =
          onSelect && process.env.EXPO_OS !== 'web'
            ? { onPress: selectPrefecture }
            : undefined;
        const interactionProps = onSelect
          ? process.env.EXPO_OS === 'web'
            ? {
                // react-native-svg web otherwise overwrites an explicit onClick with undefined.
                onPress: null as never,
                onClick: selectPrefecture,
                onKeyDown: (event: { key: string; preventDefault: () => void }) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    selectPrefecture();
                  }
                },
                tabIndex: 0,
                'aria-label': prefecture.names[locale],
              }
            : {
                onPress: selectPrefecture,
                accessible: true,
                accessibilityLabel: prefecture.names[locale],
              }
          : undefined;

        return (
          <G key={prefecture.code} {...interactionProps}>
            {prefecture.mapShapes.map((shape, index) => {
              const commonProps = {
                fill: LEVEL_COLORS[levels[prefecture.code]],
                stroke,
                strokeWidth,
                strokeLinejoin: 'round' as const,
                ...shapeInteractionProps,
              };

              if (shape.kind === 'rect') {
                const { kind: _kind, ...rect } = shape;
                return <Rect key={index} {...commonProps} {...rect} />;
              }

              return <Polygon key={index} {...commonProps} points={shape.points} />;
            })}
          </G>
        );
      })}

      <G pointerEvents="none">
        {PREFECTURES.map((prefecture) => {
          const { label } = annotations[prefecture.code];

          return (
            <G key={prefecture.code}>
              <SvgText
                x={label.x}
                y={label.y}
                textAnchor="middle"
                fontSize={label.fontSize}
                fontWeight="700"
                fill={LABEL_OUTLINE_COLOR}
                stroke={LABEL_OUTLINE_COLOR}
                strokeWidth={label.outlineWidth}
                strokeLinejoin="round"
              >
                {label.text}
              </SvgText>
              <SvgText
                x={label.x}
                y={label.y}
                textAnchor="middle"
                fontSize={label.fontSize}
                fontWeight="700"
                fill={LABEL_COLOR}
              >
                {label.text}
              </SvgText>
            </G>
          );
        })}
      </G>
    </>
  );
}
