import type { AppLocale } from '@/data/types';

export const APP_LOCALE_OPTIONS = [
  { value: 'ja', label: '日本語', shortLabel: '日' },
  { value: 'zh-Hant', label: '繁體中文', shortLabel: '繁' },
  { value: 'en', label: 'English', shortLabel: 'EN' },
] as const satisfies readonly {
  value: AppLocale;
  label: string;
  shortLabel: string;
}[];

export function isAppLocale(value: string): value is AppLocale {
  return APP_LOCALE_OPTIONS.some((option) => option.value === value);
}
