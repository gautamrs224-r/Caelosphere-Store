# 🌌 Caelosphere Store

A premium digital products marketplace — built with the MERN stack, showcasing modern React architecture, the Aurora Commerce design system, and Context API state management.

## Status

**Fully wired, including an admin panel.** The client talks to a real Express + MongoDB API — auth, products, cart, checkout, and order/user management are all live against the backend. No mock data left in the app.

This needs **your own MongoDB Atlas connection string** to run — see Setup below.

## Project structure

```
caelosphere-store/
  client/     React + Vite + Tailwind frontend
  server/     Express + MongoDB backend
```

## Setup — from zero to running

### 1. MongoDB Atlas

1. Create a free cluster at cloud.mongodb.com
2. Create a database user (Database Access → Add New Database User)
3. Allow your IP, or `0.0.0.0/0` for development (Network Access → Add IP Address)
4. Get your connection string from Database → Connect → Drivers → Node.js

**If you get `querySrv ECONNREFUSED` when connecting** (common on some Windows setups — Node's DNS resolver fails on `mongodb+srv://` lookups even though the network is fine): use the standard (non-SRV) connection string instead. Run `nslookup -type=TXT yourcluster.xxxxx.mongodb.net` to get your replica set name, and `nslookup -type=SRV _mongodb._tcp.yourcluster.xxxxx.mongodb.net` to get your three shard hostnames, then build:
```
mongodb://<user>:<password>@<shard-00-00>:27017,<shard-00-01>:27017,<shard-00-02>:27017/caelosphere?ssl=true&replicaSet=<your-replica-set-name>&authSource=admin&retryWrites=true&w=majority
```
`server/config/db.js` also forces IPv4 DNS resolution by default, which fixes this same issue in most cases without needing the manual string above.

### 2. Server

```bash
cd server
npm install
cp .env.example .env
```

Open `.env` and fill in:
- `MONGO_URI` — your real Atlas connection string, with your password and a database name (e.g. `/caelosphere`) added in
- `JWT_SECRET` — any long random string (`openssl rand -hex 32` works well)

Then:

```bash
npm run dev      # starts the API on http://localhost:5000
```

Confirm it worked:
```bash
curl http://localhost:5000/api/health
```
You should see `{"success":true,"message":"Caelosphere Store API is running"}`. The terminal should also print `MongoDB connected: ...`.

### 3. Client

```bash
cd client
npm install
cp .env.example .env   # defaults to http://localhost:5000/api — only change if your server runs elsewhere
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### 4. Create your account

No seeding required. Click **Get Started** in the app and register a normal account — that's a real user in your MongoDB `users` collection.

### 5. Make yourself an admin

```bash
cd server
npm run make-admin -- you@example.com
```

(use the email you just registered with). Log out and back in on the client — you'll see an **Admin Panel** link in the navbar user menu.

### 6. Cloudinary (for product image uploads)

The admin product form lets you upload a real image instead of using the gradient placeholder. This needs a free Cloudinary account:

1. Sign up at cloudinary.com
2. Your **Dashboard** page shows Cloud Name, API Key, and API Secret right at the top
3. Add them to `server/.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Restart the server

Without these set, everything else still works — products just won't have an uploadable image, and the storefront falls back to the gradient placeholder it always used. Uploading without Cloudinary configured returns a clear error telling you what's missing, rather than failing silently.

## Admin Panel

Available at `/admin` once logged in as an admin. Non-admins are blocked with a clear message; logged-out visitors are redirected to `/login`.

| Section | Route | What it does |
|---|---|---|
| Dashboard | `/admin` | Revenue, order/product/user counts, recent orders |
| Products | `/admin/products` | Search, edit, delete products |
| Add/Edit Product | `/admin/products/new`, `/admin/products/:id/edit` | Full product form — title, category, price, description, features, tags, compatibility, and an image upload (stored in Cloudinary, URL saved on the product). Slug is generated automatically from the title. |
| Orders | `/admin/orders` | Every order in the store, with an inline status dropdown (pending/paid/fulfilled/cancelled) |
| Users | `/admin/users` | List of all accounts, with a one-click promote/demote-to-admin button (you can't demote yourself, to avoid locking yourself out) |

All of this is backed by real, role-gated API endpoints — there's no client-side-only "fake" admin check. Every admin route on the server independently verifies the requester's JWT and `role: 'admin'` before doing anything, so it's not something a non-admin could bypass by just visiting the URL.

## What's wired up

### Auth
- Register/login call the real `/api/auth` endpoints. A JWT is stored in `localStorage` and attached to every API request automatically (`src/services/api.js`).
- On page load, if a token exists, the app calls `/api/auth/me` to verify it and load the user — so refreshing the page doesn't log you out, and an expired/invalid token gets cleared silently.
- Sign out calls `/api/auth/logout` and clears local state.
- Users have a `role` field (`user` or `admin`, defaults to `user`). There's no public signup path to becoming an admin — only an existing admin (or the `make-admin` script for your very first one) can grant it.

### Cart
- **Guests** get a cart stored in `localStorage` (`caelosphere_guest_cart`) — you can add items before logging in.
- **On login**, any guest-cart items are pushed to your server-side cart via `/api/cart`, then the guest cart is cleared. From that point on, the cart lives on the server and survives across devices/sessions.
- All cart actions (add/update/remove/clear) are real API calls — see `src/context/CartContext.jsx` and `src/services/cartService.js`.

### Products
- Marketplace page: live search (debounced), category filter, price filter, sort, and server-side pagination — all hitting `GET /api/products` with query params.
- Product details page: fetches by slug from `GET /api/products/:slug`, plus related products from `/api/products/:slug/related`.
- Homepage featured section: fetches per-category from the same products endpoint.
- Category counts (sidebar filter numbers) come from `GET /api/products/categories`.
- Admin create/edit/delete is fully wired (see Admin Panel above).

### Checkout & Orders
- Checkout requires login — if a guest reaches `/checkout`, they're prompted to sign in first (their cart carries over automatically once they do).
- Placing an order calls `POST /api/orders`, which builds the order from your server-side cart, marks it `paid` (no payment gateway in V1, per the original blueprint), and clears the cart.
- `/orders` shows your own order history. Admins additionally see and manage every order in the store at `/admin/orders`.

### What's intentionally still static
- **Testimonials** (`src/services/testimonials.js`) — marketing copy, not user-generated data; there's no Testimonials collection in the backend by design.
- **Category metadata** (`src/services/categoryConfig.js`) — names/colors/icons for the 6 fixed categories. Product *counts* per category are live from the API; the labels/colors themselves are just UI config, not data worth round-tripping through the database.

## API reference

**Auth** (`/api/auth`)
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | `{ name, email, password }` → user + JWT |
| POST | `/login` | Public | `{ email, password }` → user + JWT |
| GET | `/me` | Private | Current user from token |
| POST | `/logout` | Private | Clears auth cookie |
| GET | `/users` | Admin | List all users |
| PUT | `/users/:id/role` | Admin | `{ role: 'user' \| 'admin' }` — promote/demote a user |

**Products** (`/api/products`)
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List with `?category&search&minPrice&maxPrice&sort&page&limit` |
| GET | `/categories` | Public | Per-category counts |
| GET | `/id/:id` | Admin | Single product by Mongo `_id` (used by the admin edit form) |
| GET | `/:slug` | Public | Single product by slug (used by the storefront) |
| GET | `/:slug/related` | Public | Related products (same category) |
| POST | `/` | Admin | Create a product (slug auto-generated from title if omitted) |
| PUT | `/:id` | Admin | Update a product |
| DELETE | `/:id` | Admin | Delete a product |

**Upload** (`/api/upload`)
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/` | Admin | `multipart/form-data`, field name `image` (max 5MB, JPEG/PNG/WEBP/GIF only) → uploads to Cloudinary, returns `{ url, publicId }` |

**Cart** (`/api/cart`) — all routes private, scoped to the logged-in user
| Method | Route | Description |
|---|---|---|
| GET | `/` | Get current cart |
| POST | `/` | `{ productId, quantity }` — add item |
| PUT | `/:productId` | `{ quantity }` — update quantity |
| DELETE | `/:productId` | Remove one item |
| DELETE | `/` | Clear cart |

**Orders** (`/api/orders`)
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/` | Private | `{ billingInfo, paymentMethod }` — creates order from current cart, then clears it |
| GET | `/my` | Private | Current user's order history |
| GET | `/` | Admin | Every order in the store |
| GET | `/:id` | Private | Single order (owner or admin) |
| PUT | `/:id/status` | Admin | `{ status: 'pending' \| 'paid' \| 'fulfilled' \| 'cancelled' }` |

## Pages

| Page | Route | Notes |
|---|---|---|
| Home | `/` | Live featured products by category |
| Marketplace | `/marketplace` | Live search/filter/sort/pagination |
| Product Details | `/product/:slug` | Fetched by slug, with related products |
| Cart | `/cart` | Guest (local) or server cart depending on login state |
| Checkout | `/checkout` | Requires login; creates a real order |
| My Orders | `/orders` | Order history for the logged-in user |
| Login / Register | `/login` `/register` | Real auth against the backend |
| Contact | `/contact` | Static form (no backend endpoint — it's a UI-only page per blueprint scope) |
| Admin Panel | `/admin/*` | See Admin Panel section above |

## Optional: seeding sample products

If you want the storefront pre-populated with 10 sample products instead of starting from an empty catalog (e.g. for a demo), you can still run:
```bash
npm run seed
```
This is entirely optional — nothing else in the app depends on it. It also creates two extra demo accounts (`devansh@example.com` / `password123` and an admin at `admin@example.com` / `admin123`) for convenience; delete them from your `users` collection afterward if you don't want them sitting around.

## Known limitations (by design, per the original blueprint)

- No payment gateway — checkout marks orders `paid` immediately
- No seller accounts or multi-vendor support
- No email verification

## Design tokens reference

| Token | Value |
|---|---|
| Background | Deep Space `#050816` |
| Primary | Marketplace Purple `#8B5CF6` |
| Secondary | Creator Blue `#3B82F6` |
| Accent | Electric Cyan `#06B6D4` |
| Heading Font | Poppins |
| Body Font | Inter |
