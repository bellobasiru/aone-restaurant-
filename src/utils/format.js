export function formatNaira(amount, symbol = "\u20A6") {
  const value = Number(amount) || 0;
  return `${symbol}${value.toLocaleString("en-NG")}`;
}

/** Normalizes Nigerian phone numbers to a WhatsApp-friendly international format. */
export function toWhatsAppNumber(localNumber) {
  const digits = String(localNumber).replace(/\D/g, "");
  if (digits.startsWith("234")) return digits;
  if (digits.startsWith("0")) return `234${digits.slice(1)}`;
  return digits;
}

export function isValidNigerianPhone(phone) {
  const digits = String(phone).replace(/\D/g, "");
  return /^0\d{10}$/.test(digits) || /^234\d{10}$/.test(digits);
}