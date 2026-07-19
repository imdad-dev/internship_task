# 🍽️ Savora — Restaurant Management System

A full-stack restaurant management system built with **Node.js, Express, MongoDB (Mongoose), EJS, and jQuery**.
Customers can browse the menu, place dine-in/takeaway orders, and reserve tables. Staff get a full
admin console for orders, tables, reservations, inventory, and sales reports — with inventory that
auto-deducts as orders come in.

---

## 📸 Screenshots

| | |
|---|---|
| ![Landing](./images/landing.png) | ![Why Savora](./images/whySavora.png) |
| **Landing Page** | **Why Savora** |
| ![About](./images/about.png) | ![Order Menu](./images/orderManu.png) |
| **About** | **Order Menu** |
| ![Reserve Table](./images/reservTable.png) | ![Admin Dashboard](./images/adminDashboard.png) |
| **Reserve Table** | **Admin Dashboard** |
| ![Admin Reports](./images/adminReport.png) | ![Manage Menu](./images/manageMenu.png) |
| **Admin Reports** | **Manage Menu** |
| ![Manage Table](./images/manageTable.png) | |
| **Manage Table** | |

---

## ✨ Features

- **Public site**: landing page, live menu with category filters, cart drawer, checkout (dine-in or takeaway), table reservations, order confirmation ticket.
- **Order processing**: table availability check, per-dish ingredient consumption, stock-sufficiency check before confirming, automatic inventory deduction on order placement.
- **Admin panel** (session-based auth): dashboard stats, order management (status + payment), menu CRUD, table CRUD + live status, reservation management, inventory CRUD with quick +/- stock adjustment and low-stock badges, and a reports page (daily sales chart, top-selling dishes, stock alerts).
- Beautiful, distinctive dark "fine-dining" UI theme, fully responsive.

---

## 🧱 Tech Stack

| Layer      | Tech                                    |
|------------|------------------------------------------|
| Runtime    | Node.js + Express.js                    |
| Database   | MongoDB + Mongoose                      |
| Views      | EJS + express-ejs-layouts               |
| Frontend   | jQuery (AJAX), vanilla CSS              |
| Auth       | express-session + connect-mongo + bcryptjs |
| Other      | dotenv, morgan, method-override, connect-flash |

---

## 📁 Folder Structure

```
03_restaurant_management_sys/
├── index.js                 # Entry point (loads env, connects DB, starts server)
├── app.js                   # Express app config (middleware, view engine, route mounting)
├── package.json
├── .env.example              # Copy to .env and fill in your Mongo URI
├── images/                    # Project screenshots used in this README
├── config/
│   ├── db.js                 # Mongoose connection
│   └── seed.js               # Seeds default admin + sample tables/inventory/menu
├── models/                   # Mongoose schemas: Admin, MenuItem, Order, Table, Reservation, Inventory
├── controllers/               # Business logic per resource
├── routes/                   # Express routers (public pages, admin pages, /api/* resources)
├── middleware/                # auth.js (session guard), errorHandler.js
├── views/
│   ├── partials/              # layout.ejs, admin-layout.ejs, header.ejs, footer.ejs
│   ├── admin/                 # login, dashboard, menu, orders, tables, reservations, inventory, reports
│   └── *.ejs                  # index, menu, reserve, order-success, about, 404
└── public/
    ├── css/                   # style.css (site), admin.css (admin panel)
    ├── js/                    # menu.js, reserve.js, admin-*.js, toast.js
    └── images/
```

---

## 🔄 How Order Processing Works

1. Customer adds dishes to the cart on `/menu` (cart is kept in `localStorage`).
2. At checkout, they pick **dine-in** (must choose an available table) or **takeaway**.
3. `POST /api/orders` runs, in order:
   - Validates the table is not already `occupied` (dine-in only).
   - Looks up each dish's linked ingredients and sums how much of each raw inventory item the whole order needs.
   - Checks every required ingredient has enough stock — if not, the order is rejected with a clear shortage message.
   - Deducts the consumed quantity from `Inventory` for every ingredient used.
   - Creates the `Order` record and marks the table `occupied` (dine-in only).
4. Admins update order status from `pending → preparing → ready → served → completed` (or `cancelled`) in **Admin → Orders**; completing/cancelling a dine-in order automatically frees its table.

## 📅 How Reservations Work
Customers pick a table from the ones currently `available` on `/reserve`. On booking, that table
flips to `reserved` so it can't be double-booked; admins can confirm, complete, or cancel from
**Admin → Reservations**, which also releases the table back to `available` when appropriate.

## 📦 Inventory & Alerts
Every inventory item has a `thresholdLevel`. Anything at or below that level shows up as a
**low-stock alert** on the Admin Dashboard and the Reports page, and can be restocked with the
+/- quick adjuster or the edit form in **Admin → Inventory**.

## 📊 Reports
**Admin → Reports** shows a 7-day daily sales chart, the top 10 best-selling dishes by quantity, and
live stock alerts — all computed from real order/inventory data (no mock numbers).

---

## 🧩 Extending the Project
- Add image uploads for dishes (e.g. with `multer`) instead of the current letter-avatar thumbnails.
- Add a customer-facing order-tracking page that polls `/api/orders/:id`.
- Add role-based permissions using the existing `Admin.role` field (`superadmin`, `manager`, `staff`).
- Swap the CSS bar chart in Reports for Chart.js if you want richer visuals.

---

## 🛠️ Troubleshooting
- **"MONGO_URI not found"** → make sure you copied `.env.example` to `.env`.
- **Can't log into admin** → run `npm run seed` first; it creates the default admin account.
- **"Insufficient stock" errors on every order** → run `npm run seed` to populate inventory, or add stock manually in **Admin → Inventory**.
- **Port already in use** → change `PORT` in `.env`.

---

Built as a portfolio-ready, fully working reference project — every button, form, and API route in
this codebase is wired to real MongoDB data, with no placeholder or dummy responses.