import { File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import type Svg from 'react-native-svg';

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

export async function saveResult(asset: ResultAsset): Promise<void> {
  const permission = await MediaLibrary.requestPermissionsAsync(true, ['photo']);
  if (!permission.granted) throw new Error('Photo library permission was not granted');
  await MediaLibrary.Asset.create(asset.uri);
}

function captureSvg(svg: Svg | null): Promise<string> {
  if (!svg) return Promise.reject(new Error('Result card is not ready'));
  return new Promise((resolve) => svg.toDataURL(resolve, { width: 2048, height: 2048 }));
}

function decodeBase64(base64: string): Uint8Array {
  const binary = globalThis.atob(base64);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}
