'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const ConsentContext = createContext(null);

const STORAGE_KEY = 'studiokova_consent';

export function ConsentProvider({ children }) {
  const [consent, setConsent] = useState(null);
  // Distinguishes "not yet read" from "no stored choice" - both are null for consent
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'accepted' || stored === 'rejected') {
      setConsent(stored);
    }
    setIsLoaded(true);
  }, []);

  function acceptAll() {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setConsent('accepted');
  }

  function rejectAll() {
    localStorage.setItem(STORAGE_KEY, 'rejected');
    setConsent('rejected');
  }

  function resetConsent() {
    localStorage.removeItem(STORAGE_KEY);
    setConsent(null);
  }

  function openPreferences() { setIsPreferencesOpen(true); }
  function closePreferences() { setIsPreferencesOpen(false); }

  return (
    <ConsentContext.Provider value={{
      consent,
      isLoaded,
      isPreferencesOpen,
      acceptAll,
      rejectAll,
      resetConsent,
      openPreferences,
      closePreferences,
    }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  // Null-safe fallback so components render in tests without a provider
  return ctx ?? {
    consent: null,
    isLoaded: false,
    isPreferencesOpen: false,
    acceptAll: () => {},
    rejectAll: () => {},
    resetConsent: () => {},
    openPreferences: () => {},
    closePreferences: () => {},
  };
}
