# Development Progress — 10X Shop: Treasures of Middle-earth

This file records the development sequence, major implementation milestones, and architecture decisions for the graduation project. Dates follow the repository's commit history: the first project commits are dated **2026-10-22**, with later milestones recorded on **2026-10-31** and **2026-11-04 through 2026-11-06**.

## Project at a glance

10X Shop is a client-side e-commerce learning project built with React 19, TypeScript, Vite, Tailwind CSS v4, React Router, and the DummyJSON Products API. The original storefront was restyled as **Treasures of Middle-earth**, while retaining the shop's catalog, cart, account, and checkout flows. Authentication, saved data, and order placement are demonstrations stored in the browser; the app does not process real payments.

## Chronological development phases

### Phase 1 — Environment and project foundation

**Milestone date: 2026-10-22 · Complete**

- [x] Initialized the repository and created the first application files and folders.
- [x] Configured Vite, React 19, TypeScript with strict compiler settings, and Tailwind CSS v4.
- [x] Added shared global styling, local font setup, and the initial theme layer.
- [x] Established the main source structure: `api/`, `components/`, `context/`, `pages/`, `types/`, and `utils/`.
- [x] Centralized product, cart, user, checkout, order, and catalog models in `src/types/` as the application grew.

**Architecture decision:** keep API access, reusable interface elements, route-level views, shared state, models, and pure helper functions in separate modules. This makes the data flow easier to trace and lets page components focus on composing their UI.

### Phase 2 — Shared layout, navigation, and route structure

**Milestone dates: 2026-10-22 and 2026-10-31 · Complete**

- [x] Built shared Header and Footer components, then refined their desktop and mobile layouts.
- [x] Added React Router routes for the catalog, login, product details, cart, checkout, account, orders, wishlist, help pages, and order confirmation.
- [x] Added a common layout wrapper so pages share the site shell and route-level loading boundary.
- [x] Added protected-route handling for account and checkout flows, while keeping catalog, product details, and cart available to guests.
- [x] Added a not-found page for unmatched routes and invalid product IDs.
- [x] Added active navigation styling, a responsive mobile drawer, and later a mobile bottom navigation bar.

**Architecture decision:** route-level pages own each screen, while the shared layout owns persistent navigation and the footer. Protected-route logic is kept separate from page forms so redirect behavior is consistent.

### Phase 3 — Catalog, filters, and URL state

**Milestone dates: 2026-10-22 and 2026-11-06 · Complete**

- [x] Connected the catalog to DummyJSON through a typed product API service.
- [x] Added loading, error, retry, and empty-result states.
- [x] Implemented search with a **400 ms debounce**, category filtering, sorting, and pagination.
- [x] Synchronized `q`, `category`, `sort`, and `page` with URL search parameters so catalog views can be refreshed or shared.
- [x] Used `AbortController` to cancel outdated catalog requests when filters change or a newer query replaces an older one.
- [x] Added product cards with price, discount, rating, brand/category metadata, stock status, wishlist action, and product navigation.
- [x] Refined the search scroll behavior so search-parameter updates do not trigger the global route-change scroll reset.

**Architecture decision:** catalog state that should survive a refresh belongs in the URL; transient input state remains local until the debounce interval completes. API request lifecycle logic is extracted into the catalog hook.

### Phase 4 — Product details, stock, and reviews

**Milestone dates: 2026-10-22 and 2026-10-31 · Complete**

- [x] Added `/products/:id` with typed product lookup, loading/error handling, invalid-ID handling, price/discount details, brand/category, rating, review count, and stock status.
- [x] Added quantity controls that respect available stock, including quantities already held in other variants of the same product.
- [x] Added the add-to-cart action and feedback for stock limits.
- [x] Added product reviews and local review submission, plus related products from the same category.
- [x] Added a modular product image component and fallback behavior for unavailable images.
- [x] Added Quick View and stock-alert experiences as optional product enhancements.

**Architecture decision:** product details are split between page-level data loading and focused display components. Stock availability is read from shared inventory state rather than being independently calculated by each view.

### Phase 5 — Cart domain and totals

**Milestone dates: 2026-10-22 and 2026-11-06 · Complete**

- [x] Built `CartContext` to expose shared cart items, quantity changes, removal, clear-cart behavior, and the header item count.
- [x] Persisted cart state in `localStorage` and validate/normalize saved values during restoration.
- [x] Enforced stock limits across product variants and surfaced feedback rather than silently clamping user-entered quantities.
- [x] Added the `10X10` promo code and centralized subtotal, discount, and total calculations.
- [x] Added the `CartManager` class as an actively used domain object for cart operations, stock checks, promotion handling, counts, and totals.
- [x] Kept product and order display prices in standard USD formatting.

**Architecture decision:** React Context is the application boundary for cart state; `CartManager` owns domain operations, and utility functions own stateless formatting/calculation rules. Cart updates create new state values so React can render changes predictably.

### Phase 6 — Authentication and checkout

**Milestone dates: 2026-10-22, 2026-10-31, and 2026-11-06 · Complete**

- [x] Added controlled login and registration forms, shared form types, field validation, password confirmation, and password visibility controls.
- [x] Added local demo authentication state and protected routes. Registered passwords are stored as salted hashes; the demo is not server authentication.
- [x] Kept the cart public while requiring authentication for Checkout and account views.
- [x] Added a controlled checkout form with validation for name, email, address, and city.
- [x] Simulated order creation, saved the order locally, updated inventory, and showed the order-success page.
- [x] Added the guest checkout redirect to Login and restored the intended checkout route after successful demo login.
- [x] Added duplicate-submission protection and explicit messaging that the demo does not collect payment.

**Architecture decision:** authentication and checkout are demonstrations backed by browser state, not a production identity or payment system. The route guard controls access; the form is responsible for validating submitted values.

### Phase 7 — Full/bonus features, responsive refinement, and debugging evidence

**Milestone dates: 2026-10-22 through 2026-11-06 · Implemented subset complete**

- [x] Added toast notifications, persistent wishlist, order history, profile management, product reviews, related products, and saved addresses/cards/refund details.
- [x] Added a saved Light/Dark theme and Middle-earth realm selector. Store prices remain USD; the realm calculator is a separate conversion feature.
- [x] Added help/lore pages, stock alerts, Quick View, mobile account/settings navigation, the desktop QR prompt, and the Eagle Post/Council/Mithril Vault tools.
- [x] Reorganized larger page sections into reusable components and centralized shared types and helpers.
- [x] Added image optimizations, local font assets, and lazy-loaded route/modal/widget bundles to reduce initial loading work.
- [x] Recorded debugging examples and causes in [`DEBUG-LOG.md`](./DEBUG-LOG.md).
- [x] Prepared [`ISSUES.md`](./ISSUES.md) as a local issue-tracking backlog; its entries should not be described as public GitHub issues unless they are actually filed there.
- [x] Added a Playwright demo journey and generated the recording at [`docs/video/`](./docs/video/). The recorded flow covers catalog search/filtering, product details, cart, guest redirect, demo login, and local order success.

**Architecture decision:** optional large panels and route-level views are loaded on demand where practical. Persistent user-facing state belongs in its relevant Context or browser-storage utility; display-only state stays close to its component.

## Verification milestones

| Date | Verification | Result |
| --- | --- | --- |
| 2026-11-05 | Local Lighthouse mobile navigation audit | Saved report scored 89 Performance, 100 Accessibility, 100 Best Practices, and 92 SEO. This was a local production preview, not the deployed site; see [`docs/lighthouse/README.md`](./docs/lighthouse/README.md). |
| 2026-11-06 | Current-source typecheck and production build | `npm run typecheck` and `npm run build` pass. |
| 2026-11-06 | Playwright demo against the Vercel URL | One end-to-end journey passed and created a WebM recording. Browser/API availability can change; rerun the CLI command below to regenerate it. |

Run the end-to-end demo and record a fresh video with:

```powershell
npx playwright test e2e/demo-recording.spec.ts
```

The equivalent command works in PowerShell as well. Playwright writes video artifacts under `docs/video/` according to `playwright.config.ts`.

## Current scope and limitations

- Product data depends on DummyJSON and an internet connection.
- Accounts, cart, wishlist, profile, reviews, and orders use browser storage and are local to that browser.
- Authentication is simulated in the client; it is not a production-secure account system.
- Checkout is a local demonstration. No payment is collected and no order is sent to a fulfillment service.
- The saved Lighthouse report documents a local build. Repeat Lighthouse and route-refresh checks after deploying the exact source being evaluated.
- `ISSUES.md` is a local planning document; it is not proof of issues filed through the GitHub API.

## Completion snapshot

- [x] CORE storefront flow implemented.
- [x] Selected FULL and BONUS features implemented and refined.
- [x] Strict TypeScript check passes.
- [x] Production build passes.
- [x] Demo flow recorded with Playwright.
- [x] Development stages and current limitations documented here.
