import { PREFECTURES } from '@/data/prefectures';
import type { AppLocale, PrefectureCode } from '@/data/types';
import {
  createMapAnnotation,
  getShapeLayout,
  resolveMapAnnotationCollisions,
  type MapAnnotationLayout,
  type PrefectureMapLayout,
} from '@/utils/map-annotations';

export {
  MAP_FLAG_GAP,
  MAP_FLAG_HEIGHT,
  MAP_FLAG_WIDTH,
  type MapAnnotationLayout,
  type PrefectureMapLayout,
} from '@/utils/map-annotations';

export const MAP_X = 318;
export const MAP_Y = -317.5;
export const MAP_SIZE = 1147.5;

const MAP_ANNOTATION_PADDING = 3;
const MAP_ANNOTATION_BOUNDS = {
  left: MAP_X + MAP_ANNOTATION_PADDING,
  right: MAP_X + MAP_SIZE - MAP_ANNOTATION_PADDING,
  top: MAP_Y + MAP_ANNOTATION_PADDING,
  bottom: MAP_Y + MAP_SIZE - MAP_ANNOTATION_PADDING,
};

export const PREFECTURE_MAP_LAYOUTS = Object.fromEntries(
  PREFECTURES.map((prefecture) => [
    prefecture.code,
    prefecture.mapShapes.map(getShapeLayout).sort((a, b) => b.area - a.area)[0],
  ]),
) as Record<PrefectureCode, PrefectureMapLayout>;

const MAP_ANNOTATIONS = {
  ja: createPrefectureMapAnnotations('ja'),
  'zh-Hant': createPrefectureMapAnnotations('zh-Hant'),
  en: createPrefectureMapAnnotations('en'),
} satisfies Record<
  AppLocale,
  {
    labels: Record<PrefectureCode, MapAnnotationLayout>;
    labelsAndFlags: Record<PrefectureCode, MapAnnotationLayout>;
  }
>;

export function getPrefectureMapAnnotations(
  locale: AppLocale,
  showFlags: boolean,
): Record<PrefectureCode, MapAnnotationLayout> {
  return MAP_ANNOTATIONS[locale][showFlags ? 'labelsAndFlags' : 'labels'];
}

function createPrefectureMapAnnotations(locale: AppLocale) {
  return {
    labels: createAnnotationRecord(locale, false),
    labelsAndFlags: createAnnotationRecord(locale, true),
  };
}

function createAnnotationRecord(
  locale: AppLocale,
  showFlag: boolean,
): Record<PrefectureCode, MapAnnotationLayout> {
  const annotations = PREFECTURES.map((prefecture) =>
    createMapAnnotation({
      code: prefecture.code,
      name: prefecture.names[locale],
      locale,
      mapLayout: PREFECTURE_MAP_LAYOUTS[prefecture.code],
      showFlag,
    }),
  );

  return Object.fromEntries(
    resolveMapAnnotationCollisions(annotations, MAP_ANNOTATION_BOUNDS).map((annotation) => [
      annotation.code,
      annotation,
    ]),
  ) as Record<PrefectureCode, MapAnnotationLayout>;
}
