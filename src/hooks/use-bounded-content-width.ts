import { useWindowDimensions, type ViewStyle } from 'react-native';

import { getBoundedContentWidth } from '@/utils/layout';

export function useViewportWidth(): number {
  const { width } = useWindowDimensions();
  return width;
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
