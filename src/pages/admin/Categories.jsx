import React, { useEffect, useState } from "react";
import {
  subscribeToCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../firebase/categories";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => subscribeToCategories(setCategories, () => setCategories([])), []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await createCategory(newName);
      setNewName("");
      setError("");
    } catch {
      setError("Couldn't add category. Try again.");
    }
  }

  async function handleSaveEdit(id) {
    if (!editingName.trim()) return;
    try {
      await updateCategory(id, editingName);
      setEditingId(null);
    } catch {
      setError("Couldn't rename category. Try again.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this category? Products already using it will keep the old name until edited.")) return;
    await deleteCategory(id);
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Categories</h1>

      <form onSubmit={handleAdd} className="flex gap-3 mb-8">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="e.g. Rice, Drinks, Combos"
          className="flex-1 border border-ink/15 rounded-full px-5 py-2.5 focus:border-jollof outline-none"
        />
        <button className="bg-jollof text-cream px-6 py-2.5 rounded-full text-sm hover:bg-jollof-dark">
          Add category
        </button>
      </form>

      {error && <p className="text-jollof text-sm mb-4">{error}</p>}

      <div className="bg-white border border-ink/10 rounded-2xl divide-y divide-ink/10">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center gap-4 px-5 py-3">
            {editingId === c.id ? (
              <input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="flex-1 border border-ink/15 rounded-lg px-3 py-1.5"
                autoFocus
              />
            ) : (
              <span className="flex-1">{c.name}</span>
            )}

            {editingId === c.id ? (
              <>
                <button onClick={() => handleSaveEdit(c.id)} className="text-palm text-sm hover:text-palm-dark">
                  Save
                </button>
                <button onClick={() => setEditingId(null)} className="text-ink/40 text-sm">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setEditingId(c.id);
                    setEditingName(c.name);
                  }}
                  className="text-palm text-sm hover:text-palm-dark"
                >
                  Rename
                </button>
                <button onClick={() => handleDelete(c.id)} className="text-jollof text-sm hover:text-jollof-dark">
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
        {categories.length === 0 && (
          <p className="px-5 py-6 text-center text-ink/40 text-sm">No categories yet. Add one above.</p>
        )}
      </div>
    </div>
  );
}