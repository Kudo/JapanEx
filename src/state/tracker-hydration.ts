import type { TrackerStateV1 } from '@/data/types';

export type TrackerMutation = (state: TrackerStateV1) => TrackerStateV1;

export function replayPendingMutations(
  storedState: TrackerStateV1,
  pendingMutations: TrackerMutation[],
): TrackerStateV1 {
  return pendingMutations.reduce((state, mutate) => mutate(state), storedState);
}
