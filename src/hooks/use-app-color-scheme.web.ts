import { useSyncExternalStore } from 'react';

const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

function subscribeToColorScheme(onChange: () => void) {
  const mediaQuery = window.matchMedia(DARK_SCHEME_QUERY);
  mediaQuery.addEventListener('change', onChange);
  return () => mediaQuery.removeEventListener('change', onChange);
}

function getColorScheme() {
  return window.matchMedia(DARK_SCHEME_QUERY).matches ? 'dark' : 'light';
}

// @ref LLP 0000#application-shell-and-navigation
function getServerColorScheme() {
  return 'light';
}

export function useAppColorScheme() {
  return useSyncExternalStore(subscribeToColorScheme, getColorScheme, getServerColorScheme);
}
