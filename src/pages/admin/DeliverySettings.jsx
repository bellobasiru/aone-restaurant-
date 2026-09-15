import React, { useState } from "react";
import { updateSettings } from "../../firebase/settings";
import { useSettings } from "../../context/SettingsContext";

export default function DeliverySettings() {
  const { settings } = useSettings();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  React.useEffect(() => setForm(settings), [settings]);

  async function handleSubmit(e) {
    e.preventDefault();
    await updateSettings({
      takeawayFee: Number(form.takeawayFee) || 0,
      deliveryFee: Number(form.deliveryFee) || 0,
      deliveryEnabled: form.deliveryEnabled,
      takeawayEnabled: form.takeawayEnabled,
      minimumOrderAmount: Number(form.minimumOrderAmount) || 0,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Delivery Settings</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-2xl p-6 space-y-6 max-w-lg">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Takeaway fee ({settings.currencySymbol})</label>
            <input
              type="number"
              min="0"
              value={form.takeawayFee}
              onChange={(e) => setForm((f) => ({ ...f, takeawayFee: e.target.value }))}
              className="w-full border border-ink/15 rounded-xl px-4 py-2.5 focus:border-jollof outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Delivery fee ({settings.currencySymbol})</label>
            <input
              type="number"
              min="0"
              value={form.deliveryFee}
              onChange={(e) => setForm((f) => ({ ...f, deliveryFee: e.target.value }))}
              className="w-full border border-ink/15 rounded-xl px-4 py-2.5 focus:border-jollof outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Minimum order amount ({settings.currencySymbol}, 0 = no minimum)
          </label>
          <input
            type="number"
            min="0"
            value={form.minimumOrderAmount}
            onChange={(e) => setForm((f) => ({ ...f, minimumOrderAmount: e.target.value }))}
            className="w-full border border-ink/15 rounded-xl px-4 py-2.5 focus:border-jollof outline-none"
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.deliveryEnabled}
              onChange={(e) => setForm((f) => ({ ...f, deliveryEnabled: e.target.checked }))}
            />
            Delivery enabled
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.takeawayEnabled}
              onChange={(e) => setForm((f) => ({ ...f, takeawayEnabled: e.target.checked }))}
            />
            Takeaway enabled
          </label>
        </div>

        <button className="bg-jollof text-cream px-6 py-2.5 rounded-full text-sm hover:bg-jollof-dark">
          {saved ? "Saved ✓" : "Save settings"}
        </button>
      </form>
    </div>
  );
}