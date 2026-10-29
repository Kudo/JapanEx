import { useWindowDimensions, type ViewStyle } from 'react-native';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';

import { getBoundedContentWidth, getSafeContentStyle } from '@/utils/layout';

function useContentFrame() {
  const { width } = useWindowDimensions();
  const frame = useSafeAreaFrame();
  const insets = useSafeAreaInsets();

  return {
    width: process.env.EXPO_OS === 'web' ? width : frame.width || width,
    insets,
  };
}

export function useViewportWidth(): number {
  const { width, insets } = useContentFrame();
  return Math.max(0, width - insets.left - insets.right);
}

// @ref LLP 0000#adaptive-window-layout
export function useSafeContentStyle(maximumWidth: number, horizontalPadding: number): ViewStyle {
  const { width, insets } = useContentFrame();

  if (process.env.EXPO_OS === 'web') {
    return { width: '100%', maxWidth: maximumWidth };
  }

  return getSafeContentStyle(width, maximumWidth, horizontalPadding, insets);
}

export function useBoundedContentStyle(
  maximumWidth: number,
  horizontalInset = 0,
): Pick<ViewStyle, 'width' | 'maxWidth'> {
  const width = useViewportWidth();

  if (process.env.EXPO_OS === 'web') {
    return { width: '100%', maxWidth: maximumWidth };
  }

  return { width: getBoundedContentWidth(width, maximumWidth, horizontalInset) };
}
