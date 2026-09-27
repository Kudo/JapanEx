import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { replayPendingMutations } from '../state/tracker-hydration.ts';

const storedState = {
  version: 1,
  levels: { '01': 2, '02': 3 },
  locale: 'ja',
  displayName: 'Saved',
};

describe('replayPendingMutations()', () => {
  it('should keep stored progress when no edits occurred during loading', () => {
    assert.equal(replayPendingMutations(storedState, []), storedState);
  });

  it('should apply early edits over the loaded progress', () => {
    const result = replayPendingMutations(storedState, [
      (state) => ({ ...state, levels: { ...state.levels, '01': 4 } }),
      (state) => ({ ...state, locale: 'en' }),
    ]);

    assert.deepEqual(result, {
      ...storedState,
      levels: { '01': 4, '02': 3 },
      locale: 'en',
    });
    assert.equal(storedState.levels['01'], 2);
  });

  it('should let an early confirmed import replace loaded progress', () => {
    const importedState = {
      version: 1,
      levels: { '01': 5, '02': 0 },
      locale: 'zh-Hant',
      displayName: 'Imported',
    };

    const result = replayPendingMutations(storedState, [
      () => importedState,
      (state) => ({ ...state, levels: { ...state.levels, '02': 1 } }),
    ]);

    assert.deepEqual(result, {
      ...importedState,
      levels: { '01': 5, '02': 1 },
    });
  });
});
