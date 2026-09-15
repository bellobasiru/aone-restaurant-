// scripts/seedFirestore.mjs
//
// One-time helper that writes the 19 starter products, category list, and
// default settings into your Firestore database. Run this ONCE after you've
// set up Firebase (see README "Firebase setup"), then manage everything
// from the Admin Dashboard from then on.
//
// Usage:
//   1. In the Firebase console: Project Settings > Service accounts >
//      "Generate new private key". Save the downloaded file as
//      serviceAccountKey.json in this project's root folder.
//   2. npm install firebase-admin --save-dev
//   3. npm run seed
//
// serviceAccountKey.json is listed in .gitignore — never commit it or
// share it, it grants full admin access to your Firebase project.

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import admin from "firebase-admin";

const __dirname = dirname(fileURLToPath(import.meta.url));

let serviceAccount;
try {
  serviceAccount = JSON.parse(
    readFileSync(join(__dirname, "..", "serviceAccountKey.json"), "utf-8")
  );
} catch {
  console.error(
    "\nCouldn't find serviceAccountKey.json in the project root.\n" +
      "Download it from Firebase Console > Project Settings > Service accounts,\n" +
      "save it as 'serviceAccountKey.json' next to package.json, then run this again.\n"
  );
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const seedCategories = [
  "Rice", "Spaghetti", "Traditional Meals", "Chicken and Meat",
  "Snacks", "Drinks", "Special Tea", "Combos", "Other Foods",
];

const seedProducts = [
  { name: "Fried Rice", price: 1500, category: "Rice" },
  { name: "Jollof Rice", price: 1500, category: "Rice" },
  { name: "Spaghetti", price: 1500, category: "Spaghetti" },
  { name: "Couscous", price: 1500, category: "Traditional Meals" },
  { name: "Rice and Beans", price: 1500, category: "Rice" },
  { name: "Basmati Rice", price: 1500, category: "Rice" },
  { name: "Tuwon Shinkafa", price: 1500, category: "Traditional Meals" },
  { name: "Semovita", price: 1500, category: "Traditional Meals" },
  { name: "Wheat", price: 2000, category: "Traditional Meals" },
  { name: "Pounded Yam", price: 2000, category: "Traditional Meals" },
  { name: "Moimoi", price: 750, category: "Snacks" },
  { name: "Danwake", price: 3000, category: "Traditional Meals" },
  { name: "Chicken Sauce", price: 2000, category: "Chicken and Meat" },
  { name: "Goat Meat", price: 1500, category: "Chicken and Meat" },
  { name: "Ram Pepper Soup", price: 2500, category: "Chicken and Meat" },
  { name: "Takeaway", price: 200, category: "Other Foods" },
  { name: "Combo Meal", price: 2000, category: "Combos" },
  { name: "Special Combo", price: 2500, category: "Combos" },
  { name: "AONE Special", price: 7000, category: "Combos" },
];

const defaultSettings = {
  businessName: "A ONE RESTAURANT AND FAST FOOD LTD.",
  brandName: "AONE RESTAURANT",
  slogan: "Delicious Food. Quality Service. Happy Customers.",
  address: "No. 82/8 Daffo House, Bauchi Road, Jos, Plateau State, Nigeria.",
  phone1: "07066590000",
  phone2: "07064845846",
  whatsappNumber: "07066590000",
  email: "",
  openingHours: "8:00 AM – 12:00 AM",
  currencySymbol: "\u20A6",
  takeawayFee: 200,
  deliveryFee: 500,
  deliveryEnabled: true,
  takeawayEnabled: true,
  minimumOrderAmount: 0,
  logoUrl: "",
  socialLinks: { facebook: "", instagram: "", twitter: "" },
};

async function seed() {
  console.log("Seeding categories…");
  for (const name of seedCategories) {
    await db.collection("categories").add({ name });
  }

  console.log("Seeding products…");
  for (const p of seedProducts) {
    await db.collection("products").add({
      ...p,
      description: "",
      imageUrl: "",
      available: true,
      featured: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  console.log("Writing default settings…");
  await db.collection("settings").doc("general").set(defaultSettings, { merge: true });

  console.log("\nDone! Your menu and settings are now in Firestore.");
  console.log("Next: create your admin login (see README 'Admin Users').");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});