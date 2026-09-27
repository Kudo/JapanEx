import type { ExperienceLevel } from '@/data/types';

export const LEVEL_COLORS: Record<ExperienceLevel, string> = {
  0: '#F4F1EA',
  1: '#557BC4',
  2: '#4E9873',
  3: '#DCAE45',
  4: '#DC7B4B',
  5: '#C94F4F',
};

export const lightTheme = {
  background: '#F4F0E7',
  surface: '#FFFDF8',
  surfaceMuted: '#EEE8DC',
  text: '#1D2D39',
  secondaryText: '#66727A',
  border: '#DED5C7',
  accent: '#C94F43',
  accentSoft: '#F5DDD7',
  ocean: '#D8E8EC',
  mapStroke: '#243A46',
  danger: '#B42318',
  hero: '#203A47',
  heroText: '#FFFDF7',
  heroMuted: '#C4D6DA',
  gold: '#DDA94C',
};

export const darkTheme: typeof lightTheme = {
  background: '#10171C',
  surface: '#19232A',
  surfaceMuted: '#26333A',
  text: '#F7F1E7',
  secondaryText: '#ABB8BC',
  border: '#37454B',
  accent: '#EE7468',
  accentSoft: '#4A2929',
  ocean: '#203B46',
  mapStroke: '#0C151A',
  danger: '#FF8A80',
  hero: '#18313D',
  heroText: '#FFF9EF',
  heroMuted: '#AFC7CD',
  gold: '#E4B65D',
};

export type AppTheme = typeof lightTheme;
