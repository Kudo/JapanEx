import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createSaveQueue } from '../state/tracker-persistence.ts';

describe('createSaveQueue()', () => {
  it('should finish an earlier write before starting the next', async () => {
    const writes = [];
    let finishFirst;
    let signalFirstStarted;
    const firstStarted = new Promise((resolve) => { signalFirstStarted = resolve; });
    const save = createSaveQueue(async (value) => {
      writes.push(value);
      if (value === 'first') {
        signalFirstStarted();
        await new Promise((resolve) => { finishFirst = resolve; });
      }
    });

    const first = save('first');
    const second = save('second');
    await firstStarted;
    assert.deepEqual(writes, ['first']);

    finishFirst();
    await Promise.all([first, second]);
    assert.deepEqual(writes, ['first', 'second']);
  });

  it('should continue with a newer write after an earlier write fails', async () => {
    const writes = [];
    const save = createSaveQueue(async (value) => {
      writes.push(value);
      if (value === 'first') throw new Error('storage unavailable');
    });

    const first = save('first');
    const second = save('second');
    await assert.rejects(first, /storage unavailable/);
    await second;
    assert.deepEqual(writes, ['first', 'second']);
  });
});
