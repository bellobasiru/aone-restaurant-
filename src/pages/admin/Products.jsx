import React, { useEffect, useState } from "react";
import {
  subscribeToProducts,
  createProduct,
  updateProduct,
  updateProductPrice,
  deleteProduct,
} from "../../firebase/products";
import { subscribeToCategories } from "../../firebase/categories";
import { uploadImage, deleteImageByUrl } from "../../firebase/storage";
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
        imageUrl = await uploadImage(imageFile, "products");
        if (editingId && form.imageUrl) {
          await deleteImageByUrl(form.imageUrl);
        }
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
      if (product.imageUrl) await deleteImageByUrl(product.imageUrl);
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

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Products</h1>

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