import type { ReactElement, ReactNode } from 'react';

export type GalleryLayoutProps = {
  filters: ReactNode;
  children: ReactElement;
};

export function GalleryLayout({ children }: GalleryLayoutProps) {
  return children;
}
