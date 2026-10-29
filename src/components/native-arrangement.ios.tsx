import { ArrangementView, Host, RNHostView, VStack } from '@expo/ui/swift-ui';
import { arrangementViewStyle, frame, splitArrangementLayoutSize } from '@expo/ui/swift-ui/modifiers';
import { useState, type ReactElement, type ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { MapPaneHeightContext } from '@/components/map-pane-height';

type NativeArrangementProps = {
  primary: ReactNode;
  secondary: ReactElement;
  secondaryScrolls?: boolean;
  primaryIdealWidth?: number;
  secondaryIdealWidth?: number;
};

// @ref LLP 0000#adaptive-window-layout — the system places both panes around the fold.
export function NativeArrangement({
  primary,
  secondary,
  secondaryScrolls = true,
  primaryIdealWidth = 560,
  secondaryIdealWidth = 320,
}: NativeArrangementProps) {
  const [primaryHeight, setPrimaryHeight] = useState<number | null>(null);
  return (
    <Host style={styles.screen}>
      <ArrangementView modifiers={[arrangementViewStyle('split'), frame({ maxWidth: Infinity, maxHeight: Infinity })]}>
        <ArrangementView.Primary>
          <VStack modifiers={[frame({ maxWidth: Infinity }), splitArrangementLayoutSize({ minWidth: 280, idealWidth: primaryIdealWidth })]}>
            <RNHostView onLayout={(event) => setPrimaryHeight(event.nativeEvent.layout.height)}>
              <ScrollView contentInsetAdjustmentBehavior="always" showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}>
                <MapPaneHeightContext value={primaryHeight}>{primary}</MapPaneHeightContext>
              </ScrollView>
            </RNHostView>
          </VStack>
        </ArrangementView.Primary>
        <ArrangementView.Secondary>
          <VStack modifiers={[frame({ maxWidth: Infinity }), splitArrangementLayoutSize({ minWidth: 280, idealWidth: secondaryIdealWidth })]}>
            <RNHostView>
              {secondaryScrolls ? (
                <ScrollView contentInsetAdjustmentBehavior="always" showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.content}>
                  {secondary}
                </ScrollView>
              ) : secondary}
            </RNHostView>
          </VStack>
        </ArrangementView.Secondary>
      </ArrangementView>
    </Host>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 18, paddingBottom: 36, gap: 18 },
});
