import { formatNaira, toWhatsAppNumber } from "./format";

/**
 * Builds the exact order message format from the brief and returns a ready
 * to open wa.me URL. The order MUST already be saved to Firestore before
 * calling this — orderId should be the real Firestore document id.
 */
export function buildWhatsAppOrderUrl({
  whatsappNumber,
  orderId,
  customerName,
  phone,
  address,
  orderType,
  items,
  subtotal,
  takeawayFee,
  deliveryFee,
  total,
  notes,
  currencySymbol,
}) {
  const lines = [
    "AONE RESTAURANT ORDER",
    "",
    "Order ID:",
    orderId,
    "",
    "Customer Name:",
    customerName,
    "",
    "Phone Number:",
    phone,
    "",
    "Delivery Address:",
    address || "N/A",
    "",
    "Order Type:",
    orderType,
    "",
    "ORDER ITEMS:",
    ...items.map(
      (item) =>
        `${item.name} x ${item.quantity} = ${formatNaira(item.price * item.quantity, currencySymbol)}`
    ),
    "",
    "Subtotal:",
    formatNaira(subtotal, currencySymbol),
    "",
    "Takeaway Fee:",
    formatNaira(takeawayFee, currencySymbol),
    "",
    "Delivery Fee:",
    formatNaira(deliveryFee, currencySymbol),
    "",
    "TOTAL:",
    formatNaira(total, currencySymbol),
    "",
    "Additional Notes:",
    notes || "None",
    "",
    "Please confirm my order.",
  ];

  const message = encodeURIComponent(lines.join("\n"));
  const number = toWhatsAppNumber(whatsappNumber);
  return `https://wa.me/${number}?text=${message}`;
}