import { Stack } from 'expo-router';

import { useAppTheme } from '@/constants/app-theme';
import { APP_LOCALE_OPTIONS } from '@/i18n/locales';
import { t } from '@/i18n/translations';
import { useTracker } from '@/state/tracker-context';

type LanguageStackToolbarProps = {
  showFlags?: boolean;
  onToggleFlags?: () => void;
};

export function LanguageStackToolbar({
  showFlags = false,
  onToggleFlags,
}: LanguageStackToolbarProps) {
  const theme = useAppTheme();
  const { state, setLocale } = useTracker();
  const currentLocale = APP_LOCALE_OPTIONS.find((option) => option.value === state.locale)!;

  return (
    <Stack.Toolbar placement="right" tintColor={theme.accent}>
      {onToggleFlags ? (
        <Stack.Toolbar.Button
          accessibilityLabel={t(state.locale, showFlags ? 'hideFlags' : 'showFlags')}
          onPress={onToggleFlags}
          selected={showFlags}
          tintColor={theme.accent}
        >
          {process.env.EXPO_OS === 'ios' ? (
            <Stack.Toolbar.Icon sf={showFlags ? 'flag.fill' : 'flag'} />
          ) : (
            <Stack.Toolbar.Label>{t(state.locale, 'tabsFlags')}</Stack.Toolbar.Label>
          )}
        </Stack.Toolbar.Button>
      ) : null}
      <Stack.Toolbar.Menu
        accessibilityLabel={`${t(state.locale, 'language')}: ${currentLocale.label}`}
        tintColor={theme.accent}
        title={t(state.locale, 'language')}
      >
        {process.env.EXPO_OS === 'ios' ? (
          <Stack.Toolbar.Icon sf="globe" />
        ) : (
          <Stack.Toolbar.Label>{`文 ${currentLocale.shortLabel}`}</Stack.Toolbar.Label>
        )}
        {APP_LOCALE_OPTIONS.map((option) => (
          <Stack.Toolbar.MenuAction
            key={option.value}
            isOn={option.value === state.locale}
            onPress={() => setLocale(option.value)}
          >
            {option.label}
          </Stack.Toolbar.MenuAction>
        ))}
      </Stack.Toolbar.Menu>
    </Stack.Toolbar>
  );
}
