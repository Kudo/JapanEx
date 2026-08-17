import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { captureSvg, RESULT_CARD_RENDER_SIZE } from './svg-capture.ts';

const originalExpoOs = process.env.EXPO_OS;

describe('captureSvg()', () => {
  afterEach(() => {
    if (originalExpoOs === undefined) {
      delete process.env.EXPO_OS;
      return;
    }
    process.env.EXPO_OS = originalExpoOs;
  });

  it('should capture the rendered bounds on Android so the artwork fills the bitmap', async () => {
    process.env.EXPO_OS = 'android';
    let receivedArgumentCount = 0;
    const svg = {
      toDataURL(...args) {
        receivedArgumentCount = args.length;
        args[0]('encoded-image');
      },
    };

    assert.equal(await captureSvg(svg), 'encoded-image');
    assert.equal(receivedArgumentCount, 1);
  });

  it('should provide explicit rendered bounds when capturing on iOS', async () => {
    process.env.EXPO_OS = 'ios';
    let receivedOptions;
    const svg = {
      toDataURL(callback, options) {
        receivedOptions = options;
        callback('encoded-image');
      },
    };

    assert.equal(await captureSvg(svg), 'encoded-image');
    assert.deepEqual(receivedOptions, {
      width: RESULT_CARD_RENDER_SIZE,
      height: RESULT_CARD_RENDER_SIZE,
    });
  });

  it('should reject when the result card is unavailable', async () => {
    await assert.rejects(captureSvg(null), /Result card is not ready/);
  });
});
