# 🍕 PizzaHub — Pizza Ordering & Delivery Platform (Client)

A role-based, full-stack artisan pizza ordering and kitchen marketplace platform built with **Next.js (App Router)**, **Tailwind CSS**, **Better Auth**, and **Stripe Checkout**.

- **Client Repository**: [https://github.com/itznishandev/PizzaHub_Client](https://github.com/itznishandev/PizzaHub_Client)
- **Server Repository**: [https://github.com/itznishandev/PizzaHub_Server](https://github.com/itznishandev/PizzaHub_Server)
- **Live Application**: [https://pizzahubweb.vercel.app](https://pizzahubweb.vercel.app)
- **Live Server API**: [https://pizzahubweb.vercel.app/api](https://pizzahubweb.vercel.app/api)

---

## 🌟 Submission Credentials

- **Admin Email**: `admin@pizzahub.com`
- **Admin Password**: `AdminPassword123`
- **Vendor Email**: `vendor@pizzahub.com`
- **Vendor Password**: `VendorPassword123`
- **Customer Email**: `customer@pizzahub.com`
- **Customer Password**: `CustomerPassword123`
- **Stripe Test Card**: `4242 4242 4242 4242` (Exp: Any future date, CVC: `123`, ZIP: `90210`)

---

## 🚀 Key Features

### 1. Multi-Role Authentication & Access Control
- **Better Auth & JWT Integration**: Seamless credential authentication (email & password) and Google OAuth synchronization.
- **Strict Role-Based Routing**:
  - **Customer**: Browse menu, search, filter, order with delivery date/address, cancel pending orders, leave ratings & reviews, save pizzas to wishlist.
  - **Vendor (Restaurant)**: Create & manage restaurant profile, publish menu items with ImgBB image uploads, free plan cap (max 3 active items), accept/reject orders once, upgrade to Premium plan via Stripe.
  - **Admin**: Moderate submitted menu items (approve, reject, deactivate, delete), search/filter and block/unblock users (admins cannot be blocked), audit immutable Stripe transactions.
- **Server-Side Authorization**: Private routes verify JWT on both the client and server. Client URL tampering is intercepted both on the Next.js layout and the Express middleware.

### 2. Pizza Marketplace & Ordering Experience
- **Artisan Hero & Sections**: Animated headline, dynamic 6+ featured items, pizza categories pills, "Why Choose PizzaHub?" benefits, and 4-step "How PizzaHub Works" guide.
- **Browse Menu**: Responsive card grid with uniform card sizes, debounce search by pizza name, filter by category, filter by location (Dhaka neighborhoods), and sort by price ascending/descending.
- **Item Details & Live Order Timeline**: Multi-image photo gallery, rating stars, customer reviews list, order form modal with delivery date & address validation, and interactive status timeline modal.

### 3. Stripe Subscription & Webhook Security
- **Vendor Premium Tier ($29/mo)**: Free tier is capped at 3 active items; Premium unlocks unlimited publishing, featured homepage placement, and a verified "★ Premium Kitchen" badge.
- **Verified Webhook Flow**: Premium is only activated upon receiving and verifying a cryptographically signed Stripe webhook event (`checkout.session.completed`), never trusting frontend redirects.

### 4. Optional Requirements Implemented (4 of 5!)
1. **Reviews and Ratings**: Star ratings and customer testimonials for menu items.
2. **Dark / Light Mode**: Seamless theme toggle preserving user preference across sessions.
3. **Order Status Timeline**: Step-by-step visual progress tracking (Submitted → Accepted → Wood-Fired Oven Baking → Hot Doorstep Delivery).
4. **Favorites / Wishlist**: Instant heart toggle saving favorite pizzas to customer dashboard.

---

## 🛠️ Challenge Implementation Notes

### Challenge 1: Advanced Search and Price Sorting
- **API Query Parameters**: The `/api/menu` endpoint accepts `search`, `category`, `location`, `minPrice`, `maxPrice`, and `sort` (`price_asc`, `price_desc`, `rating`, `newest`, `featured`).
- **Frontend Debounce**: Next.js client component utilizes a 250ms debounce and URL synchronization so direct links maintain active filter states without reload issues.

### Challenge 2: JWT & Role Middleware Verification
- **Express Backend Middleware**: Every protected endpoint passes through `verifyToken` (extracting and decoding the Bearer token or cookie) and `requireRole("admin" | "vendor" | "customer")`. Invalid, expired, or tampered tokens return 401 Unauthorized; mismatched roles return 403 Forbidden.
- **Client Session Guard**: `DashboardLayout` verifies token freshness and role matching. Attempting to manually navigate to an unauthorized role automatically redirects the user to their designated dashboard.

---

## 📦 Technology Stack & NPM Packages

- **Framework**: Next.js 16 (App Router)
- **UI & Styling**: Tailwind CSS, CSS variables with light/dark tokens
- **Authentication**: Better Auth (`better-auth`, `@better-auth/react`), JWT
- **Database**: MongoDB (`mongodb` driver)
- **Payment Processing**: Stripe Checkout API & Webhooks (`stripe`)
- **Icons & Motion**: Lucide React (`lucide-react`), Framer Motion (`framer-motion`)
- **Notifications**: React Hot Toast (`react-hot-toast`), SweetAlert2 (`sweetalert2`)
- **Utilities**: `clsx`, `tailwind-merge`

---

## ⚙️ Environment Variables

Create a `.env` or `.env.local` file in the root of the client directory:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pizzahub_db?retryWrites=true&w=majority
MONGODB_DB=pizzahub_db
JWT_SECRET=your_jwt_secret_key
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_IMGBB_API_KEY=your_public_imgbb_key
```

---

## 💻 Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/itznishandev/PizzaHub_Client.git
   cd PizzaHub_Client
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Update variables with your MongoDB and API URLs
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.
