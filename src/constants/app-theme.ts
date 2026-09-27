import { useAppColorScheme } from '@/hooks/use-app-color-scheme';

import { darkTheme, lightTheme } from './app-theme-values';

export { LEVEL_COLORS, type AppTheme } from './app-theme-values';

export function useAppTheme() {
  return useAppColorScheme() === 'dark' ? darkTheme : lightTheme;
}

export const RESULT_THEME = lightTheme;
