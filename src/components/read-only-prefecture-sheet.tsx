import { BottomSheet, Column, RNHostView, Text } from '@expo/ui';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { useAppTheme } from '@/constants/app-theme';
import { FLAG_ASSETS } from '@/data/flags';
import { PREFECTURES_BY_CODE } from '@/data/prefectures';
import type { AppLocale, ExperienceLevel, PrefectureCode } from '@/data/types';
import { LEVEL_LABELS, t } from '@/i18n/translations';

type ReadOnlyPrefectureSheetProps = {
  code: PrefectureCode | null;
  levels: Record<PrefectureCode, ExperienceLevel>;
  locale: AppLocale;
  onDismiss: () => void;
};

export function ReadOnlyPrefectureSheet({
  code,
  levels,
  locale,
  onDismiss,
}: ReadOnlyPrefectureSheetProps) {
  const theme = useAppTheme();
  const prefecture = code ? PREFECTURES_BY_CODE[code] : null;

  // @ref LLP 0000#adaptive-window-layout
  return (
    <BottomSheet
      isPresented={Boolean(prefecture)}
      onDismiss={onDismiss}
      snapPoints={['half']}
      showDragIndicator
    >
      {prefecture ? (
        <Column
          alignment="center"
          spacing={14}
          style={{ width: '100%', paddingHorizontal: 20, paddingVertical: 12 }}
        >
          <Text
            textStyle={{
              fontSize: 24,
              fontWeight: '700',
              color: theme.text,
              textAlign: 'center',
            }}
          >
            {prefecture.names[locale]}
          </Text>
          <RNHostView matchContents style={{ width: 240, height: 132 }}>
            <Image
              source={FLAG_ASSETS[prefecture.code]}
              contentFit="contain"
              style={styles.flag}
              accessibilityLabel={`${prefecture.names[locale]} ${t(locale, 'flag')}`}
            />
          </RNHostView>
          <Text textStyle={{ fontSize: 14, color: theme.secondaryText }}>
            {t(locale, 'level')}
          </Text>
          <Text textStyle={{ fontSize: 18, fontWeight: '700', color: theme.text }}>
            {`${levels[prefecture.code]} · ${LEVEL_LABELS[locale][levels[prefecture.code]]}`}
          </Text>
        </Column>
      ) : null}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  flag: { width: 240, height: 132 },
});
