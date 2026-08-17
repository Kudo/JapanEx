import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createImageLoadBarrier } from './image-load-barrier.ts';

describe('createImageLoadBarrier()', () => {
  it('should notify after every image loads and two render frames complete', () => {
    const scheduledFrames = [];
    let readyCount = 0;
    const handleImageLoad = createImageLoadBarrier(
      ['01', '02'],
      () => {
        readyCount += 1;
      },
      (callback) => scheduledFrames.push(callback),
    );

    handleImageLoad('01');
    assert.equal(scheduledFrames.length, 0);

    handleImageLoad('02');
    assert.equal(scheduledFrames.length, 1);
    assert.equal(readyCount, 0);

    scheduledFrames.shift()();
    assert.equal(scheduledFrames.length, 1);
    assert.equal(readyCount, 0);

    scheduledFrames.shift()();
    assert.equal(readyCount, 1);
  });

  it('should ignore duplicate and unknown image load events', () => {
    const scheduledFrames = [];
    const handleImageLoad = createImageLoadBarrier(
      ['01', '02'],
      () => {},
      (callback) => scheduledFrames.push(callback),
    );

    handleImageLoad('01');
    handleImageLoad('01');
    handleImageLoad('unknown');
    assert.equal(scheduledFrames.length, 0);

    handleImageLoad('02');
    handleImageLoad('02');
    assert.equal(scheduledFrames.length, 1);
  });
});
