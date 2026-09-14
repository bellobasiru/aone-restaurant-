// src/firebase/config.js
//
// Firebase initialization.
//
// These values come from YOUR Firebase project (Project Settings > General >
// "Your apps" > Web app). Firebase web config values are not secret the way
// an API key for a paid service is — they are public identifiers that tell
// the browser which Firebase project to talk to. What actually protects your
// data is the Firestore & Storage SECURITY RULES (see firestore.rules and
// storage.rules in the project root), not hiding these values.
//
// Even so, we load them from environment variables so you never have to
// edit this file by hand and never commit real values into shared code.
// See .env.example for what to fill in, and README.md for step-by-step
// Firebase setup instructions.

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Guard against re-initializing during hot reload.
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Lets the UI show a friendly banner instead of crashing if the site is
// opened before real Firebase credentials have been configured.
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

export default app;