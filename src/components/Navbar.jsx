import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/menu", label: "Menu" },
  { to: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();
  const { settings } = useSettings();

  const linkClass = ({ isActive }) =>
    `text-sm tracking-wide transition-colors ${
      isActive ? "text-jollof font-semibold" : "text-ink/80 hover:text-jollof"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-ink/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <span className="w-9 h-9 rounded-full bg-jollof text-cream flex items-center justify-center font-display font-bold text-sm">
            A1
          </span>
          <span className="font-display font-semibold text-lg text-ink leading-none">
            {settings.brandName || "AONE RESTAURANT"}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === "/"}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/cart"
            className="relative flex items-center gap-2 border border-ink/15 rounded-full pl-4 pr-3 py-1.5 text-sm hover:border-jollof transition-colors"
          >
            Cart
            {itemCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-jollof text-cream text-xs flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        <button
          className="md:hidden p-2 -mr-2"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <div className="w-6 h-0.5 bg-ink mb-1.5" />
          <div className="w-6 h-0.5 bg-ink mb-1.5" />
          <div className="w-6 h-0.5 bg-ink" />
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-ink/10 bg-cream px-4 pb-4 flex flex-col gap-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/cart" className={linkClass({ isActive: false })} onClick={() => setOpen(false)}>
            Cart {itemCount > 0 ? `(${itemCount})` : ""}
          </Link>
        </nav>
      )}
    </header>
  );
}