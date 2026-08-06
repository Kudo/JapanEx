import { getLocales } from 'expo-localization';

import {
  PREFECTURE_CODES,
  type AppLocale,
  type ExperienceLevel,
  type PrefectureCode,
  type TrackerStateV1,
} from '@/data/types';

export function getInitialLocale(): AppLocale {
  const languageTag = getLocales()[0]?.languageTag.toLowerCase() ?? 'en';
  if (languageTag.startsWith('ja')) return 'ja';
  if (languageTag.startsWith('zh')) return 'zh-Hant';
  return 'en';
}

export function createEmptyLevels(): Record<PrefectureCode, ExperienceLevel> {
  return Object.fromEntries(PREFECTURE_CODES.map((code) => [code, 0])) as Record<
    PrefectureCode,
    ExperienceLevel
  >;
}

export function createInitialState(locale = getInitialLocale()): TrackerStateV1 {
  return {
    version: 1,
    levels: createEmptyLevels(),
    locale,
    displayName: '',
  };
}

export function calculateScore(levels: Record<PrefectureCode, ExperienceLevel>): number {
  return PREFECTURE_CODES.reduce((total, code) => total + levels[code], 0);
}

export function validateTrackerState(value: unknown): TrackerStateV1 | null {
  if (!value || typeof value !== 'object') return null;

  const candidate = value as Partial<TrackerStateV1>;
  if (candidate.version !== 1) return null;
  if (!candidate.levels || typeof candidate.levels !== 'object') return null;
  if (!['ja', 'zh-Hant', 'en'].includes(candidate.locale ?? '')) return null;
  if (typeof candidate.displayName !== 'string' || candidate.displayName.length > 40) return null;

  const levels = {} as Record<PrefectureCode, ExperienceLevel>;
  for (const code of PREFECTURE_CODES) {
    const level = candidate.levels[code];
    if (!Number.isInteger(level) || level! < 0 || level! > 5) return null;
    levels[code] = level as ExperienceLevel;
  }

  return {
    version: 1,
    levels,
    locale: candidate.locale as AppLocale,
    displayName: candidate.displayName,
  };
}
