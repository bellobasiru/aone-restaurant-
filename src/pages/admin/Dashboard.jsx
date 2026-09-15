import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { subscribeToProducts } from "../../firebase/products";
import { subscribeToOrders } from "../../firebase/orders";
import { useSettings } from "../../context/SettingsContext";
import { formatNaira } from "../../utils/format";

function startOf(period) {
  const now = new Date();
  if (period === "day") return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === "week") {
    const d = new Date(now);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (period === "month") return new Date(now.getFullYear(), now.getMonth(), 1);
  return new Date(0);
}

function toDate(timestamp) {
  if (!timestamp) return null;
  if (timestamp.toDate) return timestamp.toDate();
  return new Date(timestamp);
}

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const { settings } = useSettings();

  useEffect(() => {
    const unsubProducts = subscribeToProducts(setProducts, () => setProducts([]));
    const unsubOrders = subscribeToOrders(setOrders, () => setOrders([]));
    return () => {
      unsubProducts();
      unsubOrders();
    };
  }, []);

  const stats = useMemo(() => {
    const countByStatus = (status) => orders.filter((o) => o.status === status).length;
    const sumSince = (period) => {
      const from = startOf(period);
      return orders
        .filter((o) => o.status !== "Cancelled")
        .filter((o) => {
          const d = toDate(o.createdAt);
          return d && d >= from;
        })
        .reduce((sum, o) => sum + (o.total || 0), 0);
    };

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      pending: countByStatus("Pending"),
      confirmed: countByStatus("Confirmed"),
      completed: countByStatus("Completed"),
      cancelled: countByStatus("Cancelled"),
      totalSales: orders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + (o.total || 0), 0),
      today: sumSince("day"),
      week: sumSince("week"),
      month: sumSince("month"),
    };
  }, [products, orders]);

  const cards = [
    { label: "Total products", value: stats.totalProducts },
    { label: "Total orders", value: stats.totalOrders },
    { label: "Pending orders", value: stats.pending },
    { label: "Confirmed orders", value: stats.confirmed },
    { label: "Completed orders", value: stats.completed },
    { label: "Cancelled orders", value: stats.cancelled },
  ];

  const salesCards = [
    { label: "Today's sales", value: stats.today },
    { label: "This week's sales", value: stats.week },
    { label: "This month's sales", value: stats.month },
    { label: "Total sales", value: stats.totalSales },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl mb-1">Dashboard</h1>
      <p className="text-ink/50 mb-8">Overview of {settings.brandName}</p>

      {orders.length === 0 && (
        <div className="bg-gold/10 border border-gold/30 rounded-xl px-4 py-3 text-sm mb-8">
          No orders yet — figures below will update automatically as real orders come in.
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white border border-ink/10 rounded-2xl p-5">
            <p className="text-sm text-ink/50 mb-1">{c.label}</p>
            <p className="font-display text-3xl">{c.value}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-xl mb-4">Sales</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {salesCards.map((c) => (
          <div key={c.label} className="bg-palm/5 border border-palm/15 rounded-2xl p-5">
            <p className="text-sm text-ink/50 mb-1">{c.label}</p>
            <p className="font-display text-2xl text-palm-dark">{formatNaira(c.value, settings.currencySymbol)}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/admin/products" className="text-sm bg-jollof text-cream px-5 py-2.5 rounded-full hover:bg-jollof-dark">
          Manage products
        </Link>
        <Link to="/admin/orders" className="text-sm border border-ink/15 px-5 py-2.5 rounded-full hover:border-ink/40">
          View orders
        </Link>
      </div>
    </div>
  );
}