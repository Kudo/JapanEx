import { File, Paths } from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as Sharing from 'expo-sharing';
import type Svg from 'react-native-svg';

import { RESULT_CARD_PIXEL_SIZE } from '@/utils/result-card-size';
import { captureSvg } from '@/utils/svg-capture';

export type ResultAsset = {
  uri: string;
  fileName: string;
  mimeType: 'image/png';
};

export async function createResultAsset(svg: Svg | null): Promise<ResultAsset> {
  const fileName = `japanex-${Date.now()}.png`;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const base64 = await captureSvg(svg);
    const sourceFile = new File(Paths.cache, `source-${attempt}-${fileName}`);
    sourceFile.create({ overwrite: true, intermediates: true });
    try {
      // @ref LLP 0000#result-rendering-and-export — iOS SVG output may contain base64 line breaks.
      sourceFile.write(base64, { encoding: 'base64' });

      // @ref LLP 0000#result-rendering-and-export — native pixel rounding can miss 2048 by a few pixels.
      const context = ImageManipulator.manipulate(sourceFile.uri);
      context.resize({ width: RESULT_CARD_PIXEL_SIZE, height: RESULT_CARD_PIXEL_SIZE });
      let image;
      try {
        image = await context.renderAsync();
      } catch (error) {
        if (process.env.EXPO_OS !== 'android' || attempt > 0) {
          throw error;
        }
        // @ref LLP 0000#result-rendering-and-export — Android can reject a newly captured flags image once.
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });
        continue;
      }

      const result = await image.saveAsync({ format: SaveFormat.PNG });
      if (result.width !== RESULT_CARD_PIXEL_SIZE || result.height !== RESULT_CARD_PIXEL_SIZE) {
        new File(result.uri).delete();
        throw new Error('Result image has the wrong dimensions');
      }

      const file = new File(result.uri);
      await file.move(new File(Paths.cache, fileName));
      return { uri: file.uri, fileName, mimeType: 'image/png' };
    } finally {
      if (sourceFile.exists) {
        sourceFile.delete();
      }
    }
  }
  throw new Error('Result image could not be decoded');
}

export async function shareResult(asset: ResultAsset): Promise<boolean> {
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Sharing is unavailable on this device');
  }
  await Sharing.shareAsync(asset.uri, {
    dialogTitle: 'Share JapanEx result',
    mimeType: asset.mimeType,
    UTI: 'public.png',
  });
  return true;
}
