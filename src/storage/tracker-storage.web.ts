import type { TrackerStorage } from '@/storage/tracker-storage';
import { validateTrackerState } from '@/state/tracker-state';

const STORAGE_KEY = 'japanex.tracker-state.v1';

export const trackerStorage: TrackerStorage = {
  async load() {
    const stored = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (!stored) return null;

    try {
      return validateTrackerState(JSON.parse(stored));
    } catch {
      return null;
    }
  },
  async save(state) {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(state));
  },
  async reset() {
    globalThis.localStorage?.removeItem(STORAGE_KEY);
  },
};
