import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { withTimeout } from './promise-timeout.ts';

describe('withTimeout()', () => {
  it('should return a completed operation', async () => {
    assert.equal(await withTimeout(Promise.resolve('ready'), 100, 'Timed out'), 'ready');
  });

  it('should preserve an operation failure', async () => {
    await assert.rejects(
      withTimeout(Promise.reject(new Error('Image failed')), 100, 'Timed out'),
      /Image failed/,
    );
  });

  it('should reject when an operation never completes', async () => {
    await assert.rejects(withTimeout(new Promise(() => {}), 1, 'Timed out'), /Timed out/);
  });
});
