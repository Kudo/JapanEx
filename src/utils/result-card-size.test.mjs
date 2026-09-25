import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getResultCardRenderSize } from './result-card-size.ts';

describe('getResultCardRenderSize()', () => {
  it('should target 2048 physical pixels on a standard-density device', () => {
    assert.equal(getResultCardRenderSize('android', 1), 2048);
  });

  it('should round native layout up so rasterization never starts below target resolution', () => {
    assert.equal(getResultCardRenderSize('ios', 3), 683);
    assert.equal(getResultCardRenderSize('android', 2.625), 781);
  });

  it('should keep a smaller web layout surface for canvas scaling', () => {
    assert.equal(getResultCardRenderSize('web', 3), 768);
  });

  it('should reject invalid native pixel ratios', () => {
    assert.throws(() => getResultCardRenderSize('android', 0), /Invalid device pixel ratio/);
  });
});
