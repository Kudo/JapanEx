import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getBoundedContentWidth } from './layout.ts';

describe('getBoundedContentWidth()', () => {
  it('should use the viewport width when it is below the maximum', () => {
    assert.equal(getBoundedContentWidth(402, 720), 402);
  });

  it('should cap the width on a large viewport', () => {
    assert.equal(getBoundedContentWidth(1024, 720), 720);
  });

  it('should subtract the horizontal inset before applying the maximum', () => {
    assert.equal(getBoundedContentWidth(402, 620, 40), 362);
  });

  it('should return zero when the inset is larger than the viewport', () => {
    assert.equal(getBoundedContentWidth(30, 620, 40), 0);
  });
});
