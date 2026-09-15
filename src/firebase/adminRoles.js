// src/firebase/adminRoles.js
//
// Being logged in to Firebase Auth is not the same as being an admin.
// We only treat a signed-in user as an admin if a document exists at
// admins/{uid}. This document can ONLY be created by you directly in the
// Firebase console (see README "Admin Users" section) — nothing in this
// app writes to the `admins` collection, which is intentional: it stops a
// compromised frontend from ever granting itself admin rights.

import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./config";

export async function isAdminUser(uid) {
  if (!uid) return false;
  const snap = await getDoc(doc(db, "admins", uid));
  return snap.exists();
}

export async function fetchAdminProfile(uid) {
  const snap = await getDoc(doc(db, "admins", uid));
  return snap.exists() ? { uid, ...snap.data() } : null;
}

/** Lists admin user records (for the "Admin Users" management page). */
export async function fetchAllAdmins() {
  const snap = await getDocs(collection(db, "admins"));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}

/**
 * Adds metadata (name/role/email) for an admin whose Firebase Auth account
 * you already created in the Firebase console. This does NOT create the
 * login itself — see the README for the two-step process.
 */
export async function registerAdminProfile(uid, { name, email, role = "admin" }) {
  await setDoc(doc(db, "admins", uid), { name, email, role, createdAt: new Date().toISOString() });
}

export async function removeAdminProfile(uid) {
  await deleteDoc(doc(db, "admins", uid));
}