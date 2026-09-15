// src/firebase/auth.js
//
// Admin authentication using Firebase Authentication (email/password).
// This is real auth — not a localStorage flag. A user is only "admin" if
// their Firebase Auth UID has a matching document in the `admins`
// collection (checked by adminRoles.js) AND Firestore security rules
// enforce that server-side. See firestore.rules.

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./config";

export function loginAdmin(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logoutAdmin() {
  return signOut(auth);
}

export function resetAdminPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

/** Subscribes to Firebase's own auth state (fires on login/logout/reload). */
export function subscribeToAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}