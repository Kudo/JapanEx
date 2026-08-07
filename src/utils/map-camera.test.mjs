import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { calculatePinchTranslation } from './map-camera.ts';

describe('calculatePinchTranslation()', () => {
  it('should keep the camera centered when pinching around the map center', () => {
    assert.equal(
      calculatePinchTranslation({
        currentFocal: 0,
        initialFocal: 0,
        initialScale: 1,
        initialTranslation: 0,
        maximumTranslation: 160,
        nextScale: 2,
      }),
      0,
    );
  });

  it('should move the camera to keep an off-center focal point anchored', () => {
    assert.equal(
      calculatePinchTranslation({
        currentFocal: 80,
        initialFocal: 80,
        initialScale: 1,
        initialTranslation: 0,
        maximumTranslation: 160,
        nextScale: 2,
      }),
      -80,
    );
  });

  it('should include focal point movement while pinching', () => {
    assert.equal(
      calculatePinchTranslation({
        currentFocal: 100,
        initialFocal: 80,
        initialScale: 1,
        initialTranslation: 0,
        maximumTranslation: 160,
        nextScale: 2,
      }),
      -60,
    );
  });

  it('should clamp camera movement to the visible map bounds', () => {
    assert.equal(
      calculatePinchTranslation({
        currentFocal: -160,
        initialFocal: 160,
        initialScale: 1,
        initialTranslation: 0,
        maximumTranslation: 80,
        nextScale: 2,
      }),
      -80,
    );
  });
});
