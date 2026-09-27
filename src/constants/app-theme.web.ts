import { lightTheme } from './app-theme-values';

export { LEVEL_COLORS, type AppTheme } from './app-theme-values';

const webTheme = Object.fromEntries(
  Object.keys(lightTheme).map((key) => [key, `var(--japanex-${key})`]),
) as typeof lightTheme;

export function useAppTheme() {
  return webTheme;
}

export const RESULT_THEME = lightTheme;
