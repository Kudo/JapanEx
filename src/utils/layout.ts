export function getBoundedContentWidth(
  viewportWidth: number,
  maximumWidth: number,
  horizontalInset = 0,
): number {
  return Math.max(0, Math.min(viewportWidth - horizontalInset, maximumWidth));
}
