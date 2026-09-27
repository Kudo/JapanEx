import { Stack } from 'expo-router';

import { useAppTheme } from '@/constants/app-theme';
import { APP_LOCALE_OPTIONS } from '@/i18n/locales';
import { t } from '@/i18n/translations';
import { useTracker } from '@/state/tracker-context';

const FLAG_ICON =
  process.env.EXPO_OS === 'android' ? require('../../assets/icons/flag.xml') : undefined;
const FLAG_FILLED_ICON =
  process.env.EXPO_OS === 'android' ? require('../../assets/icons/flag-filled.xml') : undefined;
const TRANSLATE_ICON =
  process.env.EXPO_OS === 'android'
    ? require('../../assets/icons/translate.xml')
    : undefined;

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

  if (process.env.EXPO_OS === 'web') {
    return null;
  }

  return (
    <Stack.Toolbar placement="right" tintColor={theme.accent}>
      {onToggleFlags ? (
        <Stack.Toolbar.Button
          accessibilityLabel={t(state.locale, showFlags ? 'hideFlags' : 'showFlags')}
          icon={
            process.env.EXPO_OS === 'ios'
              ? showFlags
                ? 'flag.fill'
                : 'flag'
              : showFlags
                ? FLAG_FILLED_ICON
                : FLAG_ICON
          }
          onPress={onToggleFlags}
          selected={showFlags}
          tintColor={theme.accent}
        />
      ) : null}
      <Stack.Toolbar.Menu
        accessibilityLabel={`${t(state.locale, 'language')}: ${currentLocale.label}`}
        icon={process.env.EXPO_OS === 'ios' ? 'globe' : TRANSLATE_ICON}
        tintColor={theme.accent}
        title={t(state.locale, 'language')}
      >
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
