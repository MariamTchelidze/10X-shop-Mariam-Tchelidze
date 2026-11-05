# 10X Shop — Treasures of Middle-earth Project Report

## Project overview

10X Shop — Treasures of Middle-earth is a responsive single-page storefront built with React 19, TypeScript, Vite, Tailwind CSS v4, React Router, and DummyJSON product data. The visual system uses locally hosted Cinzel and Lora variable fonts, a Middle-earth inspired palette, and persistent light/dark themes.

## CORE requirements

| Area | Implementation |
| --- | --- |
| Application foundation | Vite + React + TypeScript, strict compiler settings, Tailwind CSS v4, shared header/footer layout, and client-side routes. |
| Catalog | Typed product API calls, responsive product grid, and clear loading/error/empty states. |
| Product details | Product lookup by route ID, pricing and stock status, quantity controls, and add-to-cart actions. |
| Authentication | Controlled login/registration forms, local account state, and protected checkout/account routes. This is a browser-side demo, not server authentication. |
| Cart | Shared persistent cart state, quantity updates, removal, totals, and header quantity badge. |
| Checkout | Protected, validated checkout form and local order simulation with order confirmation. No payment is collected. |
| Responsive design | Mobile-first layouts and responsive Tailwind utilities across catalog, product, cart, checkout, and account views. |

## Planned versus delivered

- **Delivered:** Shared SPA layout and routes, demo Login, public catalog/product/cart flow, protected Checkout, validated local order confirmation, cart clearing, and common not-found/error handling.
- **Delivered:** CORE responsive header navigation, including direct Catalog and Cart links in the mobile drawer, plus a confirmation before clearing a populated cart.
- **Evidence:** `npm run typecheck`, `npm run lint`, and `npm run build` pass; known debugging examples are recorded in [DEBUG-LOG.md](./DEBUG-LOG.md).
- **Release check:** The README Vercel deployment was checked in Chrome on 2026-11-05: `/` loaded and remained visible after reload; `/products/93` opened directly and remained on the product page after reload. That check predates the latest local performance changes, so repeat it after deploying the current source. Firefox live-route and refresh checks remain unverified; see [COMPATIBILITY.md](./COMPATIBILITY.md).
- **Browser check:** Chrome and Firefox 375px captures cover Catalog, Login, Product, Cart, and Checkout; Firefox also has a Profile capture. The Chrome file named Profile is a 1527px-wide capture of an earlier version with old branding and removed floating widgets, so it does not verify the current 375px Profile layout. Current-version desktop captures and validation-state captures are also outstanding. Physical-device testing is not required when browser emulation is used.
- **Mobile and image follow-up:** The reported 375px hero overlap was addressed, auth prompt links now close the prompt while navigating, and image errors have an accessible fallback. The five original PNG hero assets (about 14.4 MB) were replaced by 1.17 MB of JPEG fallbacks plus responsive WebP variants; the logo now uses a 5.7 KB WebP source. Firefox mobile captures are saved; the full-page catalog capture contains blank lazy-loaded image areas, so it should be retaken after scrolling. Live CDN behavior is not verified.
- **Lighthouse evidence:** A current Chrome Lighthouse 13.5.0 HTML/JSON report is saved for the local production preview. It records 89 / 100 / 100 / 92 (Performance / Accessibility / Best Practices / SEO), with LCP 3.5 s, TBT 140 ms, and CLS 0. The local Performance score exceeds the FULL target of 85; the report does not verify the Vercel deployment. See [`docs/lighthouse/`](./docs/lighthouse/README.md).
- **FULL-flow regression coverage:** `npm test` now exercises catalog endpoint/query construction and sorting, missing product handling, promo normalization and totals, inventory labels, and simulated order-status transitions.
- **Performance work:** Hero images were resized to 1400 × 788 and recompressed, reducing the five JPEG fallback files from 2,059,174 bytes to 1,166,554 bytes (43.3%). Responsive WebP variants are available at 700 px and 1400 px; browsers select a suitable source through `srcset`. The header display logo has a 5.7 KB WebP source. The two locally hosted WOFF2 fonts total 63,692 bytes. Support widget panels, Quick View, and stock-alert modals are separate lazy-loaded chunks. The current local build's initial JS entry is 341.63 kB raw / 104.31 kB gzip; CSS is 52.10 kB / 10.03 kB gzip. The latest local Lighthouse score is 89, above the 85 target. LCP remains 3.5 s, and the report still estimates 42 KiB of unused JavaScript and 243 KiB of image savings.

## Verification metrics

The latest saved Lighthouse run used Chrome Lighthouse 13.5.0 in Mobile / Navigation mode against the local production preview at `http://127.0.0.1:4173/?page=1`, not Vercel. The current report is saved as [`after-modal-splitting.report.html`](./docs/lighthouse/after-modal-splitting.report.html) and [`after-modal-splitting.report.json`](./docs/lighthouse/after-modal-splitting.report.json). It was generated after the Quick View and stock-alert lazy-loading change and corresponds to the current source build.

| Metric | Before | After / current | Change or note |
| --- | ---: | ---: | --- |
| Lighthouse Performance | 65 | 89 | +24; exceeds the FULL target of 85 on the local preview |
| Lighthouse Accessibility | 100 | 100 | Maintained |
| Lighthouse Best Practices | 100 | 100 | Maintained |
| Lighthouse SEO | 83 | 92 | +9 |
| First Contentful Paint | 2.2 s | 1.5 s | 0.7 s faster |
| Largest Contentful Paint | 7.4 s | 3.5 s | 3.9 s faster; still above the 2.5 s good threshold |
| Speed Index | 5.3 s | 1.6 s | 3.7 s faster |
| Total Blocking Time | 250 ms | 140 ms | 110 ms lower |
| Cumulative Layout Shift | 0.010 | 0 | Reduced to zero in this run |
| Initial JavaScript entry chunk | 416.06 kB raw / 121.24 kB gzip (before route splitting) | 341.63 kB raw / 104.31 kB gzip (current build after modal splitting) | Current build is 74.43 kB raw / 16.93 kB gzip smaller; modal UI loads on demand |
| Main CSS chunk | — | 52.10 kB raw / 10.03 kB gzip | Current local Vite production build; stylesheet is still render-blocking |
| Git commits | — | 61 | `git rev-list --count HEAD` on 2026-11-05 |
| Pull requests / issues | — | Not measured | Not collected from the remote project board |
| Development hours | — | Not tracked | No verified time log in the repository |

## FULL features implemented

- URL-synced catalog search, category filtering, sorting, and pagination.
- Cart promo code (`10X10`), persisted with the cart and included in checkout/order totals.
- Order detail pages with reorder action and a simulated order-status timeline.
- Shared error boundary, common not-found page, and scroll-to-top behavior on route changes.
- Profile action to clear saved cart, orders, and product reviews while keeping the account and theme.
- Six dependency-free regression checks for the catalog API, promo calculations, inventory labels, and order-status timeline (`npm test`).

## BONUS features implemented

- Persistent wishlist page and product-card favorite controls.
- Order history and profile sections for personal information, addresses, purchases, refunds, and saved card references.
- Product reviews stored locally per product and related products on product pages.
- Inventory updates after checkout, out-of-stock Mithril alerts, and product quick view with variant selection.
- Realm-based currency conversion.
- Light/dark theme toggle with saved preference.
- Help center, individual footer information routes, and Middle-earth editorial branding.

## Routes

The app includes the catalog (`/`), login (`/login`), product details (`/products/:id`), cart (`/cart`), checkout (`/checkout`), profile (`/profile`), orders (`/orders`), order confirmation (`/order-success`), wishlist (`/wishlist`), help center (`/help-center`), footer help/about routes, and a not-found route. Checkout and account/order views are protected by the local authentication state.

## Verification

- `npm run typecheck` — passes with strict TypeScript settings.
- `npm test` — all six regression tests pass.
- `npm run lint` — passes.
- `npm run build` — passes; Vite generated the optimized production assets in `dist/`.
- `git diff --check` — passes; only Git line-ending notices were printed.
- Local production preview — `/` and `/products/93` returned the SPA HTML; `robots.txt`, local fonts, and the optimized hero image returned their expected content types. The Lighthouse report cited above is a separate automated mobile audit; it does not replace desktop/browser compatibility checks.

## Scope and limitations

- The catalog depends on the DummyJSON API and an internet connection.
- User accounts, cart, orders, profile information, wishlist, reviews, and preferences use browser `localStorage`; data is local to that browser and is not a secure production backend. Registered passwords are stored as salted PBKDF2 hashes, while the CORE demo login still accepts any username with a password of at least six characters.
- Checkout is simulated. No payment processor, real order fulfillment, or live carrier tracking is connected.
- The Vercel demo URL is listed in the README, but its current availability and direct nested-route behavior could not be verified from this review environment. The repository's SPA rewrite is present; production behavior must be checked in a browser.
- Verification in this review: `npm run typecheck`, `npm run lint`, `npm run build`, and `git diff --check` completed successfully.
