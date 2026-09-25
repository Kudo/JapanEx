import { BottomSheet, Button, Column, Picker, RNHostView, Text } from '@expo/ui';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, useWindowDimensions } from 'react-native';

import { useAppTheme } from '@/constants/app-theme';
import { FLAG_ASSETS } from '@/data/flags';
import { PREFECTURES_BY_CODE } from '@/data/prefectures';
import type { ExperienceLevel, PrefectureCode } from '@/data/types';
import { LEVEL_LABELS, t } from '@/i18n/translations';
import { useTracker } from '@/state/tracker-context';

type PrefectureSheetProps = {
  code: PrefectureCode | null;
  onDismiss: () => void;
};

export function PrefectureSheet({ code, onDismiss }: PrefectureSheetProps) {
  const theme = useAppTheme();
  const router = useRouter();
  const { state, setLevel } = useTracker();
  const { width } = useWindowDimensions();
  const prefecture = code ? PREFECTURES_BY_CODE[code] : null;
  const contentWidth = Math.min(width - 32, 520);

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
          style={{ width: contentWidth, paddingHorizontal: 20, paddingVertical: 12 }}
        >
          <Text
            textStyle={{
              fontSize: 24,
              fontWeight: '700',
              color: theme.text,
              textAlign: 'center',
            }}
          >
            {prefecture.names[state.locale]}
          </Text>
          <RNHostView matchContents style={{ width: 240, height: 132 }}>
            <Image
              source={FLAG_ASSETS[prefecture.code]}
              contentFit="contain"
              style={styles.flag}
              accessibilityLabel={`${prefecture.names[state.locale]} ${t(state.locale, 'flag')}`}
            />
          </RNHostView>
          <Text textStyle={{ fontSize: 14, color: theme.secondaryText }}>
            {t(state.locale, 'level')}
          </Text>
          <Picker
            selectedValue={state.levels[prefecture.code]}
            onValueChange={(value) => setLevel(prefecture.code, value as ExperienceLevel)}
          >
            {([0, 1, 2, 3, 4, 5] as ExperienceLevel[]).map((level) => (
              <Picker.Item
                key={level}
                value={level}
                label={`${level} · ${LEVEL_LABELS[state.locale][level]}`}
              />
            ))}
          </Picker>
          <Button
            label={prefecture.names[state.locale]}
            variant="outlined"
            onPress={() => {
              onDismiss();
              router.push(`/prefecture/${prefecture.code}`);
            }}
          />
        </Column>
      ) : null}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  flag: {
    width: 240,
    height: 132,
  },
});
