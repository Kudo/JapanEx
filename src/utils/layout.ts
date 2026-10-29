export function getBoundedContentWidth(
  viewportWidth: number,
  maximumWidth: number,
  horizontalInset = 0,
): number {
  return Math.max(0, Math.min(viewportWidth - horizontalInset, maximumWidth));
}

// @ref LLP 0000#adaptive-window-layout
export function getSafeContentStyle(
  viewportWidth: number,
  maximumWidth: number,
  horizontalPadding: number,
  insets: { left: number; right: number },
) {
  return {
    width: getBoundedContentWidth(viewportWidth, maximumWidth + insets.left + insets.right),
    paddingLeft: horizontalPadding + insets.left,
    paddingRight: horizontalPadding + insets.right,
  };
}

// @ref LLP 0000#adaptive-window-layout
export function supportsAdaptivePanes(platform: string, version: number | string, width: number): boolean {
  return platform === 'ios' && Number.parseFloat(String(version)) >= 27.1 && width >= 600;
}

export function shouldStackFlagCard(cardWidth: number, fontScale: number): boolean {
  const flagAndSpacingWidth = 180;
  const minimumTextWidth = 160 * Math.max(1, fontScale);
  return cardWidth < flagAndSpacingWidth + minimumTextWidth;
}
