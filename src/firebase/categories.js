// src/firebase/categories.js
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./config";

const categoriesRef = collection(db, "categories");

export async function fetchCategories() {
  const q = query(categoriesRef, orderBy("name", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export function subscribeToCategories(callback, onError) {
  const q = query(categoriesRef, orderBy("name", "asc"));
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
}

export async function createCategory(name) {
  const docRef = await addDoc(categoriesRef, { name: name.trim() });
  return docRef.id;
}

export async function updateCategory(id, name) {
  await updateDoc(doc(db, "categories", id), { name: name.trim() });
}

export async function deleteCategory(id) {
  await deleteDoc(doc(db, "categories", id));
}