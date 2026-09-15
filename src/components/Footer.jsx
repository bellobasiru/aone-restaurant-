import React from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="bg-ink text-cream/90 mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid gap-10 sm:grid-cols-3">
        <div>
          <h3 className="font-display text-xl text-cream mb-2">{settings.brandName}</h3>
          <p className="text-sm text-cream/70">{settings.slogan}</p>
        </div>

        <div className="text-sm space-y-1.5">
          <p className="text-cream/60 mb-1">Visit us</p>
          <p>{settings.address}</p>
          <p>{settings.openingHours} daily</p>
        </div>

        <div className="text-sm space-y-1.5">
          <p className="text-cream/60 mb-1">Get in touch</p>
          <p>{settings.phone1}</p>
          <p>{settings.phone2}</p>
          {settings.email && <p>{settings.email}</p>}
          <div className="flex gap-3 pt-2">
            <Link to="/menu" className="underline decoration-jollof-light underline-offset-4 hover:text-jollof-light">
              Order online
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-cream/10 py-4 text-center text-xs text-cream/50">
        {settings.businessName} &middot; Jos, Plateau State
      </div>
    </footer>
  );
}