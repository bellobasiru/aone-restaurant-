// src/firebase/products.js
// All reads/writes for the "products" collection live here so the rest of
// the app never talks to Firestore directly. Every function below performs
// a real network call to Cloud Firestore — nothing here is mocked.

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

const productsRef = collection(db, "products");

/** One-time fetch of every product, newest first. */
export async function fetchProducts() {
  const q = query(productsRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Live subscription to the products collection. Call the returned function
 * to unsubscribe (e.g. in a useEffect cleanup). This is what powers the
 * "price changes show up on the site immediately" requirement — the admin
 * dashboard writes to Firestore, and every open customer tab receives the
 * update automatically without a page refresh.
 */
export function subscribeToProducts(callback, onError) {
  const q = query(productsRef, orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
}

export async function fetchProduct(id) {
  const snap = await getDoc(doc(db, "products", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * @param {object} product - name, description, price, category, imageUrl,
 *   available, featured
 */
export async function createProduct(product) {
  const docRef = await addDoc(productsRef, {
    name: product.name?.trim() || "",
    description: product.description?.trim() || "",
    price: Number(product.price) || 0,
    category: product.category || "Other Foods",
    imageUrl: product.imageUrl || "",
    available: product.available ?? true,
    featured: product.featured ?? false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProduct(id, updates) {
  const clean = { ...updates, updatedAt: serverTimestamp() };
  if ("price" in clean) clean.price = Number(clean.price) || 0;
  await updateDoc(doc(db, "products", id), clean);
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, "products", id));
}

/** Convenience helper used by the Admin "Quick Price Editing" table. */
export async function updateProductPrice(id, newPrice) {
  await updateDoc(doc(db, "products", id), {
    price: Number(newPrice) || 0,
    updatedAt: serverTimestamp(),
  });
}