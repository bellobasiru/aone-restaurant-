import React, { useEffect, useMemo, useState } from "react";
import { subscribeToOrders } from "../../firebase/orders";
import { useSettings } from "../../context/SettingsContext";
import { formatNaira } from "../../utils/format";

function toDate(timestamp) {
  if (!timestamp) return null;
  if (timestamp.toDate) return timestamp.toDate();
  return new Date(timestamp);
}

export default function Reports() {
  const [orders, setOrders] = useState([]);
  const { settings } = useSettings();

  useEffect(() => subscribeToOrders(setOrders, () => setOrders([])), []);

  const validOrders = orders.filter((o) => o.status !== "Cancelled");

  const byDay = useMemo(() => {
    const map = new Map();
    for (const o of validOrders) {
      const d = toDate(o.createdAt);
      if (!d) continue;
      const key = d.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
      map.set(key, (map.get(key) || 0) + (o.total || 0));
    }
    return Array.from(map.entries()).slice(-14);
  }, [validOrders]);

  const topProducts = useMemo(() => {
    const map = new Map();
    for (const o of validOrders) {
      for (const item of o.items || []) {
        const entry = map.get(item.name) || { quantity: 0, revenue: 0 };
        entry.quantity += item.quantity;
        entry.revenue += item.price * item.quantity;
        map.set(item.name, entry);
      }
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1].quantity - a[1].quantity)
      .slice(0, 8);
  }, [validOrders]);

  const maxDay = Math.max(1, ...byDay.map(([, v]) => v));

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Sales Reports</h1>

      {validOrders.length === 0 ? (
        <p className="text-ink/40 text-sm py-12 text-center">
          No completed orders yet — reports will populate as real sales come in.
        </p>
      ) : (
        <>
          <div className="bg-white border border-ink/10 rounded-2xl p-6 mb-8">
            <h2 className="font-display text-lg mb-4">Sales by day</h2>
            <div className="flex items-end gap-2 h-40">
              {byDay.map(([label, value]) => (
                <div key={label} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-jollof/70 rounded-t-md"
                    style={{ height: `${(value / maxDay) * 100}%`, minHeight: 2 }}
                    title={formatNaira(value, settings.currencySymbol)}
                  />
                  <span className="text-[10px] text-ink/40 rotate-0">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden">
            <h2 className="font-display text-lg p-6 pb-0">Top selling items</h2>
            <table className="w-full text-sm mt-4">
              <thead className="bg-ink/5 text-left">
                <tr>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Quantity sold</th>
                  <th className="px-4 py-3">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {topProducts.map(([name, data]) => (
                  <tr key={name}>
                    <td className="px-4 py-3">{name}</td>
                    <td className="px-4 py-3">{data.quantity}</td>
                    <td className="px-4 py-3">{formatNaira(data.revenue, settings.currencySymbol)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}