import * as Linking from 'expo-linking';
import { createContext, type PropsWithChildren, useContext, useEffect, useState } from 'react';

import { GOOGLE_PLAY_URL } from '@/constants/native-app-links';

type NativeInstallPromptEvent = Event & {
  platforms: string[];
  prompt: () => Promise<unknown>;
};

const NativeAppInstallContext = createContext({
  canInstall: false,
  install: async () => {},
});

// @ref LLP 0000#application-shell-and-navigation
export function NativeAppInstallProvider({ children }: PropsWithChildren) {
  const [pendingPrompt, setPendingPrompt] = useState<NativeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (process.env.EXPO_OS !== 'web' || !GOOGLE_PLAY_URL) {
      return;
    }

    const handlePrompt = (event: Event) => {
      const promptEvent = event as NativeInstallPromptEvent;
      if (!promptEvent.platforms?.includes('play')) {
        return;
      }

      promptEvent.preventDefault();
      setPendingPrompt(promptEvent);
    };
    const handleInstalled = () => setPendingPrompt(null);

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const install = async () => {
    if (!pendingPrompt) {
      return;
    }

    setPendingPrompt(null);
    try {
      await pendingPrompt.prompt();
    } catch {
      if (GOOGLE_PLAY_URL) {
        await Linking.openURL(GOOGLE_PLAY_URL);
      }
    }
  };

  return (
    <NativeAppInstallContext.Provider value={{ canInstall: pendingPrompt !== null, install }}>
      {children}
    </NativeAppInstallContext.Provider>
  );
}

export function useNativeAppInstall() {
  return useContext(NativeAppInstallContext);
}
