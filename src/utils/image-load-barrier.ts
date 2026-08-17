export type FrameScheduler = (callback: () => void) => unknown;

export function createImageLoadBarrier<ImageId>(
  imageIds: readonly ImageId[],
  onReady: () => void,
  scheduleFrame: FrameScheduler = requestAnimationFrame,
): (imageId: ImageId) => void {
  const pendingImageIds = new Set(imageIds);
  let didScheduleReady = false;

  return (imageId) => {
    if (didScheduleReady || !pendingImageIds.delete(imageId) || pendingImageIds.size > 0) {
      return;
    }

    didScheduleReady = true;
    scheduleFrame(() => scheduleFrame(onReady));
  };
}
