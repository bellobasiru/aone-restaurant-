// src/firebase/settings.js
//
// Restaurant-wide settings live in a single document: settings/general.
// This is what lets the admin change the phone number, delivery fee,
// opening hours, etc. from the dashboard instead of editing code.

import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "./config";

const settingsDocRef = doc(db, "settings", "general");

// These defaults match the AONE Restaurant brief exactly. They are only
// used the very first time the app runs, before an admin has saved
// anything to Firestore, and as a fallback if Firestore is unreachable.
export const DEFAULT_SETTINGS = {
  businessName: "A ONE RESTAURANT AND FAST FOOD LTD.",
  brandName: "AONE RESTAURANT",
  slogan: "Delicious Food. Quality Service. Happy Customers.",
  address: "No. 82/8 Daffo House, Bauchi Road, Jos, Plateau State, Nigeria.",
  city: "Jos, Plateau State, Nigeria",
  phone1: "07066590000",
  phone2: "07064845846",
  whatsappNumber: "07066590000",
  email: "", // editable placeholder until the official email is provided
  openingHours: "8:00 AM – 12:00 AM",
  currencySymbol: "\u20A6",
  takeawayFee: 200,
  deliveryFee: 500,
  deliveryEnabled: true,
  takeawayEnabled: true,
  minimumOrderAmount: 0,
  logoUrl: "",
  socialLinks: {
    facebook: "",
    instagram: "",
    twitter: "",
  },
};

export async function fetchSettings() {
  const snap = await getDoc(settingsDocRef);
  if (!snap.exists()) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...snap.data() };
}

export function subscribeToSettings(callback, onError) {
  return onSnapshot(
    settingsDocRef,
    (snap) => {
      callback(snap.exists() ? { ...DEFAULT_SETTINGS, ...snap.data() } : DEFAULT_SETTINGS);
    },
    onError
  );
}

export async function updateSettings(updates) {
  await setDoc(settingsDocRef, updates, { merge: true });
}

/** Run once from the Admin "first time setup" screen to seed defaults. */
export async function initializeSettingsIfMissing() {
  const snap = await getDoc(settingsDocRef);
  if (!snap.exists()) {
    await setDoc(settingsDocRef, DEFAULT_SETTINGS);
  }
}