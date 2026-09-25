// @ref LLP 0000#result-rendering-and-export — native SVG layout uses points, while exports use pixels.
export const RESULT_CARD_PIXEL_SIZE = 2048;
const WEB_RENDER_SIZE = 768;

export function getResultCardRenderSize(platform: string | undefined, pixelRatio: number): number {
  if (platform === 'web') return WEB_RENDER_SIZE;
  if (!Number.isFinite(pixelRatio) || pixelRatio <= 0) {
    throw new Error('Invalid device pixel ratio');
  }
  return Math.ceil(RESULT_CARD_PIXEL_SIZE / pixelRatio);
}
