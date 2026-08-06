import Storage from 'expo-sqlite/kv-store';

import type { TrackerStateV1 } from '@/data/types';
import { validateTrackerState } from '@/state/tracker-state';

const STORAGE_KEY = 'japanex.tracker-state.v1';

export interface TrackerStorage {
  load(): Promise<TrackerStateV1 | null>;
  save(state: TrackerStateV1): Promise<void>;
  reset(): Promise<void>;
}

export const trackerStorage: TrackerStorage = {
  async load() {
    const stored = await Storage.getItem(STORAGE_KEY);
    if (!stored) return null;

    try {
      return validateTrackerState(JSON.parse(stored));
    } catch {
      return null;
    }
  },
  async save(state) {
    await Storage.setItem(STORAGE_KEY, JSON.stringify(state));
  },
  async reset() {
    await Storage.removeItem(STORAGE_KEY);
  },
};
