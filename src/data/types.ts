export const PREFECTURE_CODES = [
  '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
  '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
  '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
  '41', '42', '43', '44', '45', '46', '47',
] as const;

export type PrefectureCode = (typeof PREFECTURE_CODES)[number];
export type ExperienceLevel = 0 | 1 | 2 | 3 | 4 | 5;
export type AppLocale = 'ja' | 'zh-Hant' | 'en';

export const REGION_CODES = [
  'hokkaido',
  'tohoku',
  'kanto',
  'chubu',
  'kansai',
  'chugoku',
  'shikoku',
  'kyushu-okinawa',
] as const;

export type RegionCode = (typeof REGION_CODES)[number];

export type MapShape =
  | { kind: 'rect'; x: number; y: number; width: number; height: number }
  | { kind: 'polygon'; points: string };

export type PrefectureAttribution = {
  sourceUrl: string;
  author: string;
  license: 'Public domain' | 'CC BY-SA 3.0';
  licenseUrl: string;
  officialInsignia: true;
};

export type Prefecture = {
  code: PrefectureCode;
  slug: string;
  region: RegionCode;
  names: Record<AppLocale, string>;
  flagAssetKey: string;
  attribution: PrefectureAttribution;
  mapShapes: MapShape[];
};

export type TrackerStateV1 = {
  version: 1;
  levels: Record<PrefectureCode, ExperienceLevel>;
  locale: AppLocale;
  displayName: string;
};
