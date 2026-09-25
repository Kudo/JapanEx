import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import type {
  AppLocale,
  ExperienceLevel,
  PrefectureCode,
  TrackerStateV1,
} from '@/data/types';
import { createEmptyLevels, createInitialState, calculateScore } from '@/state/tracker-state';
import { replayPendingMutations, type TrackerMutation } from '@/state/tracker-hydration';
import { createSaveQueue } from '@/state/tracker-persistence';
import { trackerStorage } from '@/storage/tracker-storage';

type TrackerContextValue = {
  state: TrackerStateV1;
  score: number;
  isReady: boolean;
  hasStorageError: boolean;
  setLevel: (code: PrefectureCode, level: ExperienceLevel) => void;
  setLocale: (locale: AppLocale) => void;
  setDisplayName: (displayName: string) => void;
  resetLevels: () => void;
  replaceState: (state: TrackerStateV1) => void;
};

const TrackerContext = createContext<TrackerContextValue | null>(null);

export function TrackerProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<TrackerStateV1>(() => createInitialState());
  const [isReady, setIsReady] = useState(false);
  const [hasStorageError, setHasStorageError] = useState(false);
  // @ref LLP 0000#tracker-state-and-persistence — retain edits made before storage finishes loading.
  const hasLoadedRef = useRef(false);
  // @ref LLP 0000#tracker-state-and-persistence — a failed read must not be followed by an empty write.
  const loadFailedRef = useRef(false);
  const pendingMutationsRef = useRef<TrackerMutation[]>([]);
  // @ref LLP 0000#tracker-state-and-persistence — complete earlier writes before newer state is saved.
  const saveStateRef = useRef(createSaveQueue(trackerStorage.save));

  const mutateState = useCallback((mutation: TrackerMutation) => {
    if (!hasLoadedRef.current) pendingMutationsRef.current.push(mutation);
    setState(mutation);
  }, []);

  useEffect(() => {
    let isActive = true;

    trackerStorage
      .load()
      .then((storedState) => {
        if (!isActive) return;
        if (storedState) {
          setState(replayPendingMutations(storedState, pendingMutationsRef.current));
        }
        hasLoadedRef.current = true;
        pendingMutationsRef.current = [];
      })
      .catch(() => {
        if (isActive) {
          hasLoadedRef.current = true;
          loadFailedRef.current = true;
          pendingMutationsRef.current = [];
          setHasStorageError(true);
        }
      })
      .finally(() => {
        if (isActive) setIsReady(true);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady || loadFailedRef.current) return;
    saveStateRef.current(state).then(
      () => setHasStorageError(false),
      () => setHasStorageError(true),
    );
  }, [isReady, state]);

  const value = useMemo<TrackerContextValue>(
    () => ({
      state,
      score: calculateScore(state.levels),
      isReady,
      hasStorageError,
      setLevel: (code, level) =>
        mutateState((current) => ({
          ...current,
          levels: { ...current.levels, [code]: level },
        })),
      setLocale: (locale) => mutateState((current) => ({ ...current, locale })),
      setDisplayName: (displayName) =>
        mutateState((current) => ({ ...current, displayName: displayName.slice(0, 40) })),
      resetLevels: () =>
        mutateState((current) => ({ ...current, levels: createEmptyLevels() })),
      replaceState: (replacement) => mutateState(() => replacement),
    }),
    [hasStorageError, isReady, mutateState, state],
  );

  return <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>;
}

export function useTracker(): TrackerContextValue {
  const context = useContext(TrackerContext);
  if (!context) throw new Error('useTracker must be used inside TrackerProvider');
  return context;
}
