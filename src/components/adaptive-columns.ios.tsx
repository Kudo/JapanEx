import { useCallback, useRef, type ComponentRef } from 'react';
import { ScrollView } from 'react-native';

import { NativeArrangement } from '@/components/native-arrangement.ios';
import { useAdaptivePanes } from '@/hooks/use-adaptive-panes';

import { CompactColumns, type AdaptiveColumnsProps } from './compact-columns';

export function AdaptiveColumns(props: AdaptiveColumnsProps) {
  const adaptive = useAdaptivePanes();
  const compactScrollOffset = useRef(0);
  const restoreScroll = useCallback((view: ComponentRef<typeof ScrollView> | null) => {
    const y = compactScrollOffset.current;
    if (view && y > 0) {
      requestAnimationFrame(() => view.scrollTo({ y, animated: false }));
    }
  }, []);
  return props.scroll && adaptive ? (
    <NativeArrangement primary={props.primary} secondary={<>{props.header}{props.secondary}</>} />
  ) : (
    <CompactColumns {...props} scrollRef={restoreScroll}
      onScroll={(event) => { compactScrollOffset.current = Math.max(0, event.nativeEvent.contentOffset.y); }} />
  );
}
