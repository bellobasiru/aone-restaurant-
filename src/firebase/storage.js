// src/firebase/storage.js
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./config";

/**
 * Uploads a food/logo image and returns its public download URL.
 * @param {File} file - the file from an <input type="file"> element
 * @param {string} folder - e.g. "products" or "logo"
 */
export async function uploadImage(file, folder = "products") {
  if (!file) throw new Error("No file provided");
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
  const storageRef = ref(storage, `${folder}/${safeName}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

/** Deletes an image given its full https download URL, if it lives in our bucket. */
export async function deleteImageByUrl(url) {
  if (!url) return;
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (err) {
    // Non-fatal: the product record should still update even if the old
    // image was already removed or the URL wasn't a Storage URL.
    console.warn("Could not delete previous image:", err.message);
  }
}