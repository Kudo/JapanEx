import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getBoundedContentWidth, getSafeContentStyle, supportsAdaptivePanes, shouldStackFlagCard } from './layout.ts';

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

describe('Adapting native panes to the current window', () => {
  it('should enable native arrangements on a supported regular-width window', () => {
    assert.equal(supportsAdaptivePanes('ios', '27.1', 600), true);
    assert.equal(supportsAdaptivePanes('ios', '28.0', 951), true);
  });

  it('should keep folded and split view windows in the compact layout', () => {
    for (const width of [0, 385, 469, 599]) {
      assert.equal(supportsAdaptivePanes('ios', '27.1', width), false);
    }
  });

  it('should retain the existing layout on older iOS, Android, and web', () => {
    assert.equal(supportsAdaptivePanes('ios', '27.0', 951), false);
    assert.equal(supportsAdaptivePanes('android', 37, 951), false);
    assert.equal(supportsAdaptivePanes('web', '27.1', 951), false);
  });

  it('should avoid native panes when the platform version or width is unavailable', () => {
    assert.equal(supportsAdaptivePanes('ios', 'unknown', 951), false);
    assert.equal(supportsAdaptivePanes('ios', '27.1', NaN), false);
  });
});

describe('Fitting flag card metadata', () => {
  it('should retain rows when the flag and metadata fit at the default text size', () => {
    assert.equal(shouldStackFlagCard(375, 1), false);
    assert.equal(shouldStackFlagCard(354, 1), false);
  });

  it('should stack a narrow phone card before its level badge overflows', () => {
    assert.equal(shouldStackFlagCard(284, 1), true);
  });

  it('should account for enlarged text before the accessibility layout threshold', () => {
    assert.equal(shouldStackFlagCard(375, 1.5), true);
    assert.equal(shouldStackFlagCard(419, 1.5), true);
    assert.equal(shouldStackFlagCard(420, 1.5), false);
  });

  it('should preserve the minimum text budget with small text or an empty viewport', () => {
    assert.equal(shouldStackFlagCard(339, 0.8), true);
    assert.equal(shouldStackFlagCard(340, 0.8), false);
    assert.equal(shouldStackFlagCard(0, 1), true);
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
