import { NativeArrangement } from '@/components/native-arrangement.ios';
import { useAdaptivePanes } from '@/hooks/use-adaptive-panes';

import type { GalleryLayoutProps } from './gallery-layout';

export function GalleryLayout({ filters, children }: GalleryLayoutProps) {
  return useAdaptivePanes() ? (
    <NativeArrangement primary={filters} secondary={children} secondaryScrolls={false}
      primaryIdealWidth={320} secondaryIdealWidth={560} />
  ) : children;
}
