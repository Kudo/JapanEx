import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import { PREFECTURE_CODES } from '../data/types.ts';
import { buildShareUrl, encodeLevels, parseSharedStateParams } from './share-state.ts';

const originalShareBaseUrl = process.env.EXPO_PUBLIC_SHARE_BASE_URL;

function createState() {
  return {
    version: 1,
    levels: Object.fromEntries(PREFECTURE_CODES.map((code, index) => [code, index % 6])),
    locale: 'zh-Hant',
    displayName: '工藤 太郎',
  };
}

describe('Shared state links', () => {
  beforeEach(() => {
    delete process.env.EXPO_PUBLIC_SHARE_BASE_URL;
  });

  afterEach(() => {
    if (originalShareBaseUrl === undefined) {
      delete process.env.EXPO_PUBLIC_SHARE_BASE_URL;
    } else {
      process.env.EXPO_PUBLIC_SHARE_BASE_URL = originalShareBaseUrl;
    }
  });

  it('should build a canonical HTTPS view link', () => {
    const state = createState();
    const url = new URL(buildShareUrl(state));

    assert.equal(url.origin, 'https://japanex.expo.app');
    assert.equal(url.pathname, '/view');
    assert.equal(url.searchParams.get('v'), '1');
    assert.equal(url.searchParams.get('s'), encodeLevels(state));
    assert.equal(url.searchParams.get('l'), 'zh-Hant');
    assert.equal(url.searchParams.get('n'), '工藤 太郎');
  });

  it('should use an explicit development share origin when configured', () => {
    process.env.EXPO_PUBLIC_SHARE_BASE_URL = 'https://preview.example.com/';

    assert.equal(new URL(buildShareUrl(createState())).origin, 'https://preview.example.com');
  });

  it('should restore a valid snapshot without mutating its payload', () => {
    const state = createState();
    const digits = encodeLevels(state);
    const result = parseSharedStateParams({ v: '1', s: digits, l: state.locale, n: state.displayName });

    assert.equal(result.ok, true);
    if (!result.ok) return;

    assert.deepEqual(result.state, state);
    assert.equal(result.score, PREFECTURE_CODES.reduce((total, _, index) => total + (index % 6), 0));
    assert.equal(digits, encodeLevels(state));
  });

  it('should use the first value when a router parameter is repeated', () => {
    const state = createState();
    const result = parseSharedStateParams({
      v: ['1', '2'],
      s: [encodeLevels(state), 'invalid'],
      l: ['zh-Hant', 'invalid'],
      n: ['First', 'Second'],
    });

    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.state.displayName, 'First');
  });

  it('should reject unsupported or malformed snapshots', () => {
    const state = createState();
    const validLevels = encodeLevels(state);
    const invalidParams = [
      { v: '2', s: validLevels, l: 'en' },
      { v: '1', s: '0'.repeat(46), l: 'en' },
      { v: '1', s: `${'0'.repeat(46)}6`, l: 'en' },
      { v: '1', s: validLevels, l: 'fr' },
      { v: '1', s: validLevels, l: 'en', n: 'x'.repeat(41) },
    ];

    for (const params of invalidParams) {
      assert.equal(parseSharedStateParams(params).ok, false);
    }
  });
});
