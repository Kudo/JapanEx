import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import type {
  AppLocale,
  ExperienceLevel,
  PrefectureCode,
  TrackerStateV1,
} from '@/data/types';
import { createEmptyLevels, createInitialState, calculateScore } from '@/state/tracker-state';
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

  useEffect(() => {
    let isActive = true;

    trackerStorage
      .load()
      .then((storedState) => {
        if (!isActive) return;
        if (storedState) setState(storedState);
      })
      .catch(() => {
        if (isActive) setHasStorageError(true);
      })
      .finally(() => {
        if (isActive) setIsReady(true);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    trackerStorage.save(state).then(
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
        setState((current) => ({
          ...current,
          levels: { ...current.levels, [code]: level },
        })),
      setLocale: (locale) => setState((current) => ({ ...current, locale })),
      setDisplayName: (displayName) =>
        setState((current) => ({ ...current, displayName: displayName.slice(0, 40) })),
      resetLevels: () =>
        setState((current) => ({ ...current, levels: createEmptyLevels() })),
      replaceState: setState,
    }),
    [hasStorageError, isReady, state],
  );

  return <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>;
}

export function useTracker(): TrackerContextValue {
  const context = useContext(TrackerContext);
  if (!context) throw new Error('useTracker must be used inside TrackerProvider');
  return context;
}
