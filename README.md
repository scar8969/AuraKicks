# AuraKicks 👟

> Gothic sneaker marketplace — **1,953 products**, cart, search, and product detail pages. React + Vite + Express, Railway-ready.

[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-purple)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-5-black)](https://expressjs.com/)
[![tests](https://img.shields.io/badge/tests-vitest+playwright-brightgreen)](https://github.com/scar8969/AuraKicks/actions)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![CI](https://github.com/scar8969/AuraKicks/actions/workflows/ci.yml/badge.svg)](https://github.com/scar8969/AuraKicks/actions/workflows/ci.yml)

A full-stack sneaker storefront with a gothic blackletter identity — black, red, and white. Browse a catalog of **1,953 sneaker products**, search, filter, add to cart, and open any product for full details (gallery, sizes, related items).

## ✨ Features

| Feature | Detail |
|---|---|
| **1,953 products** | Full catalog in `api/products.json`, schema-validated |
| **Product detail pages** | Gallery, sizes, related products, compare-at pricing |
| **Cart** | Reducer-based (add/remove/increment/decrement/clear), persisted |
| **Search & filters** | Find by name, brand, category |
| **INR pricing helpers** | Effective price, sale/compare-at, EMI, free shipping ≥ ₹4,999 |
| **Gothic identity** | Blackletter logo, black / #FF0000 / white palette |
| **Hardened server** | Express 5 + Helmet + rate limiting, health endpoints |
| **Accessibility** | Focus traps, keyboard navigation, semantic markup |

## 🚀 Quick start

```bash
npm ci
npm run dev          # Vite dev server
```

Production:

```bash
npm run build        # build to dist/
npm start            # Express serves dist/ + API on :8080
```

Health checks: `GET /health/live` and `GET /health/ready`.

## 🧪 Testing & quality

```bash
npm test             # unit tests (Vitest + React Testing Library)
npm run test:e2e     # E2E (Playwright)
npm run lint         # ESLint
npm run format:check # Prettier
npm run data:validate# catalog schema validation
npm run check        # everything: lint + format + test + data + build + audit
```

CI (`.github/workflows/ci.yml`) runs lint, format, data validation, unit tests, production build, and a production dependency audit on every push.

## 🏗️ Architecture

```
┌────────────────────┐     ┌─────────────────────┐
│  React 18 SPA      │────▶│  Express 5 server   │
│  (Vite, gothic UI) │     │  (helmet, rate-limit│
│  cart/search/detail│◀────│   health checks)    │
└────────────────────┘     └──────────┬──────────┘
                                      │
                          ┌───────────▼───────────┐
                          │  api/products.json    │
                          │  (1,953 products)     │
                          └───────────────────────┘
```

- **Frontend**: React 18 SPA (Vite) — `src/`
- **Backend**: Express 5 — `server.js` (static + API, helmet, rate limiting)
- **Data**: `api/products.json` (validated by `scripts/validate-catalog.js`)
- **Shared logic**: `src/lib/pricing.js` (INR pricing, EMI, free shipping), `src/lib/cart.js` (cart reducer)

## 📦 Deployment (Railway)

```bash
npm ci && npm run build && npm start
```

The server resolves paths from `import.meta.url`, so it works from any working directory.

## 📁 Project structure

```
AuraKicks/
├── api/products.json        # 1,953-product catalog
├── server.js                # Express 5 production server
├── src/
│   ├── App.jsx              # routes + layout
│   ├── components/          # UI components
│   └── lib/                 # pricing, cart, focus-trap (tested)
├── e2e/                     # Playwright specs
├── scripts/validate-catalog.js
└── .github/workflows/ci.yml
```

## License

MIT
