# 🏛️ Trident IT — Promotional Offers & Supermarket REST API Platform

> Production-grade REST API and full-stack discovery platform for supermarket businesses to register, authenticate, and publish promotional offers, and for shoppers to browse, filter, search, and redeem available discounts in real time.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.2.1-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Relational Database](https://img.shields.io/badge/Relational_DB-SQLite_%2F_PostgreSQL-0284c7.svg)](https://sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🚀 Live Demo & OpenAPI Specification
- **Live Production URL**: [trident-it-assignment.vercel.app](https://trident-it-assignment.vercel.app)
- **Interactive OpenAPI 3.1 Spec**: [/api/v1/docs](https://trident-it-assignment.vercel.app/api/v1/docs)
- **Health Check & DB Ping**: [/api/v1/health](https://trident-it-assignment.vercel.app/api/v1/health)

---

## 📋 Assignment Objectives & Core Endpoints

| Requirement | Endpoint | Method | Description |
|---|---|---|---|
| **Register Supermarket** | `/api/v1/supermarkets/register` | `POST` | Registers a retail establishment, enforces unique business email and store slug, generates a SHA-256 hashed secret API key, and returns the merchant profile with the plaintext key (displayed once). |
| **Create Offer** | `/api/v1/supermarkets/:id/offers`<br>`/api/v1/offers` | `POST` | Authenticates via `X-API-Key` or store ID, verifies date horizon (`endDate > startDate`), computes net discounts, and attaches the offer to the supermarket relational record. |
| **Browse Available Offers** | `/api/v1/offers` | `GET` | Relational join returning available offers with parent supermarket details, category filtering, discount types, full-text search, and offset pagination. |
| **Get Supermarket** | `/api/v1/supermarkets/:id` | `GET` | Retrieves store profile and all published promotional campaigns. |
| **List Supermarkets** | `/api/v1/supermarkets` | `GET` | Lists all registered supermarkets with their active promotional counts. |
| **Redeem Offer** | `/api/v1/offers/:id/redeem` | `POST` | Validates remaining capacity, verifies active date window, and atomically increments redemption count. |

---

## 📑 Detailed Deliverables Documentation

### 1. Database Schema
Modeled for ANSI SQL-compliant **PostgreSQL** and **SQLite** with strict foreign keys and composite indexes:
- **`supermarkets` Table**: `id` (PK), `name`, `slug` (UNIQUE), `email` (UNIQUE), `phone`, `address`, `city` (INDEXED), `state`, `postal_code`, `logo_url`, `api_key_hash` (INDEXED), `api_key_prefix`, `status`, `created_at`, `updated_at`.
- **`offers` Table**: `id` (PK), `supermarket_id` (FK -> `supermarkets.id` ON DELETE CASCADE), `title`, `description`, `category`, `discount_type`, `discount_value`, `original_price`, `discounted_price`, `coupon_code`, `image_url`, `terms_and_conditions`, `start_date`, `end_date`, `status`, `max_redemptions`, `current_redemptions`, `is_featured`, `created_at`, `updated_at`.
- **`redemptions` Table**: `id` (PK), `offer_id` (FK -> `offers.id`), `user_identifier`, `client_ip`, `redeemed_at`.

*(Complete DDL available in `src/db/schema.sql` and `prisma/schema.prisma`)*.

### 2. Approach to Build this API
- **Domain-Driven Design (DDD)**: Strict 3-tier layering between HTTP Controllers (`src/app/api/v1/*`), Relational Service/Repository (`src/db/relationalDb.ts`), and Data Models (`src/lib/types.ts`).
- **Relational Integrity**: Foreign key verification ensures offers cannot be orphaned. Deleting a store cascades to its promotions.
- **Defensive Input Validation**: Normalization of business email, slug deduplication, positive price checks, and date hierarchy enforcement.

### 3. Technical Stack
- **Framework**: Next.js 15 (App Router, Node.js Route Handlers) & React 19.
- **Language**: TypeScript 5 with strict null-safety and no implicit `any`.
- **Database**: Relational SQLite / PostgreSQL schema + Prisma relational client.
- **Styling**: Tailwind CSS v4 with custom dark mode variant `@custom-variant dark (&:where(.dark, .dark *));`.
- **Testing**: Playwright headless Chromium automated browser QA.

### 4. Minimum Features on Required Endpoints
- **Supermarket Registration**: Required business credentials, unique email constraint, automatic slug generation, and high-entropy API key generation.
- **Offer Publishing**: Foreign key attachment, discount formula computation (Percentage %, Flat $, BOGO), date validity verification, and quota limits.
- **Offer Browsing**: Active temporal filtering (`availableNow=true`), multi-category pills, full-text search, city selection, and paginated metadata (`total`, `page`, `totalPages`, `hasNext`, `hasPrev`).

### 5. Endpoint Security & Defense-in-Depth
- **Cryptographic Key Hashing**: Plaintext API keys (`trsk_live_...`) are generated using 24 random bytes (`crypto.randomBytes(24)`). Only the SHA-256 hash is persisted in the database.
- **Role-Based Access Control**: Public read access vs authenticated merchant mutation via `X-API-Key`.
- **Abuse Prevention**: Rate limiting on public browsing and atomic redemption limits preventing coupon exhaustion.

### 6. Front-End Design Approach
- **Dual-Persona Architecture**:
  - **Shopper Mode**: Fast deal discovery with category carousel, search debounce, discount badges, expiration timers, coupon code copying, and an interactive "Redeem" modal with confetti celebration.
  - **Merchant Mode**: Supermarket registration form with instant API key reveal, and an offer creator studio with live discount calculation previews.
- **Interactive REST API Console**: Built-in test playground allowing reviewers to test all endpoints with cURL presets directly in the browser.
- **Accessibility**: High-contrast light and dark themes adhering to WCAG AA guidelines.

### 7. Additional Features & Scalability Roadmap
- **Geo-Proximity Filtering**: PostGIS / spatial SQLite queries finding stores within 5km/10km radius.
- **Dynamic QR Codes**: Single-use time-based QR codes scanned at POS cash registers to prevent fraudulent coupon sharing.
- **Franchise Multi-Store Chains**: Regional pricing overrides across parent supermarket chains.
- **Merchant ROI Analytics**: Telemetry tracking impressions, click-through rates, and total redemption dollar volume.

---

## 🛠️ Local Development & Quick Start

```bash
# 1. Clone repository
git clone git@github-yash560:yash560/trident_it-assignment.git
cd trident_it-assignment

# 2. Install dependencies
npm install

# 3. Type check and build
npm run build

# 4. Start local production server
npm run start -p 3999
```

---

## 🧪 Automated Browser QA Verification (Playwright)

Run the automated headless Chromium QA script:

```bash
python3 test_playwright.py
```

The automated QA suite deterministically verifies:
1. **Light / Dark Mode Contrast**: Toggles themes and verifies computed background and text colors change with sharp contrast.
2. **Category & Multi-Attribute Filters**: Cycles through all categories (Produce, Dairy, Bakery, Groceries, Beverages).
3. **Search & Pagination**: Tests search inputs and pagination button state mutations.
4. **Interactive Modals & Offer Redemption**: Verifies modal opening, coupon code clipboard copy, and redemption confetti execution.
5. **0 Runtime / Console Errors**: Validates zero unhandled exceptions throughout the full user flow.

---

## 📡 Sample cURL Requests

### 1. Register a Supermarket
```bash
curl -X POST http://localhost:3999/api/v1/supermarkets/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Trident Bay Express",
    "email": "contact@tridentbayexpress.com",
    "phone": "+1 (415) 880-9900",
    "address": "400 Howard St",
    "city": "San Francisco",
    "state": "CA",
    "postalCode": "94105"
  }'
```

### 2. Create an Offer
```bash
curl -X POST http://localhost:3999/api/v1/offers \
  -H "Content-Type: application/json" \
  -H "X-API-Key: <YOUR_MINTED_API_KEY>" \
  -d '{
    "supermarketId": "sm_trident_01",
    "title": "30% Off Organic Haas Avocados",
    "description": "Locally grown organic California avocados.",
    "category": "PRODUCE",
    "discountType": "PERCENTAGE",
    "discountValue": 30,
    "originalPrice": 7.99,
    "couponCode": "AVO30",
    "startDate": "2026-10-21T00:00:00Z",
    "endDate": "2026-11-04T23:59:59Z",
    "maxRedemptions": 500
  }'
```

### 3. Browse Available Offers
```bash
curl -X GET "http://localhost:3999/api/v1/offers?category=PRODUCE&availableNow=true&page=1&limit=6"
```

---

## 👤 Author
**Yash Jain**
- GitHub: [@yash560](https://github.com/yash560)
- Assignment for: **Trident IT** (Role: Backend Development)
