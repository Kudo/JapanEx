import type Svg from 'react-native-svg';

import { RESULT_CARD_PIXEL_SIZE } from './result-card-size.ts';
import { withTimeout } from './promise-timeout.ts';

const SVG_CAPTURE_TIMEOUT_MS = 30_000;

export function captureSvg(svg: Pick<Svg, 'toDataURL'> | null): Promise<string> {
  if (!svg) {
    return Promise.reject(new Error('Result card is not ready'));
  }

  const capture = new Promise<string>((resolve, reject) => {
    const handleData = (data: string) => {
      if (typeof data === 'string' && data.length > 0) {
        resolve(data);
      } else {
        reject(new Error('Result card capture returned no image'));
      }
    };
    if (process.env.EXPO_OS === 'web') {
      svg.toDataURL(handleData, {
        width: RESULT_CARD_PIXEL_SIZE,
        height: RESULT_CARD_PIXEL_SIZE,
      });
      return;
    }

    // Native renderers capture the already sized view; iOS truncates fractional dimensions in options.
    svg.toDataURL(handleData);
  });

  return withTimeout(capture, SVG_CAPTURE_TIMEOUT_MS, 'Result card capture did not complete');
}
