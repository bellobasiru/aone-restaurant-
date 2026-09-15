import React, { createContext, useContext, useEffect, useState } from "react";
import { subscribeToSettings, DEFAULT_SETTINGS } from "../firebase/settings";
import { isFirebaseConfigured } from "../firebase/config";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsubscribe = subscribeToSettings(
      (data) => {
        setSettings(data);
        setConnected(true);
      },
      () => setConnected(false)
    );
    return unsubscribe;
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, connected, firebaseConfigured: isFirebaseConfigured }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}