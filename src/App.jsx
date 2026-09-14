import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import FirebaseSetupNotice from "./components/FirebaseSetupNotice";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Menu from "./pages/Menu";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Categories from "./pages/admin/Categories";
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";
import Reports from "./pages/admin/Reports";
import DeliverySettings from "./pages/admin/DeliverySettings";
import RestaurantSettings from "./pages/admin/RestaurantSettings";
import AdminUsers from "./pages/admin/AdminUsers";
import Profile from "./pages/admin/Profile";

function CustomerLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <FirebaseSetupNotice />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Customer-facing site */}
      <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
      <Route path="/about" element={<CustomerLayout><About /></CustomerLayout>} />
      <Route path="/menu" element={<CustomerLayout><Menu /></CustomerLayout>} />
      <Route path="/menu/:id" element={<CustomerLayout><ProductDetail /></CustomerLayout>} />
      <Route path="/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
      <Route path="/checkout" element={<CustomerLayout><Checkout /></CustomerLayout>} />
      <Route path="/contact" element={<CustomerLayout><Contact /></CustomerLayout>} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="reports" element={<Reports />} />
        <Route path="delivery" element={<DeliverySettings />} />
        <Route path="settings" element={<RestaurantSettings />} />
        <Route path="admin-users" element={<AdminUsers />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={
          <CustomerLayout>
            <div className="max-w-xl mx-auto px-4 py-24 text-center">
              <h1 className="font-display text-3xl mb-3">Page not found</h1>
              <p className="text-ink/60">The page you're looking for doesn't exist.</p>
            </div>
          </CustomerLayout>
        }
      />
    </Routes>
  );
}