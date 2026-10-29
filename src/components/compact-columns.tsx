import type { ReactNode, Ref, ComponentRef } from 'react';
import { ScrollView, View, type ScrollViewProps } from 'react-native';

import { useSafeContentStyle } from '@/hooks/use-bounded-content-width';

export type AdaptiveColumnsProps = {
  primary: ReactNode;
  secondary: ReactNode;
  header?: ReactNode;
  scroll?: boolean;
  scrollRef?: Ref<ComponentRef<typeof ScrollView>>;
  onScroll?: ScrollViewProps['onScroll'];
};

export function CompactColumns({ primary, secondary, header, scroll, scrollRef, onScroll }: AdaptiveColumnsProps) {
  const contentStyle = useSafeContentStyle(820, 18);
  const content = <View style={{ gap: 18 }}>{header}{primary}{secondary}</View>;
  return scroll ? (
    <ScrollView ref={scrollRef} contentInsetAdjustmentBehavior="always" showsVerticalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
      contentContainerStyle={[{ alignSelf: 'center', paddingHorizontal: 18, paddingTop: 14, paddingBottom: 54 }, contentStyle]}>
      {content}
    </ScrollView>
  ) : content;
}
