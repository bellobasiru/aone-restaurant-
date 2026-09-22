import React, { useEffect, useState } from "react";
import {
  subscribeToProducts,
  createProduct,
  updateProduct,
  updateProductPrice,
  deleteProduct,
} from "../../firebase/products";
import { subscribeToCategories, createCategory } from "../../firebase/categories";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { useSettings } from "../../context/SettingsContext";
import { formatNaira } from "../../utils/format";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  imageUrl: "",
  available: true,
  featured: false,
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [priceEdits, setPriceEdits] = useState({});
  const [savedPriceId, setSavedPriceId] = useState(null);
  const [bulkText, setBulkText] = useState("");
  const [bulkSaving, setBulkSaving] = useState(false);
  const [bulkResult, setBulkResult] = useState("");
  const [showBulk, setShowBulk] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    const unsubProducts = subscribeToProducts(setProducts, () => setProducts([]));
    const unsubCategories = subscribeToCategories(setCategories, () => setCategories([]));
    return () => {
      unsubProducts();
      unsubCategories();
    };
  }, []);

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl || "",
      available: product.available,
      featured: product.featured,
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.category || form.price === "") {
      setError("Name, category, and price are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      let imageUrl = form.imageUrl;
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const payload = { ...form, imageUrl };

      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }
      resetForm();
    } catch (err) {
      console.error(err);
      setError("Couldn't save the product. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(product.id);
    } catch (err) {
      alert("Couldn't delete the product. Please try again.");
    }
  }

  async function handleQuickPriceSave(product) {
    const newPrice = priceEdits[product.id];
    if (newPrice === undefined || newPrice === "") return;
    try {
      await updateProductPrice(product.id, newPrice);
      setSavedPriceId(product.id);
      setTimeout(() => setSavedPriceId(null), 1500);
    } catch {
      alert("Couldn't update the price. Please try again.");
    }
  }

  async function handleBulkAdd() {
    const lines = bulkText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      setBulkResult("Paste at least one line first.");
      return;
    }

    setBulkSaving(true);
    setBulkResult("");

    // Track categories we already know about (existing + newly created this run)
    const knownCategoryNames = new Set(categories.map((c) => c.name.toLowerCase()));

    let created = 0;
    let failed = 0;
    const failedLines = [];

    for (const line of lines) {
      const parts = line.split(",").map((p) => p.trim());
      const [name, priceRaw, category, ...descParts] = parts;
      const description = descParts.join(",").trim();
      const price = Number(priceRaw);

      if (!name || !priceRaw || Number.isNaN(price) || !category) {
        failed++;
        failedLines.push(line);
        continue;
      }

      try {
        // Auto-create the category if it doesn't exist yet
        if (!knownCategoryNames.has(category.toLowerCase())) {
          await createCategory(category);
          knownCategoryNames.add(category.toLowerCase());
        }

        await createProduct({
          name,
          price,
          category,
          description: description || "",
          imageUrl: "",
          available: true,
          featured: false,
        });
        created++;
      } catch (err) {
        console.error(err);
        failed++;
        failedLines.push(line);
      }
    }

    setBulkSaving(false);
    setBulkResult(
      failed === 0
        ? `Added ${created} item${created === 1 ? "" : "s"} successfully!`
        : `Added ${created} item${created === 1 ? "" : "s"}. ${failed} line(s) had a problem:\n${failedLines.join("\n")}`
    );
    if (failed === 0) setBulkText("");
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Products</h1>

      {/* Bulk add */}
      <div className="bg-white border border-ink/10 rounded-2xl p-6 mb-10">
        <button
          type="button"
          onClick={() => setShowBulk((s) => !s)}
          className="font-display text-lg flex items-center gap-2"
        >
          {showBulk ? "▾" : "▸"} Bulk add menu items
        </button>
        {showBulk && (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-ink/60">
              Paste one item per line, in this format:
              <br />
              <code className="text-xs bg-ink/5 px-1.5 py-0.5 rounded">
                Food name, Price, Category, Description
              </code>
              <br />
              Categories that don't exist yet will be created automatically. You can add images
              later by editing each item.
            </p>
            <textarea
              rows={8}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={"Fried Rice, 1500, Rice Dishes, Freshly cooked fried rice\nJollof Rice, 1500, Jollof Dishes, Smoky jollof rice served hot"}
              className="w-full border border-ink/15 rounded-xl px-4 py-2.5 text-sm font-mono focus:border-jollof outline-none"
            />
            {bulkResult && (
              <p className="text-sm whitespace-pre-line text-ink/70">{bulkResult}</p>
            )}
            <button
              type="button"
              onClick={handleBulkAdd}
              disabled={bulkSaving}
              className="bg-jollof text-cream px-6 py-2.5 rounded-full text-sm hover:bg-jollof-dark disabled:opacity-60"
            >
              {bulkSaving ? "Adding items…" : "Add all items"}
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit form */}
      <form onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-2xl p-6 mb-10 space-y-4">
        <h2 className="font-display text-lg mb-2">{editingId ? "Edit product" : "Add new product"}</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Food name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border border-ink/15 rounded-xl px-4 py-2.5 focus:border-jollof outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Price ({settings.currencySymbol})
            </label>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="w-full border border-ink/15 rounded-xl px-4 py-2.5 focus:border-jollof outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Description</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full border border-ink/15 rounded-xl px-4 py-2.5 focus:border-jollof outline-none"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full border border-ink/15 rounded-xl px-4 py-2.5 bg-white focus:border-jollof outline-none"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Food image</label>
            <input
              type="url"
              placeholder="Paste an image URL (e.g. from Imgur, Google Images)"
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              className="w-full border border-ink/15 rounded-xl px-4 py-2.5 mb-2 text-sm focus:border-jollof outline-none"
            />
            <p className="text-xs text-ink/40 mb-2">
              Or pick a photo from your phone to upload directly:
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-sm"
            />
            {(imageFile || form.imageUrl) && (
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : form.imageUrl}
                alt="Preview"
                className="mt-2 w-20 h-20 object-cover rounded-lg"
              />
            )}
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
            />
            Available
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
            />
            Featured
          </label>
        </div>

        {error && <p className="text-jollof text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-jollof text-cream px-6 py-2.5 rounded-full text-sm hover:bg-jollof-dark disabled:opacity-60"
          >
            {saving ? "Saving…" : editingId ? "Save changes" : "Add product"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="text-sm text-ink/50 hover:text-jollof">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Quick price editing table */}
      <h2 className="font-display text-lg mb-3">Quick price editing</h2>
      <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden mb-10">
        <table className="w-full text-sm">
          <thead className="bg-ink/5 text-left">
            <tr>
              <th className="px-4 py-3">Product name</th>
              <th className="px-4 py-3">Current price</th>
              <th className="px-4 py-3">Edit price</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3 text-ink/60">{formatNaira(p.price, settings.currencySymbol)}</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min="0"
                    placeholder={p.price}
                    value={priceEdits[p.id] ?? ""}
                    onChange={(e) => setPriceEdits((s) => ({ ...s, [p.id]: e.target.value }))}
                    className="w-28 border border-ink/15 rounded-lg px-3 py-1.5"
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleQuickPriceSave(p)}
                    className="text-palm hover:text-palm-dark text-sm font-medium"
                  >
                    {savedPriceId === p.id ? "Saved ✓" : "Save"}
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-ink/40">
                  No products yet. Add your first one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Full product list */}
      <h2 className="font-display text-lg mb-3">All products</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white border border-ink/10 rounded-2xl overflow-hidden">
            <div className="aspect-video bg-ink/5">
              {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />}
            </div>
            <div className="p-4">
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-ink/40 mb-1">{p.category}</p>
              <p className="text-jollof font-display mb-3">{formatNaira(p.price, settings.currencySymbol)}</p>
              <div className="flex gap-2 text-xs mb-3">
                <span className={`px-2 py-1 rounded-full ${p.available ? "bg-palm/10 text-palm-dark" : "bg-ink/10 text-ink/50"}`}>
                  {p.available ? "Available" : "Unavailable"}
                </span>
                {p.featured && <span className="px-2 py-1 rounded-full bg-gold/15 text-gold">Featured</span>}
              </div>
              <div className="flex gap-3 text-sm">
                <button onClick={() => startEdit(p)} className="text-palm hover:text-palm-dark">
                  Edit
                </button>
                <button onClick={() => handleDelete(p)} className="text-jollof hover:text-jollof-dark">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}