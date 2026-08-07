type PinchTranslationOptions = {
  currentFocal: number;
  initialFocal: number;
  initialScale: number;
  initialTranslation: number;
  maximumTranslation: number;
  nextScale: number;
};

export function calculatePinchTranslation({
  currentFocal,
  initialFocal,
  initialScale,
  initialTranslation,
  maximumTranslation,
  nextScale,
}: PinchTranslationOptions): number {
  'worklet';
  const scaleChange = nextScale / initialScale;
  const nextTranslation =
    currentFocal - (initialFocal - initialTranslation) * scaleChange;

  return Math.min(Math.max(nextTranslation, -maximumTranslation), maximumTranslation);
}
