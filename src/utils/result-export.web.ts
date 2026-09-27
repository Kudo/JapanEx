import type Svg from 'react-native-svg';

import type { ResultAsset } from '@/utils/result-export';
import { captureSvg } from '@/utils/svg-capture';

export async function createResultAsset(svg: Svg | null): Promise<ResultAsset> {
  const base64 = await captureSvg(svg);
  return {
    uri: `data:image/png;base64,${base64}`,
    fileName: `japanex-${Date.now()}.png`,
    mimeType: 'image/png',
  };
}

export async function shareResult(asset: ResultAsset): Promise<boolean> {
  if (navigator.share && typeof File !== 'undefined') {
    try {
      const blob = await (await fetch(asset.uri)).blob();
      const file = new File([blob], asset.fileName, { type: asset.mimeType });
      const shareData = { files: [file], title: 'JapanEx', text: 'My JapanEx result' };
      if (!navigator.canShare || navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return true;
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return false;
      }
    }
  }

  downloadResult(asset);
  return true;
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
