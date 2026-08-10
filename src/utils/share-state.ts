import {
  PREFECTURE_CODES,
  type AppLocale,
  type ExperienceLevel,
  type TrackerStateV1,
} from '../data/types.ts';

const DEFAULT_SHARE_BASE_URL = 'https://japanex.expo.app';

export type SharedStateParams = {
  v?: string | string[];
  s?: string | string[];
  l?: string | string[];
  n?: string | string[];
};

export type SharedStateResult =
  | { ok: true; state: TrackerStateV1; score: number }
  | { ok: false; reason: string };

export type ImportParams = SharedStateParams;
export type ImportResult = SharedStateResult;

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export function encodeLevels(state: TrackerStateV1): string {
  return PREFECTURE_CODES.map((code) => state.levels[code]).join('');
}

export function buildShareUrl(state: TrackerStateV1): string {
  const base = (process.env.EXPO_PUBLIC_SHARE_BASE_URL || DEFAULT_SHARE_BASE_URL).replace(/\/+$/, '');
  const query = new URLSearchParams({
    v: '1',
    s: encodeLevels(state),
    l: state.locale,
  });

  if (state.displayName) query.set('n', state.displayName);
  return `${base}/view?${query.toString()}`;
}

export function parseSharedStateParams(params: SharedStateParams): SharedStateResult {
  const version = first(params.v);
  const digits = first(params.s);
  const locale = first(params.l);
  const displayName = first(params.n);

  if (version !== '1') return { ok: false, reason: 'unsupported-version' };
  if (!/^[0-5]{47}$/.test(digits)) return { ok: false, reason: 'invalid-levels' };
  if (!['ja', 'zh-Hant', 'en'].includes(locale)) return { ok: false, reason: 'invalid-locale' };
  if (displayName.length > 40) return { ok: false, reason: 'name-too-long' };

  const levels = Object.fromEntries(
    PREFECTURE_CODES.map((code, index) => [code, Number(digits[index]) as ExperienceLevel]),
  ) as TrackerStateV1['levels'];
  const state: TrackerStateV1 = {
    version: 1,
    levels,
    locale: locale as AppLocale,
    displayName,
  };

  const score = PREFECTURE_CODES.reduce((total, code) => total + levels[code], 0);
  return { ok: true, state, score };
}

export const parseImportParams = parseSharedStateParams;
