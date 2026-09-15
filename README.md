# AONE Restaurant — Website App

A complete restaurant ordering website for **AONE RESTAURANT** (Jos, Plateau
State), built with React + Vite, Firebase (Firestore, Auth, Storage), and
ready to deploy to Netlify.

Customers can browse the menu, search and filter, build a cart, and check
out via WhatsApp. You manage everything — products, prices, images, orders,
delivery fees, restaurant info — from a secure Admin Dashboard, with no code
editing required after setup.

---

## 1. What's included

- **Customer site:** Home, About, Menu (search/filter/sort), product pages,
  cart, checkout with WhatsApp handoff, contact page.
- **Admin dashboard:** Dashboard overview, Products (add/edit/delete, quick
  price editing, image upload), Categories, Orders (status workflow,
  search, print), Customers, Sales Reports, Delivery Settings, Restaurant
  Settings, Admin Users, Profile.
- **Firebase backend:** Firestore database, Firebase Authentication (admin
  login), Firebase Storage (images), with security rules included.
- **PWA:** installable on Android/desktop, with an offline fallback screen
  (ordering itself still needs an internet connection).
- **Netlify-ready:** `netlify.toml` configured for the correct build command
  and SPA routing.

## 2. What you need to do yourself

Everything below is written for a complete beginner; it should take about
30–45 minutes the first time.

---

## 3. Run the project locally (optional — you can also deploy straight to Netlify)

```bash
npm install
npm run dev