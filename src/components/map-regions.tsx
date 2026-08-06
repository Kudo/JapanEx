import { G, Polygon, Rect, Text as SvgText } from 'react-native-svg';

import { LEVEL_COLORS } from '@/constants/app-theme';
import { PREFECTURES } from '@/data/prefectures';
import type { AppLocale, ExperienceLevel, MapShape, PrefectureCode } from '@/data/types';

const LABEL_COLOR = '#17212B';
const LABEL_OUTLINE_COLOR = '#FFFFFF';

type LabelLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
  area: number;
};

const LABEL_LAYOUTS = Object.fromEntries(
  PREFECTURES.map((prefecture) => [
    prefecture.code,
    prefecture.mapShapes.map(getShapeLayout).sort((a, b) => b.area - a.area)[0],
  ]),
) as Record<PrefectureCode, LabelLayout>;

type MapRegionsProps = {
  levels: Record<PrefectureCode, ExperienceLevel>;
  locale: AppLocale;
  stroke: string;
  strokeWidth?: number;
  onSelect?: (code: PrefectureCode) => void;
};

export function MapRegions({
  levels,
  locale,
  stroke,
  strokeWidth = 4,
  onSelect,
}: MapRegionsProps) {
  return PREFECTURES.map((prefecture) => {
    const selectPrefecture = () => onSelect?.(prefecture.code);
    const shapeInteractionProps =
      onSelect && process.env.EXPO_OS !== 'web' ? { onPress: selectPrefecture } : undefined;
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
    const label = getMapLabel(prefecture.names[locale], locale);
    const labelLayout = LABEL_LAYOUTS[prefecture.code];
    const fontSize = getLabelFontSize(label, labelLayout);
    const labelY = labelLayout.y + fontSize * 0.34;
    const outlineWidth = Math.max(2.4, fontSize * 0.18);

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
        <SvgText
          x={labelLayout.x}
          y={labelY}
          textAnchor="middle"
          fontSize={fontSize}
          fontWeight="700"
          fill={LABEL_OUTLINE_COLOR}
          stroke={LABEL_OUTLINE_COLOR}
          strokeWidth={outlineWidth}
          strokeLinejoin="round"
          pointerEvents="none"
        >
          {label}
        </SvgText>
        <SvgText
          x={labelLayout.x}
          y={labelY}
          textAnchor="middle"
          fontSize={fontSize}
          fontWeight="700"
          fill={LABEL_COLOR}
          pointerEvents="none"
        >
          {label}
        </SvgText>
      </G>
    );
  });
}

function getMapLabel(name: string, locale: AppLocale): string {
  if (locale === 'en' || name === '北海道') {
    return name;
  }

  return name.replace(/[都道府県縣]$/, '');
}

function getLabelFontSize(label: string, layout: LabelLayout): number {
  const estimatedWidth = [...label].reduce(
    (width, character) => width + (character.charCodeAt(0) > 255 ? 1 : 0.58),
    0,
  );
  const widthLimit = (layout.width * 0.82) / Math.max(estimatedWidth, 1);
  const heightLimit = layout.height * 0.4;

  return Math.max(8, Math.min(24, widthLimit, heightLimit));
}

function getShapeLayout(shape: MapShape): LabelLayout {
  if (shape.kind === 'rect') {
    return {
      x: shape.x + shape.width / 2,
      y: shape.y + shape.height / 2,
      width: shape.width,
      height: shape.height,
      area: shape.width * shape.height,
    };
  }

  const points = shape.points
    .trim()
    .split(/\s+/)
    .map((point) => point.split(',').map(Number) as [number, number]);
  const xCoordinates = points.map(([x]) => x);
  const yCoordinates = points.map(([, y]) => y);
  const minimumX = Math.min(...xCoordinates);
  const maximumX = Math.max(...xCoordinates);
  const minimumY = Math.min(...yCoordinates);
  const maximumY = Math.max(...yCoordinates);
  const twiceSignedArea = points.reduce((sum, [x, y], index) => {
    const [nextX, nextY] = points[(index + 1) % points.length];
    return sum + x * nextY - nextX * y;
  }, 0);

  return {
    x: (minimumX + maximumX) / 2,
    y: (minimumY + maximumY) / 2,
    width: maximumX - minimumX,
    height: maximumY - minimumY,
    area: Math.abs(twiceSignedArea) / 2,
  };
}
