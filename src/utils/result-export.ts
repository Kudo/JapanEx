import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import type Svg from 'react-native-svg';

import { captureSvg } from '@/utils/svg-capture';

export type ResultAsset = {
  uri: string;
  fileName: string;
  mimeType: 'image/png';
};

export async function createResultAsset(svg: Svg | null): Promise<ResultAsset> {
  const base64 = await captureSvg(svg);
  const fileName = `japanex-${Date.now()}.png`;
  const file = new File(Paths.cache, fileName);
  file.create({ overwrite: true, intermediates: true });
  file.write(decodeBase64(base64));

  return { uri: file.uri, fileName, mimeType: 'image/png' };
}

export async function shareResult(asset: ResultAsset): Promise<void> {
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Sharing is unavailable on this device');
  }
  await Sharing.shareAsync(asset.uri, {
    dialogTitle: 'Share JapanEx result',
    mimeType: asset.mimeType,
    UTI: 'public.png',
  });
}

function decodeBase64(base64: string): Uint8Array {
  const binary = globalThis.atob(base64);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}
