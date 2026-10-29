import { Platform } from 'react-native';

import { useViewportWidth } from '@/hooks/use-bounded-content-width';
import { supportsAdaptivePanes } from '@/utils/layout';

export function useAdaptivePanes() {
  return supportsAdaptivePanes(Platform.OS, Platform.Version, useViewportWidth());
}
