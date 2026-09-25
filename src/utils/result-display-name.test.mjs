import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { resultDisplayName } from './result-display-name.ts';

describe('resultDisplayName()', () => {
  it('should preserve a short display name', () => {
    assert.equal(resultDisplayName('JapanEx QA'), 'JapanEx QA');
  });

  it('should keep long Latin names inside the result header', () => {
    assert.equal(resultDisplayName('W'.repeat(40)), `${'W'.repeat(7)}…`);
  });

  it('should keep long Japanese names inside the result header', () => {
    assert.equal(resultDisplayName('東京都旅行記録'.repeat(6)), '東京都旅行記…');
  });

  it('should keep an emoji sequence intact when truncating', () => {
    assert.equal(resultDisplayName(`${'旅'.repeat(5)}👨‍👩‍👧‍👦${'旅'.repeat(5)}`), `${'旅'.repeat(5)}👨‍👩‍👧‍👦…`);
  });

  it('should keep an emoji sequence intact without Intl.Segmenter', () => {
    const segmenter = Intl.Segmenter;
    try {
      Intl.Segmenter = undefined;
      assert.equal(resultDisplayName(`${'旅'.repeat(5)}👨‍👩‍👧‍👦${'旅'.repeat(5)}`), `${'旅'.repeat(5)}👨‍👩‍👧‍👦…`);
    } finally {
      Intl.Segmenter = segmenter;
    }
  });

  it('should hide a name containing only whitespace', () => {
    assert.equal(resultDisplayName('   '), '');
  });
});
