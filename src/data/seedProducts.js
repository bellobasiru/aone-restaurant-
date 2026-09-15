// src/data/seedProducts.js
// The 19 starter products and category list from the AONE Restaurant brief.
// These are sample prices/products only — every one of them can be edited
// or deleted from the Admin Dashboard after launch.

export const seedCategories = [
  "Rice",
  "Spaghetti",
  "Traditional Meals",
  "Chicken and Meat",
  "Snacks",
  "Drinks",
  "Special Tea",
  "Combos",
  "Other Foods",
];

export const seedProducts = [
  { name: "Fried Rice", price: 1500, category: "Rice", description: "" },
  { name: "Jollof Rice", price: 1500, category: "Rice", description: "" },
  { name: "Spaghetti", price: 1500, category: "Spaghetti", description: "" },
  { name: "Couscous", price: 1500, category: "Traditional Meals", description: "" },
  { name: "Rice and Beans", price: 1500, category: "Rice", description: "" },
  { name: "Basmati Rice", price: 1500, category: "Rice", description: "" },
  { name: "Tuwon Shinkafa", price: 1500, category: "Traditional Meals", description: "" },
  { name: "Semovita", price: 1500, category: "Traditional Meals", description: "" },
  { name: "Wheat", price: 2000, category: "Traditional Meals", description: "" },
  { name: "Pounded Yam", price: 2000, category: "Traditional Meals", description: "" },
  { name: "Moimoi", price: 750, category: "Snacks", description: "" },
  { name: "Danwake", price: 3000, category: "Traditional Meals", description: "" },
  { name: "Chicken Sauce", price: 2000, category: "Chicken and Meat", description: "" },
  { name: "Goat Meat", price: 1500, category: "Chicken and Meat", description: "" },
  { name: "Ram Pepper Soup", price: 2500, category: "Chicken and Meat", description: "" },
  { name: "Takeaway", price: 200, category: "Other Foods", description: "" },
  { name: "Combo Meal", price: 2000, category: "Combos", description: "" },
  { name: "Special Combo", price: 2500, category: "Combos", description: "" },
  { name: "AONE Special", price: 7000, category: "Combos", description: "" },
].map((p) => ({
  ...p,
  imageUrl: "",
  available: true,
  featured: false,
}));