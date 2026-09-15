import React, { useEffect, useMemo, useState } from "react";
import { subscribeToOrders } from "../../firebase/orders";
import { useSettings } from "../../context/SettingsContext";
import { formatNaira } from "../../utils/format";

/**
 * Since checkout works for guests (no forced account creation, per the
 * brief), "customers" here are derived from order history rather than a
 * separate signup flow. Anyone who registers an optional account (see
 * customers/{uid} in firestore.rules) would appear here too once that
 * feature is enabled.
 */
export default function Customers() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const { settings } = useSettings();

  useEffect(() => subscribeToOrders(setOrders, () => setOrders([])), []);

  const customers = useMemo(() => {
    const map = new Map();
    for (const order of orders) {
      const key = order.phone || order.customerName;
      if (!key) continue;
      if (!map.has(key)) {
        map.set(key, {
          name: order.customerName,
          phone: order.phone,
          orderCount: 0,
          totalSpent: 0,
        });
      }
      const c = map.get(key);
      c.orderCount += 1;
      if (order.status !== "Cancelled") c.totalSpent += order.total || 0;
    }
    return Array.from(map.values()).sort((a, b) => b.orderCount - a.orderCount);
  }, [orders]);

  const filtered = customers.filter(
    (c) =>
      !search.trim() ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Customers</h1>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or phone…"
        className="w-full sm:max-w-sm border border-ink/15 rounded-full px-5 py-2.5 mb-6 focus:border-jollof outline-none"
      />

      <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink/5 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Total spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {filtered.map((c) => (
              <tr key={c.phone}>
                <td className="px-4 py-3">{c.name}</td>
                <td className="px-4 py-3 text-ink/60">{c.phone}</td>
                <td className="px-4 py-3">{c.orderCount}</td>
                <td className="px-4 py-3">{formatNaira(c.totalSpent, settings.currencySymbol)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-ink/40">
                  No customers yet — this list fills in automatically as orders come in.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}