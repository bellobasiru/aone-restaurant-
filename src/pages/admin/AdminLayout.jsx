import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../firebase/auth";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/reports", label: "Reports" },
  { to: "/admin/delivery", label: "Delivery Settings" },
  { to: "/admin/settings", label: "Restaurant Settings" },
  { to: "/admin/admin-users", label: "Admin Users" },
  { to: "/admin/profile", label: "Profile" },
];

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutAdmin();
    navigate("/admin/login");
  }

  const linkClass = ({ isActive }) =>
    `block px-4 py-2.5 rounded-xl text-sm transition-colors ${
      isActive ? "bg-jollof text-cream" : "text-ink/70 hover:bg-ink/5"
    }`;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-cream">
      <button
        className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-ink/10 bg-white"
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span className="font-display">Admin Menu</span>
        <span>{menuOpen ? "✕" : "☰"}</span>
      </button>

      <aside
        className={`lg:w-64 shrink-0 bg-white border-r border-ink/10 p-4 ${
          menuOpen ? "block" : "hidden"
        } lg:block`}
      >
        <div className="mb-6 px-2 hidden lg:block">
          <p className="font-display text-lg">AONE Admin</p>
          <p className="text-xs text-ink/40 truncate">{user?.email}</p>
        </div>
        <nav className="space-y-1">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass} onClick={() => setMenuOpen(false)}>
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-jollof hover:bg-jollof/10 mt-2"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-4 sm:p-8 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}