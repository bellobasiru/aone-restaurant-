import React from "react";
import { useSettings } from "../context/SettingsContext";

/**
 * Shown across the site until real Firebase credentials are added to
 * .env. This stops the app from silently looking "broken" with an empty
 * menu when someone opens the code for the first time.
 */
export default function FirebaseSetupNotice() {
  const { firebaseConfigured } = useSettings();
  if (firebaseConfigured) return null;

  return (
    <div className="bg-gold/15 border-b border-gold/40 text-ink text-sm px-4 py-2 text-center">
      Firebase isn't connected yet — the menu and orders won't load until you
      add your Firebase project keys to <code className="font-mono">.env</code>.
      See <code className="font-mono">README.md</code>.
    </div>
  );
}