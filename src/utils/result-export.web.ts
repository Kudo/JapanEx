import type Svg from 'react-native-svg';

import type { ResultAsset } from '@/utils/result-export';

export async function createResultAsset(svg: Svg | null): Promise<ResultAsset> {
  const base64 = await captureSvg(svg);
  return {
    uri: `data:image/png;base64,${base64}`,
    fileName: `japanex-${Date.now()}.png`,
    mimeType: 'image/png',
  };
}

export async function shareResult(asset: ResultAsset): Promise<void> {
  const blob = await (await fetch(asset.uri)).blob();
  const file = new File([blob], asset.fileName, { type: asset.mimeType });
  const shareData = { files: [file], title: 'JapanEx', text: 'My JapanEx result' };

  if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
    await navigator.share(shareData);
    return;
  }

  downloadResult(asset);
}

function downloadResult(asset: ResultAsset): void {
  const anchor = document.createElement('a');
  anchor.href = asset.uri;
  anchor.download = asset.fileName;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function captureSvg(svg: Svg | null): Promise<string> {
  if (!svg) return Promise.reject(new Error('Result card is not ready'));
  return new Promise((resolve) => svg.toDataURL(resolve, { width: 2048, height: 2048 }));
}
