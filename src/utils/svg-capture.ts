import type Svg from 'react-native-svg';

export const RESULT_CARD_RENDER_SIZE = 768;

export function captureSvg(svg: Pick<Svg, 'toDataURL'> | null): Promise<string> {
  if (!svg) {
    return Promise.reject(new Error('Result card is not ready'));
  }

  return new Promise((resolve) => {
    if (process.env.EXPO_OS === 'ios') {
      svg.toDataURL(resolve, {
        width: RESULT_CARD_RENDER_SIZE,
        height: RESULT_CARD_RENDER_SIZE,
      });
      return;
    }

    // Android does not scale the drawing when larger output dimensions are passed.
    svg.toDataURL(resolve);
  });
}
