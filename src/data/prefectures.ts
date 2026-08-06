import mapShapeData from '@/data/map-shapes.json';
import prefectureData from '@/data/prefectures.json';
import type { MapShape, Prefecture, PrefectureCode } from '@/data/types';

export const PREFECTURES = prefectureData.map((item) => {
  const { author, license, licenseUrl, sourceUrl, officialInsignia, ...metadata } = item;
  return {
    ...metadata,
    code: item.code as PrefectureCode,
    region: item.region as Prefecture['region'],
    names: item.names as Prefecture['names'],
    attribution: {
      author,
      license: license as Prefecture['attribution']['license'],
      licenseUrl,
      sourceUrl,
      officialInsignia: officialInsignia as true,
    },
    mapShapes: mapShapeData[item.code as keyof typeof mapShapeData] as MapShape[],
  };
}) satisfies Prefecture[];

export const PREFECTURES_BY_CODE = Object.fromEntries(
  PREFECTURES.map((prefecture) => [prefecture.code, prefecture]),
) as Record<PrefectureCode, Prefecture>;

export function isPrefectureCode(value: string): value is PrefectureCode {
  return value in PREFECTURES_BY_CODE;
}
