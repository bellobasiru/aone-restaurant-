import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";
import { createOrder } from "../firebase/orders";
import { buildWhatsAppOrderUrl } from "../utils/whatsapp";
import { formatNaira, isValidNigerianPhone } from "../utils/format";

const ORDER_TYPES = ["Dine-in", "Takeaway", "Delivery"];

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    orderType: "Delivery",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fees = useMemo(() => {
    const takeawayFee = form.orderType === "Takeaway" && settings.takeawayEnabled ? settings.takeawayFee : 0;
    const deliveryFee = form.orderType === "Delivery" && settings.deliveryEnabled ? settings.deliveryFee : 0;
    return { takeawayFee, deliveryFee };
  }, [form.orderType, settings]);

  const total = subtotal + fees.takeawayFee + fees.deliveryFee;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-ink/60 mb-6">Your cart is empty, so there's nothing to check out yet.</p>
        <Link to="/menu" className="text-jollof hover:underline">
          Go to the menu
        </Link>
      </div>
    );
  }

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const next = {};
    if (!form.customerName.trim()) next.customerName = "Please enter your name.";
    if (!form.phone.trim()) next.phone = "Please enter a phone number.";
    else if (!isValidNigerianPhone(form.phone)) next.phone = "Enter a valid Nigerian phone number.";
    if (form.orderType === "Delivery" && !form.address.trim()) {
      next.address = "Delivery address is required for delivery orders.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError("");

    const orderPayload = {
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      orderType: form.orderType,
      notes: form.notes.trim(),
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      subtotal,
      takeawayFee: fees.takeawayFee,
      deliveryFee: fees.deliveryFee,
      total,
    };

    try {
      const orderId = await createOrder(orderPayload);
      const waUrl = buildWhatsAppOrderUrl({
        whatsappNumber: settings.whatsappNumber,
        orderId,
        currencySymbol: settings.currencySymbol,
        ...orderPayload,
      });
      clearCart();
      window.open(waUrl, "_blank", "noopener,noreferrer");
      navigate("/", { state: { orderPlaced: true, orderId } });
    } catch (err) {
      console.error(err);
      setSubmitError(
        "We couldn't save your order right now. Please check your connection and try again, or call us directly."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1.5" htmlFor="customerName">
            Full name
          </label>
          <input
            id="customerName"
            value={form.customerName}
            onChange={(e) => updateField("customerName", e.target.value)}
            className="w-full border border-ink/15 rounded-xl px-4 py-2.5 focus:border-jollof outline-none"
          />
          {errors.customerName && <p className="text-jollof text-sm mt-1">{errors.customerName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" htmlFor="phone">
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="080…"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className="w-full border border-ink/15 rounded-xl px-4 py-2.5 focus:border-jollof outline-none"
          />
          {errors.phone && <p className="text-jollof text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Order type</label>
          <div className="flex gap-3">
            {ORDER_TYPES.map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => updateField("orderType", type)}
                className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                  form.orderType === type
                    ? "bg-jollof text-cream border-jollof"
                    : "border-ink/15 text-ink/70 hover:border-ink/40"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {form.orderType !== "Dine-in" && (
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="address">
              {form.orderType === "Delivery" ? "Delivery address" : "Pickup notes (optional)"}
            </label>
            <textarea
              id="address"
              rows={2}
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              className="w-full border border-ink/15 rounded-xl px-4 py-2.5 focus:border-jollof outline-none"
            />
            {errors.address && <p className="text-jollof text-sm mt-1">{errors.address}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5" htmlFor="notes">
            Additional notes (optional)
          </label>
          <textarea
            id="notes"
            rows={2}
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            className="w-full border border-ink/15 rounded-xl px-4 py-2.5 focus:border-jollof outline-none"
          />
        </div>

        <div className="border border-ink/10 rounded-2xl p-5 space-y-2 bg-white">
          <div className="flex justify-between text-sm text-ink/70">
            <span>Subtotal</span>
            <span>{formatNaira(subtotal, settings.currencySymbol)}</span>
          </div>
          {fees.takeawayFee > 0 && (
            <div className="flex justify-between text-sm text-ink/70">
              <span>Takeaway fee</span>
              <span>{formatNaira(fees.takeawayFee, settings.currencySymbol)}</span>
            </div>
          )}
          {fees.deliveryFee > 0 && (
            <div className="flex justify-between text-sm text-ink/70">
              <span>Delivery fee</span>
              <span>{formatNaira(fees.deliveryFee, settings.currencySymbol)}</span>
            </div>
          )}
          <div className="flex justify-between font-display text-lg pt-2 border-t border-ink/10">
            <span>Total</span>
            <span className="text-jollof">{formatNaira(total, settings.currencySymbol)}</span>
          </div>
        </div>

        {submitError && <p className="text-jollof text-sm">{submitError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-palm text-cream py-3.5 rounded-full font-medium hover:bg-palm-dark transition-colors disabled:opacity-60"
        >
          {submitting ? "Placing order…" : "Checkout on WhatsApp"}
        </button>
        <p className="text-xs text-ink/40 text-center">
          Your order is saved first, then WhatsApp opens with the details pre-filled — just hit send to confirm.
        </p>
      </form>
    </div>
  );
}