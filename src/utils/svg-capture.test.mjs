import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { RESULT_CARD_PIXEL_SIZE } from './result-card-size.ts';
import { captureSvg } from './svg-capture.ts';

const originalExpoOs = process.env.EXPO_OS;

describe('captureSvg()', () => {
  afterEach(() => {
    if (originalExpoOs === undefined) {
      delete process.env.EXPO_OS;
      return;
    }
    process.env.EXPO_OS = originalExpoOs;
  });

  it('should keep the export target at 2048 pixels per side', () => {
    assert.equal(RESULT_CARD_PIXEL_SIZE, 2048);
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

  it('should capture fractional rendered bounds on iOS without truncating options', async () => {
    process.env.EXPO_OS = 'ios';
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

  it('should scale the web capture to the export pixel size', async () => {
    process.env.EXPO_OS = 'web';
    let receivedOptions;
    const svg = {
      toDataURL(callback, options) {
        receivedOptions = options;
        callback('encoded-image');
      },
    };

    assert.equal(await captureSvg(svg), 'encoded-image');
    assert.deepEqual(receivedOptions, { width: 2048, height: 2048 });
  });

  it('should reject when the result card is unavailable', async () => {
    await assert.rejects(captureSvg(null), /Result card is not ready/);
  });

  it('should reject when native capture returns no image', async () => {
    process.env.EXPO_OS = 'ios';
    await assert.rejects(captureSvg({ toDataURL: (callback) => callback() }), /returned no image/);
  });
});
