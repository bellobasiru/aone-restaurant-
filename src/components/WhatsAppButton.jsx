import React from "react";
import { useSettings } from "../context/SettingsContext";
import { toWhatsAppNumber } from "../utils/format";

export default function WhatsAppButton() {
  const { settings } = useSettings();
  const number = toWhatsAppNumber(settings.whatsappNumber);
  const href = `https://wa.me/${number}?text=${encodeURIComponent(
    `Hello ${settings.brandName}, I'd like to ask about your menu.`
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-palm hover:bg-palm-dark text-cream shadow-lg flex items-center justify-center transition-colors"
    >
      <svg viewBox="0 0 32 32" width="26" height="26" fill="currentColor" aria-hidden="true">
        <path d="M16.004 3C9.376 3 4 8.373 4 15c0 2.386.7 4.61 1.906 6.48L4 29l7.72-1.858A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.7c-1.98 0-3.83-.55-5.41-1.5l-.388-.23-4.58 1.102 1.13-4.46-.253-.398A9.66 9.66 0 0 1 5.3 15c0-5.9 4.8-10.7 10.704-10.7 5.9 0 10.7 4.8 10.7 10.7s-4.8 10.7-10.7 10.7Zm5.87-8.02c-.32-.16-1.9-.94-2.194-1.045-.294-.108-.508-.16-.722.16-.214.32-.828 1.045-1.015 1.26-.187.213-.374.24-.694.08-.32-.16-1.35-.498-2.572-1.588-.95-.848-1.592-1.895-1.78-2.215-.187-.32-.02-.492.14-.652.144-.144.32-.374.48-.56.16-.187.213-.32.32-.534.107-.213.053-.4-.027-.56-.08-.16-.722-1.74-.99-2.383-.26-.626-.526-.54-.722-.55l-.615-.01c-.213 0-.56.08-.854.4-.294.32-1.12 1.096-1.12 2.673 0 1.577 1.147 3.1 1.307 3.313.16.213 2.257 3.446 5.47 4.833.764.33 1.36.527 1.826.674.767.244 1.465.21 2.017.127.615-.092 1.9-.777 2.168-1.527.267-.75.267-1.394.187-1.528-.08-.133-.294-.213-.614-.373Z" />
      </svg>
    </a>
  );
}