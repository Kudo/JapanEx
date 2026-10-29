import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getBoundedContentWidth, getSafeContentStyle } from './layout.ts';

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

describe('Laying out content around system rails', () => {
  it('should preserve standard phone spacing without a horizontal inset', () => {
    assert.deepEqual(getSafeContentStyle(402, 820, 18, { left: 0, right: 0 }), {
      width: 402, paddingLeft: 18, paddingRight: 18,
    });
  });

  it('should keep folded content clear of the right rail', () => {
    assert.deepEqual(getSafeContentStyle(469, 820, 18, { left: 0, right: 84 }), {
      width: 469, paddingLeft: 18, paddingRight: 102,
    });
  });

  it('should keep split view content clear of the left rail', () => {
    assert.deepEqual(getSafeContentStyle(469, 820, 18, { left: 84, right: 0 }), {
      width: 469, paddingLeft: 102, paddingRight: 18,
    });
  });

  it('should cap unfolded content after reserving both safe areas', () => {
    const style = getSafeContentStyle(1200, 820, 18, { left: 12, right: 84 });
    assert.deepEqual(style, { width: 916, paddingLeft: 30, paddingRight: 102 });
    assert.equal(style.width - style.paddingLeft - style.paddingRight, 820 - 36);
  });

  it('should recalculate the available width across folding and split view', () => {
    const frames = [
      { width: 469, left: 0, right: 84 },
      { width: 1000, left: 0, right: 84 },
      { width: 469, left: 84, right: 0 },
    ];
    assert.deepEqual(frames.map(({ width, ...insets }) => {
      const style = getSafeContentStyle(width, 820, 18, insets);
      return style.width - style.paddingLeft - style.paddingRight;
    }), [349, 784, 349]);
  });

  it('should handle an empty viewport without a negative width', () => {
    assert.equal(getSafeContentStyle(0, 820, 18, { left: 0, right: 84 }).width, 0);
  });
});
