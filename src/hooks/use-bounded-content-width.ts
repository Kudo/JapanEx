import { useWindowDimensions } from 'react-native';

import { getBoundedContentWidth } from '@/utils/layout';

export function useBoundedContentWidth(maximumWidth: number, horizontalInset = 0): number {
  const { width } = useWindowDimensions();
  return getBoundedContentWidth(width, maximumWidth, horizontalInset);
}
