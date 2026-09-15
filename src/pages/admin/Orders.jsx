import React, { useEffect, useMemo, useState } from "react";
import { subscribeToOrders, updateOrderStatus, deleteOrder, ORDER_STATUSES } from "../../firebase/orders";
import { useSettings } from "../../context/SettingsContext";
import { formatNaira } from "../../utils/format";

function toDate(timestamp) {
  if (!timestamp) return null;
  if (timestamp.toDate) return timestamp.toDate();
  return new Date(timestamp);
}

const STATUS_COLORS = {
  Pending: "bg-gold/15 text-gold",
  Confirmed: "bg-palm/10 text-palm-dark",
  Preparing: "bg-palm/10 text-palm-dark",
  Ready: "bg-palm/15 text-palm-dark",
  "Out for Delivery": "bg-jollof/10 text-jollof",
  Completed: "bg-ink/10 text-ink/60",
  Cancelled: "bg-jollof/15 text-jollof-dark",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const { settings } = useSettings();

  useEffect(() => subscribeToOrders(setOrders, () => setOrders([])), []);

  const filtered = useMemo(() => {
    let list = [...orders];
    if (statusFilter !== "All") list = list.filter((o) => o.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (o) =>
          o.customerName?.toLowerCase().includes(q) ||
          o.phone?.includes(q) ||
          o.id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, search, statusFilter]);

  async function handleStatusChange(id, status) {
    await updateOrderStatus(id, status);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this order permanently?")) return;
    await deleteOrder(id);
  }

  function handlePrint(order) {
    const win = window.open("", "_blank", "width=400,height=600");
    win.document.write(`
      <pre style="font-family: monospace; font-size: 14px; padding: 16px;">
AONE RESTAURANT ORDER
Order ID: ${order.id}
Customer: ${order.customerName}
Phone: ${order.phone}
Address: ${order.address || "N/A"}
Type: ${order.orderType}

${order.items.map((i) => `${i.name} x${i.quantity} = ${formatNaira(i.price * i.quantity, settings.currencySymbol)}`).join("\n")}

Subtotal: ${formatNaira(order.subtotal, settings.currencySymbol)}
Takeaway Fee: ${formatNaira(order.takeawayFee, settings.currencySymbol)}
Delivery Fee: ${formatNaira(order.deliveryFee, settings.currencySymbol)}
TOTAL: ${formatNaira(order.total, settings.currencySymbol)}

Notes: ${order.notes || "None"}
Status: ${order.status}
      </pre>
    `);
    win.document.close();
    win.print();
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Orders</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, or order ID…"
          className="flex-1 border border-ink/15 rounded-full px-5 py-2.5 focus:border-jollof outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-ink/15 rounded-full px-5 py-2.5 bg-white"
        >
          <option value="All">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((order) => (
          <div key={order.id} className="bg-white border border-ink/10 rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              className="w-full flex flex-wrap items-center gap-3 px-5 py-4 text-left"
            >
              <span className="font-medium">{order.customerName}</span>
              <span className="text-ink/40 text-sm">{order.phone}</span>
              <span className={`text-xs px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] || "bg-ink/10"}`}>
                {order.status}
              </span>
              <span className="text-ink/50 text-sm">{order.orderType}</span>
              <span className="ml-auto font-display">{formatNaira(order.total, settings.currencySymbol)}</span>
              <span className="text-xs text-ink/30">
                {toDate(order.createdAt)?.toLocaleString("en-NG") || ""}
              </span>
            </button>

            {expandedId === order.id && (
              <div className="border-t border-ink/10 px-5 py-4 space-y-3">
                <p className="text-sm text-ink/60">Address: {order.address || "N/A"}</p>
                <ul className="text-sm text-ink/70 space-y-1">
                  {order.items.map((i, idx) => (
                    <li key={idx}>
                      {i.name} × {i.quantity} = {formatNaira(i.price * i.quantity, settings.currencySymbol)}
                    </li>
                  ))}
                </ul>
                {order.notes && <p className="text-sm text-ink/50">Notes: {order.notes}</p>}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border border-ink/15 rounded-full px-4 py-2 text-sm bg-white"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button onClick={() => handlePrint(order)} className="text-sm text-palm hover:text-palm-dark">
                    Print
                  </button>
                  <button onClick={() => handleDelete(order.id)} className="text-sm text-jollof hover:text-jollof-dark">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-ink/40 py-12 text-sm">No orders match your filters.</p>
        )}
      </div>
    </div>
  );
}