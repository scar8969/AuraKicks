# AuraKicks Production Remediation Plan

## Objective

Bring the current React/Vite/Express storefront to a production-ready standard without hiding unfinished commerce behavior or rewriting the application unnecessarily. The work is complete only when catalog browsing, cart and checkout behavior, data contracts, accessibility, security, performance, deployment, and operational controls are verified by automated and runtime evidence.

## Baseline

The August 2026 audit established this baseline:

- 25 application, component, style, server, and configuration files were reviewed.
- `api/products.json` contains 1,953 products and is 3.84 MB.
- The initial catalog creates 1,953 cards and 11,348 image elements.
- `npm run build` succeeds with Vite 5.4.21.
- There are no application tests, lint checks, type checks, or CI gates.
- `npm audit` reports one moderate and one high development-tool vulnerability; production dependencies report none.
- Live probes reproduced incorrect API fallback behavior and working-directory-dependent static paths.

This document treats the 40 audit findings as acceptance requirements, not optional suggestions.

## Delivery Principles

1. Fix correctness and security before visual polish.
2. Put business rules in shared, tested functions rather than duplicating them in cards, search, detail, and cart views.
3. Never present fake success. Disable or remove checkout, newsletter, social, and drop actions until real contracts exist.
4. Treat product data as untrusted input and validate it at a defined boundary.
5. Meet WCAG 2.2 AA for supported user journeys and controls.
6. Keep pull requests independently deployable, migration-safe, and small enough to review.
7. Require measured evidence for performance and release gates; a successful bundle build alone is insufficient.
8. Do not introduce compatibility layers without a concrete persisted-data or external-consumer requirement.

## Decisions Required Before Implementation

These inputs must be owned and recorded in an architecture decision record. They do not block foundational work, but they block truthful completion of the named feature.

| Decision                               | Owner                      | Blocks                   | Required output                                                                                           |
| -------------------------------------- | -------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------- |
| Payment provider and checkout model    | Product + backend/security | Checkout                 | Provider, hosted vs embedded flow, supported currency, webhook model, idempotency and refund requirements |
| Inventory authority                    | Product + backend          | Add-to-cart and checkout | Source of truth for product, variant, stock, purchasability and price                                     |
| Newsletter provider and consent policy | Marketing + legal          | Newsletter               | Provider API, double opt-in decision, privacy text, retention and deletion rules                          |
| Canonical catalog owner                | Product/data               | Data cleanup             | Source system, import cadence, schema owner and rejection policy                                          |
| Image hosting strategy                 | Platform                   | Reliable media           | Approved CDN/storage, transformation sizes, cache policy and fallback asset                               |
| Real social destinations               | Marketing                  | Footer links             | Approved URLs or approval to remove links                                                                 |
| Drop product and fixed deadline        | Product                    | Countdown/drop CTA       | Product/collection identifier, timezone-aware timestamp and sold-out/expired behavior                     |
| Browser/device support                 | Product + QA               | Compatibility gate       | Supported browser matrix and minimum mobile viewport                                                      |
| Analytics and privacy scope            | Product + legal            | Observability            | Events, consent requirements, data minimization and retention                                             |

## Target Architecture

- Keep React and Express, upgrading supported package versions in a dedicated dependency change.
- Add a single catalog normalization/validation boundary. Components consume normalized `Product` values rather than raw JSON.
- Add shared pricing helpers for effective price, compare-at price, line totals and cart totals.
- Represent purchasable variants explicitly. Never fabricate sizes.
- Keep cart state normalized to product ID, variant/size and quantity; revalidate server-side when checkout begins.
- Serve production assets using module-relative absolute paths and reserve `/api/*` for JSON responses.
- Fetch a paginated or incrementally rendered catalog summary; fetch full product/gallery data only when needed.
- Use semantic native controls and an accessible dialog primitive or one well-tested internal dialog implementation.
- Add health/readiness endpoints, structured logs, request IDs, security headers and graceful shutdown.

## Phase 0: Establish Quality Gates

**Purpose:** make every later fix executable and regression-resistant.

**Files:** `package.json`, `package-lock.json`, new ESLint/Prettier configuration, `vite.config.js`, test setup, `.github/workflows/ci.yml`, `README.md`.

### Work

- Pin and document a supported Node LTS version with `.nvmrc` or `engines`.
- Upgrade Vite and `@vitejs/plugin-react` to supported, audit-clean versions. Upgrade React separately only if migration testing justifies it.
- Add scripts: `lint`, `format:check`, `test`, `test:coverage`, `test:e2e`, `data:validate`, `check`, and keep `build`.
- Add ESLint with React Hooks and accessibility rules. Add Prettier as a non-semantic formatting gate.
- Add Vitest, React Testing Library, `user-event`, and Playwright.
- Add unit coverage for pricing, cart reducers, catalog validation, filtering and error states before changing those areas.
- Add initial Playwright smoke tests for page load, catalog visibility, search, product detail, add-to-cart and cart quantity.
- Add CI using a clean lockfile install. Run lint, formatting, unit tests, data validation, production build, dependency audit and browser smoke tests.
- Add `README.md` with install, Node version, commands, environment variables, architecture, data source, deployment procedure and troubleshooting.
- Define branch protection so required checks cannot be bypassed for release branches.

### Acceptance

- `npm ci && npm run check && npm run test:e2e && npm run build` succeeds from a clean checkout.
- CI reproduces those commands and fails on lint, tests, invalid catalog data, vulnerable production dependencies or build failure.
- No project code is excluded merely to make coverage pass.
- README instructions work from a clean checkout.

## Phase 1: Harden Server and API Contracts

**Purpose:** remove ambiguous HTTP behavior and make deployment independent of the shell working directory.

**Files:** `server.js`, server integration tests, deployment documentation.

### Work

- Resolve `dist` and `api` from `import.meta.url`; never from `process.cwd()`.
- Define explicit API routes before the SPA fallback.
- Return JSON `404` for unknown `/api/*` routes and proper `404` responses for missing assets.
- Restrict SPA fallback to routes that accept HTML and do not look like static files.
- Check that `dist/index.html` exists at startup and fail fast with a useful error if not built.
- Add centralized error handling without leaking stack traces in production.
- Add request IDs, structured logs, response status and duration logging.
- Add `helmet` or equivalent headers, explicit CORS policy, body/request limits and conservative caching rules.
- Add `/health/live` and `/health/ready`; readiness must verify required local artifacts and external dependencies once introduced.
- Handle `SIGTERM`/`SIGINT` with graceful shutdown and a bounded drain timeout.
- Validate `PORT` and other environment configuration at startup.

### Tests

- Start the server from both the repository and an unrelated working directory.
- Verify root HTML, hashed assets, `/aura.svg`, product API, deep-link fallback, unknown API, unknown asset, unsupported method and malformed request behavior.
- Verify status code, content type, cache headers and security headers, not only response bodies.

### Acceptance

- `/api/products.json` returns JSON regardless of launch directory.
- `/api/not-found` returns JSON 404 and never the SPA document.
- A missing `.js`, `.css`, image or map returns 404, not HTML 200.
- Startup and shutdown behavior is covered by integration tests.

## Phase 2: Define and Clean the Catalog Contract

**Purpose:** stop components from compensating for invalid or incomplete source data.

**Files:** `api/products.json`, new schema/validator/import scripts, catalog normalization module.

### Work

- Define a versioned product schema using a runtime validator such as Zod or JSON Schema.
- Validate unique IDs and SKUs, non-empty names, currency, finite non-negative prices, sale invariants, image structure, variant sizes, inventory flags and canonical URLs.
- Decide whether `price` means effective price. Prefer explicit `regularPrice`, `salePrice`, and an `effectivePrice()` helper; reject contradictory values.
- Repair all 49 sale records so compare-at and effective prices are semantically distinct where a sale is claimed.
- Repair two empty SKUs, four products with absent sizes, 50 malformed image metadata records and 61 products with duplicate image URLs at the canonical source.
- Never invent sizes. Products without sellable variants remain viewable but cannot be added to cart.
- Populate canonical slugs and URLs. Populate descriptions and return-policy references only from approved content; remove unused empty fields if they are not part of the contract.
- Sanitize any allowed rich-text fields at ingestion. Prefer structured/plain content over arbitrary HTML.
- Normalize images by URL, position and exactly one primary image. Add dimensions or aspect metadata if available.
- Migrate images to approved storage/CDN or implement a verified proxy/cache strategy with responsive renditions and a local fallback.
- Generate a lightweight catalog summary payload separate from full gallery/detail data.
- Run schema validation during import, CI and server startup. Bad imports fail atomically and preserve the last known good catalog.

### Acceptance

- `npm run data:validate` checks every record and exits non-zero for any invariant violation.
- The validated dataset has unique IDs/SKUs, valid sale semantics, valid variants, no duplicate image URLs per product and exactly one primary image.
- Components do not contain fallback variant fabrication or raw-data repair logic.
- Invalid rich text cannot produce executable markup.

## Phase 3: Repair Commerce Correctness

**Purpose:** make every displayed and charged amount, quantity, size and inventory state consistent.

**Files:** `src/App.jsx`, `ProductCard.jsx`, `ProductDetail.jsx`, `CartDrawer.jsx`, `SearchOverlay.jsx`, shared product/cart modules and tests.

### Work

- Create shared helpers for effective price, compare-at price, EMI display eligibility, line total and cart total.
- Use integer minor currency units or a decimal-money library for all calculations; do not use floating-point money arithmetic.
- Replace callback-spread cart logic with a tested reducer or domain module supporting add, remove, set quantity, merge and hydration.
- Pass requested quantity from Product Detail and enforce positive integer/max limits.
- Require an explicit available size before add-to-cart. Show a focused validation message instead of silently picking the first size.
- Honor `in_stock`, `purchasable` and variant availability on cards, detail view, cart and checkout.
- Reset image, size, quantity and validation state whenever the selected product changes or the detail view closes.
- Store normalized cart lines rather than whole mutable product snapshots. Persist a versioned cart in local storage only after migration/error handling tests exist.
- Revalidate product ID, variant, stock, price and maximum quantity at checkout initiation. The server remains authoritative.
- Make Quick View reachable by pointer, keyboard and touch without obscuring primary card actions.
- Replace empty image `src` values with a real fallback and handle image load errors without retry loops.
- Ensure inactive carousel images are hidden from assistive technology and hover timers are cleaned up on unmount.

### Checkout Work

- Until a provider is selected, label checkout unavailable and disable it with explanatory text; do not ship a dead active button.
- Use a server-created checkout session. Never trust client totals or expose secret keys.
- Add idempotency keys, webhook signature verification, duplicate-event handling, inventory reconciliation and auditable order states.
- Define timeout, cancellation, payment failure, price-change, out-of-stock and retry experiences.
- Do not claim zero-interest EMI unless the selected provider and eligibility rules guarantee it.

### Tests

- Unit tests cover sale/non-sale/free/invalid prices, quantity boundaries, duplicate lines, removal, persisted-cart migrations and stale product revalidation.
- Component tests prove explicit size selection, sold-out behavior, quantity propagation, reset behavior and consistent displayed totals.
- E2E tests cover browse-to-cart and the provider sandbox checkout success/failure/cancel flows when integrated.

### Acceptance

- The amount shown in search, card, detail, cart and checkout is derived from one pricing contract.
- Quantity and selected variant survive every transition accurately and cannot exceed availability.
- Checkout is either end-to-end functional in a provider sandbox or visibly unavailable; it is never a dead control.

## Phase 4: Catalog Performance and Resilience

**Purpose:** avoid loading and rendering the entire catalog and gallery set at startup.

**Files:** `App.jsx`, `ShopSection.jsx`, `ProductCard.jsx`, API/catalog service, Vite performance configuration.

### Work

- Provide server-side pagination/cursor queries with validated search, category, brand and sort parameters.
- If static-only hosting remains a requirement, split the catalog into an index and detail chunks and render incrementally; do not map all records initially.
- Render 24-48 cards per page or use accessible virtualization with tested focus behavior.
- Render only the primary product image on a card. Fetch/decode alternate gallery images on intentional detail/hover interaction and respect reduced data/motion.
- Add request cancellation, timeout, retry and distinct loading/error/empty states.
- Preserve filters in URL query parameters for shareability and browser navigation.
- Use responsive `srcset`/`sizes`, explicit image dimensions, modern compressed formats and a CDN cache policy.
- Remove duplicate font loading from CSS and HTML; self-host approved font subsets or retain one optimized `<link>` path.
- Remove the duplicate root `aura.svg`; retain the public asset and optimize its markup.
- Replace random preloader progress with real app readiness, or remove the blocking preloader. Never delay usable content for decoration.
- Add bundle budgets and Lighthouse CI using representative mobile throttling.

### Performance Budgets

- Initial catalog DOM contains no more than the configured page size of cards and one product image per card.
- Initial product API payload target: <= 150 kB compressed for the first page.
- Route JavaScript target: <= 170 kB compressed unless a reviewed exception documents value and alternatives.
- On the agreed mobile profile: LCP <= 2.5 s, INP <= 200 ms and CLS <= 0.1 at the 75th percentile.
- No long task over 200 ms during initial catalog rendering on the reference device.

### Acceptance

- Automated tests count rendered cards/images and prevent regression to 1,953 cards or 11,348 image elements.
- Lighthouse CI and bundle budgets pass on the production build.
- API failure exposes a retryable error rather than an empty catalog.

## Phase 5: Accessibility and Responsive Interaction

**Purpose:** meet WCAG 2.2 AA across browsing, search, product detail, cart and forms.

**Files:** all interactive components and `src/index.css`.

### Work

- Use semantic buttons, links, labels, headings, landmarks and status regions. Do not attach click behavior to `<div>` or `<img>`.
- Implement Search, Product Detail and Cart as dialogs/drawers with names, `aria-modal`, initial focus, focus trap, Escape close, focus restoration, inert background and scroll locking.
- Add accessible names for close, quantity, remove, thumbnail and cart-count controls with product context where needed.
- Add explicit labels for catalog search, selects, newsletter email and quantity. Associate validation/error text programmatically.
- Add a mobile navigation control and menu preserving all desktop destinations.
- Add consistent, high-contrast `:focus-visible` styling without suppressing native outlines unless replaced.
- Increase touch targets to at least 44 by 44 CSS pixels or equivalent spacing.
- Correct low-contrast text to AA ratios; verify with automated and manual contrast checks.
- Honor `prefers-reduced-motion` for all nonessential transitions, auto-rotation, smooth scrolling and carousel behavior. Stop announcement rotation or expose a pause mechanism.
- Keep changing announcement content out of disruptive live regions and make all messages available without timing dependence.
- Make toast/cart changes polite live-region announcements without repeated noise.
- Ensure zoom to 200% and 320 CSS-pixel reflow without clipping or two-dimensional scrolling.
- Ensure decorative SVGs/images are hidden and meaningful images have concise, non-duplicated alternatives.

### Tests

- Add axe checks to component and Playwright tests, while recognizing that automation is not full WCAG coverage.
- Run manual keyboard-only, screen-reader, zoom/reflow, reduced-motion and touch-target audits.
- Test supported browsers and mobile viewports from the agreed matrix.

### Acceptance

- No critical or serious automated accessibility violations.
- Every journey can be completed by keyboard with visible focus and predictable focus return.
- A documented manual WCAG 2.2 AA audit has no unresolved release-blocking findings.

## Phase 6: Replace Misleading and Incomplete Features

**Purpose:** ensure every claim and control reflects real behavior.

**Files:** `Countdown.jsx`, `Drop.jsx`, `Footer.jsx`, `Stats.jsx`, `AnnouncementBar.jsx`, `Hero.jsx`, related styles and service modules.

### Work

- Drive countdown from a fixed, timezone-aware server/config timestamp and define upcoming, live, expired and unknown states.
- Connect the drop CTA to a real product/collection and inventory state. Remove claim/reservation wording unless it actually reserves inventory.
- Integrate newsletter submission through a server endpoint/provider with consent copy, loading, success, duplicate, validation, rate-limit and failure states. Remove `alert()` and never clear input on failure.
- Replace social placeholders with approved URLs or remove those links.
- Compute size and price statistics from validated catalog metadata; remove hardcoded claims.
- Derive product-count announcement copy from data/config rather than a literal.
- Make the hero scroll affordance a real anchor/button or treat it as decorative text.
- Review all marketing claims, including shipping, EMI, inventory counts, materials and product authenticity, with product/legal owners.

### Acceptance

- Static analysis finds no `href="#"`, fake form success, dead active CTA or reset-on-reload deadline.
- Every promotional claim has a named source of truth and an owner.
- Feature failure states are visible, actionable and covered by tests.

## Phase 7: Production Security and Operations

**Purpose:** operate the storefront safely and detect failures after release.

**Files:** server/config, deployment manifests, CI, runbooks and monitoring configuration.

### Work

- Eliminate known production vulnerabilities and formally review development-only advisories.
- Generate an SBOM, enable dependency update automation and add secret scanning.
- Add a restrictive Content Security Policy compatible with selected payment/newsletter/image providers; remove inline styles where needed to avoid `unsafe-inline`.
- Add rate limits and abuse protection to newsletter, checkout and other write endpoints.
- Validate and encode all inputs/outputs; sanitize approved rich text at ingestion and rendering boundaries.
- Keep secrets in the deployment secret manager, rotate them, and ensure logs never contain payment, email or token data.
- Add structured error reporting and metrics for API errors, catalog load failures, checkout conversion/failure, image failures and web vitals.
- Define service-level objectives, alerts, dashboards, on-call ownership and rollback criteria.
- Add immutable asset caching, controlled API caching/ETags, compression and CDN configuration.
- Create backup/restore and catalog rollback procedures. Test restoration rather than only documenting it.
- Use preview/staging environments with provider sandbox credentials and production-equivalent headers.
- Add a deployment smoke test and automatic rollback trigger for health, error-rate or checkout regressions.

### Acceptance

- Production dependency audit has no high/critical findings; accepted lower findings have owner, rationale and expiry.
- CSP, security headers, rate limits, health checks, logging and graceful shutdown are verified in staging.
- A rollback and catalog restore rehearsal succeeds and is recorded.

## Phase 8: Release Qualification

**Purpose:** verify the integrated system rather than relying on phase-local success.

### Required Test Matrix

- Clean install and deterministic production build.
- Unit, component, integration and E2E suites.
- Catalog schema validation against the complete dataset.
- Server contract tests from an unrelated working directory.
- Payment-provider sandbox success, failure, cancel, duplicate webhook and stale-price paths.
- Keyboard, screen reader, zoom/reflow, reduced-motion and mobile navigation checks.
- Lighthouse/mobile performance and bundle budgets.
- Security headers, CSP, dependency audit, secret scan and abuse controls.
- Supported browsers, viewport sizes and degraded network/API failure behavior.
- Deployment, health/readiness, graceful shutdown, rollback and restore smoke tests.

### Release Gates

- No unresolved P0/P1 defects.
- No dead controls or fake success states.
- No known high/critical production dependency vulnerability.
- All required CI checks pass from a clean checkout.
- WCAG 2.2 AA manual audit is signed off.
- Performance budgets pass on production artifacts.
- Product signs off pricing, inventory, shipping, EMI, countdown and promotional claims.
- Security signs off checkout, CSP, secrets and webhook handling.
- Operations signs off dashboards, alerts, runbooks and rollback.

## Finding Traceability Matrix

Every audited issue must be linked to a pull request and verification result before the program closes.

| ID  | Audited issue                                    | Primary phase | Required proof                                            |
| --- | ------------------------------------------------ | ------------- | --------------------------------------------------------- |
| F01 | Quick View cannot be clicked                     | 3, 5          | Pointer, touch and keyboard component/E2E tests           |
| F02 | Checkout does nothing                            | 3             | Sandbox E2E or explicitly disabled unavailable state      |
| F03 | Product-detail quantity ignored                  | 3             | Reducer/component test adding quantities greater than one |
| F04 | 1,953 cards and 11,348 images rendered initially | 4             | DOM-count test plus performance budget                    |
| F05 | Static roots depend on working directory         | 1             | Integration test launched outside repository              |
| F06 | Unknown API/assets return SPA HTML 200           | 1             | Status/content-type contract tests                        |
| F07 | Product-detail state leaks between products      | 3             | Product-switch and reopen regression tests                |
| F08 | Sale amount displayed twice                      | 2, 3          | Data invariant and cross-view pricing tests               |
| F09 | Inventory/purchasability flags ignored           | 2, 3          | Sold-out/disabled cart and checkout tests                 |
| F10 | Missing sizes replaced with invented sizes       | 2, 3          | Validator and no-variant UI test                          |
| F11 | Fetch failures become empty catalog              | 4             | Timeout/error/retry component and E2E tests               |
| F12 | Unsanitized product HTML                         | 2, 7          | Malicious fixture test and CSP check                      |
| F13 | Mobile navigation missing                        | 5             | Mobile keyboard/touch E2E test                            |
| F14 | Dialog semantics/focus behavior missing          | 5             | Dialog unit, axe and manual screen-reader checks          |
| F15 | Search results/close are mouse-only              | 5             | Keyboard search E2E test                                  |
| F16 | Image selectors are mouse-only                   | 5             | Keyboard thumbnail test                                   |
| F17 | Tests/lint/typecheck/CI absent                   | 0             | Required CI workflow passing                              |
| F18 | Vite/esbuild advisories                          | 0, 7          | Audit report and supported-version build                  |
| F19 | Fabricated preloader progress                    | 4             | Readiness/error behavior test                             |
| F20 | Countdown resets on load                         | 6             | Fixed-clock upcoming/live/expired tests                   |
| F21 | Newsletter falsely succeeds                      | 6, 7          | Provider sandbox success/failure tests                    |
| F22 | Placeholder social links                         | 6             | Link validation or removal                                |
| F23 | Drop CTA does not claim/filter product           | 6             | Product-owned behavior E2E test                           |
| F24 | Invalid image metadata                           | 2             | Complete data validation report                           |
| F25 | Empty identifiers/content/URLs                   | 2             | Schema report and canonical URL tests                     |
| F26 | Images rely on one unverified external host      | 2, 4          | CDN/fallback test and availability monitoring             |
| F27 | Temporary/stale cart snapshots                   | 3             | Persistence migration and server revalidation tests       |
| F28 | Size silently defaults                           | 3, 5          | Required-selection keyboard/component test                |
| F29 | Focus styling absent                             | 5             | Manual focus audit and visual regression                  |
| F30 | Touch targets undersized                         | 5             | Automated geometry check and device QA                    |
| F31 | Reduced motion incomplete                        | 5             | Reduced-motion E2E/manual check                           |
| F32 | Text contrast insufficient                       | 5             | Contrast report                                           |
| F33 | Cart controls lack labels                        | 5             | Accessible-name assertions and axe                        |
| F34 | Fields rely on placeholders                      | 5             | Label association tests                                   |
| F35 | Toast delayed cleanup stale                      | 3             | Fake-timer replacement-message test                       |
| F36 | Product hover timer survives unmount             | 3             | Fake-timer unmount test                                   |
| F37 | Hardcoded statistics                             | 6             | Derived-data tests                                        |
| F38 | Fonts loaded twice                               | 4             | Network request inspection/build check                    |
| F39 | Duplicate logo asset                             | 4             | Repository/build asset check                              |
| F40 | Setup/deployment guidance absent                 | 0, 7          | Clean-checkout and deployment doc rehearsal               |

## Pull Request Sequence

Use this dependency order while allowing independent work after foundations land:

1. PR 1: Node/toolchain upgrade, scripts, lint/format, baseline tests and CI.
2. PR 2: Server path/routing hardening with integration tests and README startup guidance.
3. PR 3: Catalog schema, validator, normalization and deterministic cleanup report.
4. PR 4: Shared pricing/cart domain and commerce correctness tests.
5. PR 5: Product Card/Detail/Cart fixes, inventory enforcement and truthful unavailable checkout state.
6. PR 6: Paginated catalog API, incremental rendering, image strategy and error states.
7. PR 7: Accessible dialogs, forms, focus, mobile navigation, touch targets, contrast and reduced motion.
8. PR 8: Real countdown/drop/newsletter/social/statistics behavior after product decisions.
9. PR 9: Production checkout provider and webhook integration after security design review.
10. PR 10: Security headers, CSP, observability, deployment controls and release qualification.

Do not combine the data migration, dependency major upgrade, accessibility rewrite and checkout integration into one pull request. Each PR must include its tests and update the traceability matrix with links and evidence.

## Definition of Done for Every Work Item

- Behavior and failure semantics are documented.
- Implementation uses the canonical data/domain contract.
- Unit/component/integration/E2E coverage is added at the appropriate level.
- Accessibility, security, privacy and performance effects are reviewed.
- Loading, empty, failure, retry and disabled states are implemented where relevant.
- Logs and metrics contain enough context to diagnose failures without sensitive data.
- Documentation and environment examples are updated.
- CI passes from a clean checkout.
- Acceptance evidence is attached to the pull request.
- The corresponding finding is marked resolved only after verification against a production build or staging environment.

## Program Completion Audit

The remediation program is complete only after an auditor can map F01-F40 to merged artifacts and reproduce the associated proof. The final audit must inspect the current source, complete catalog, clean CI output, staging runtime responses, browser journeys, accessibility report, security report, performance results, and operational rehearsal records. Intent, local-only success, a green build without behavioral coverage, or an unchecked matrix entry is not completion evidence.
