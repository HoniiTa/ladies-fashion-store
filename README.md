# Luxe Ladies — Haute Couture & Modest Luxury E-Commerce

> **“Elegance That Defines You”**

A full-stack, production-ready luxury women's fashion e-commerce application built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js), featuring a luxurious **Navy Blue + Gold** aesthetic, seamless client shopping experience, and an executive administration suite.

---

## ✨ Design & Visual Identity

* **Theme**: Deep Royal Navy (`#0A1128`, `#001F54`) accented with Gilded Metallic Gold (`#D4AF37`, `#F3E5AB`).
* **Typography**: Editorial Serif (`Playfair Display`, `Cormorant Garamond`) paired with modern clean sans (`Montserrat`).
* **Style**: High Fashion, Modest Luxury, Feminine, Elegant, Clean, and 100% Fully Responsive across Mobile, Tablet, and Desktop.

---

## 💎 Features Overview

### 1. Customer Experience
* **Authentication & Profile**: Secure JWT login, registration with password hashing (bcrypt), and personal profile management with saved delivery coordinates.
* **Boutique Catalog & Filters**: Real-time keyword search, category filtering, dynamic price range sliders, sorting (newest, price, ratings, popularity), and pagination.
* **Product Details**: Multi-angle high-resolution gallery, size & color selectors, stock count alerts, couture fabric breakdown, and client review submission.
* **Shopping Bag & Wishlist**: Real-time quantity steppers, free express shipping progress bar ($150 threshold), coupon discount simulation (`LUXE10`), and wishlist toggles.
* **Bespoke Checkout**: Multi-step checkout with address autofill, payment options (Simulated Credit/Debit Card terminal, White-Glove Cash on Delivery, PayPal), and celebratory confetti upon order placement.
* **Client Reviews & Critiques**: Star rating (1-5), verified purchaser badges, and automated product rating recalculations.

### 2. Admin Control Room
* **Executive Analytics**: Real-time KPI summary cards (Total Revenue, Total Orders, Active Catalog Items, Registered Patrons), recent order logs, and low-inventory replenishment alerts.
* **Product Management**: Full CRUD (Add, Edit, Delete) with image URLs, stock controls, categories, sizes, colors, material descriptions, and feature badges.
* **Order Logistics**: Inspect complete order items and customer addresses; update fulfillment status (`Processing`, `Shipped`, `Delivered`, `Cancelled`) and assign courier tracking numbers.
* **Department Categories**: Add, edit, or delete store categories with dynamic product counts.
* **Customer Management**: Review registered patrons and toggle administrative privileges (`admin` vs `customer`).
* **Review Moderation**: Moderate client reviews and delete inappropriate submissions.

---

## 👑 Demo Access Credentials

The database has already been seeded with sample products, categories, reviews, orders, and demo accounts:

| Role | Email | Password | Quick Action |
| :--- | :--- | :--- | :--- |
| **Store Admin** | `admin@luxeladies.com` | `adminpassword123` | Click **"Fill Admin"** on the Login Page |
| **Customer** | `customer@luxeladies.com` | `customerpassword123` | Click **"Fill Customer"** on the Login Page |

---

## 🏛️ Categories Included

1. **Dresses** — Breathtaking evening gowns & silk cocktail silhouettes
2. **Abayas** — Hand-embroidered modern & traditional royal abayas
3. **Hijabs** — Grade 6A Mulberry silk & gilded pleated modal shawls
4. **Handbags** — Italian calfskin quilted bags & sculptural evening clutches
5. **Shoes** — Stiletto pumps & baroque gold heel mules
6. **Jewelry** — 18k gold vermeil, natural baroque pearls & sapphire collars
7. **Accessories** — Italian silk monogram scarves & gold-link waist belts
8. **New Arrivals** — Runway releases freshly styled for the contemporary muse

---

## ⚙️ Architecture & Tech Stack

```
ladies fashion store/
├── backend/
│   ├── config/db.js              # MongoDB Mongoose connection
│   ├── controllers/              # Business logic for auth, products, orders, etc.
│   ├── middleware/               # JWT auth & error handling
│   ├── models/                   # Mongoose Schemas (User, Product, Category, Order, Review)
│   ├── routes/                   # REST API routes
│   ├── seeder.js                 # Database seeder with realistic sample products & reviews
│   ├── server.js                 # Express server entry point (Port 5000)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Footer, ProductCard, QuickViewModal, AdminSidebar, etc.
│   │   ├── context/              # AuthContext, CartContext, WishlistContext
│   │   ├── pages/                # Home, Shop, ProductDetails, Categories, Cart, Checkout, etc.
│   │   │   └── admin/            # AdminDashboard, AdminProducts, AdminOrders, AdminUsers, etc.
│   │   ├── services/api.js       # Centralized API service with Bearer token injection
│   │   ├── App.jsx               # Client routes & protected route wrappers
│   │   └── index.css             # Tailwind directives & luxury gold styling
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js            # Port 5173 with proxy to backend port 5000
│   └── package.json
└── package.json                  # Root runner
```

---

## 🚀 Running the Project

### Prerequisites
* **Node.js** (v18+)
* **MongoDB** (running locally on `mongodb://127.0.0.1:27017` or configured via `backend/.env`)

### 1. Backend Server
```bash
cd backend
npm install
node seeder.js    # (Optional: seeds sample products and users)
npm start         # Runs on http://localhost:5000
```

### 2. Frontend Application
```bash
cd frontend
npm install
npm run dev       # Runs on http://localhost:5173
```

---

## 📡 REST API Reference

### Authentication & Users
* `POST /api/auth/register` — Create new customer account
* `POST /api/auth/login` — Login & receive JWT
* `GET  /api/auth/me` — Get current authenticated user
* `PUT  /api/auth/profile` — Update name, phone, address, or password
* `GET  /api/users/cart` — Get synchronized cart
* `POST /api/users/cart` — Add or modify item in cart
* `DELETE /api/users/cart/:itemId` — Remove item from cart
* `GET  /api/users/wishlist` — Get user wishlist
* `POST /api/users/wishlist/toggle` — Toggle wishlist product
* `GET  /api/users` — Admin: list all customers
* `PUT  /api/users/:id/role` — Admin: toggle user role (`admin` / `customer`)
* `DELETE /api/users/:id` — Admin: delete customer

### Products & Categories
* `GET    /api/products` — Filter products (`category`, `keyword`, `minPrice`, `maxPrice`, `sort`, `page`)
* `GET    /api/products/:id` — Get single product with reviews & related items
* `GET    /api/products/featured` — Get featured showcase items
* `GET    /api/products/new-arrivals` — Get newest pieces
* `POST   /api/products` — Admin: create product
* `PUT    /api/products/:id` — Admin: update product
* `DELETE /api/products/:id` — Admin: delete product
* `GET    /api/categories` — Get categories with product counts
* `POST   /api/categories` — Admin: create category
* `PUT    /api/categories/:id` — Admin: update category
* `DELETE /api/categories/:id` — Admin: delete category

### Orders & Reviews
* `POST   /api/orders` — Create new customer order & reduce inventory
* `GET    /api/orders/myorders` — Get authenticated user's orders
* `GET    /api/orders/:id` — Get order details
* `GET    /api/orders` — Admin: get all customer orders
* `PUT    /api/orders/:id/status` — Admin: update order status & tracking number
* `POST   /api/reviews` — Submit verified customer critique
* `GET    /api/reviews` — Admin: view all reviews
* `DELETE /api/reviews/:id` — Delete review

---

© 2026 Luxe Ladies. All rights reserved.
