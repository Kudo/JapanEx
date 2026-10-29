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
