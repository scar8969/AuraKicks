# AuraKicks

A sneaker storefront built with React, Vite, and Express.

## Prerequisites

- Node.js >= 20 (see `.nvmrc`)
- npm

## Install

```bash
npm ci
```

## Commands

| Command                 | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `npm run dev`           | Start Vite dev server                            |
| `npm run build`         | Production build to `dist/`                      |
| `npm start`             | Start Express production server                  |
| `npm test`              | Run unit tests (Vitest)                          |
| `npm run test:e2e`      | Run E2E tests (Playwright)                       |
| `npm run lint`          | Run ESLint                                       |
| `npm run format`        | Format with Prettier                             |
| `npm run format:check`  | Check formatting without writing                 |
| `npm run data:validate` | Validate catalog data integrity                  |
| `npm run check`         | Run all checks (lint, format, test, data, build) |

## Environment Variables

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `PORT`   | `8080`  | Server port |

## Architecture

- **Frontend**: React 18 SPA built with Vite
- **Backend**: Express 5 serving static files and API
- **Data**: Product catalog in `api/products.json`
- **Shared logic**: `src/lib/pricing.js` and `src/lib/cart.js`

### Key Modules

- `src/lib/pricing.js` — Shared pricing helpers (effective price, compare-at, EMI, formatting)
- `src/lib/cart.js` — Cart reducer (add, remove, increment, decrement, clear)
- `scripts/validate-catalog.js` — Catalog schema validator

## Deployment

1. Run `npm ci`
2. Run `npm run build`
3. Start with `npm start` (or `node server.js`)
4. The server resolves paths from `import.meta.url`, so it works from any working directory
5. Health checks: `GET /health/live` and `GET /health/ready`

## Testing

- Unit tests: `src/lib/*.test.js` (Vitest + React Testing Library)
- E2E tests: `e2e/*.spec.js` (Playwright)
- Data validation: `npm run data:validate`

## CI

GitHub Actions workflow in `.github/workflows/ci.yml` runs:

- ESLint
- Prettier check
- Catalog data validation
- Unit tests
- Production build
- Production dependency audit
