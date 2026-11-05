# 10X Shop — Treasures of Middle-earth Project Report

## Project overview

10X Shop — Treasures of Middle-earth is a responsive single-page storefront built with React 19, TypeScript, Vite, Tailwind CSS v4, React Router, and DummyJSON product data. The visual system uses Cinzel and Lora typography, a Middle-earth inspired palette, and persistent light/dark themes.

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
- **Release check:** The `vercel.json` SPA rewrite is present on `main`. The current README URL could not be accessed by the read-only web checker during the 2026-11-05 review, so the deployed root, nested route, and refresh behavior remain unknown. A previous SSO observation referred to a different deployment URL; see [COMPATIBILITY.md](./COMPATIBILITY.md).
- **Browser check:** Previous Chrome responsive checks recorded 375px coverage for catalog, product details, cart, checkout, and profile, plus a 1025px header check. Four Chrome 375px screenshots are now present in `docs/compat/` (catalog, login, product, and empty cart). Firefox screenshots and a complete saved route matrix are still outstanding. Physical-device testing is not required when browser emulation is used; see [COMPATIBILITY.md](./COMPATIBILITY.md).
- **Mobile and image follow-up:** The reported 375px hero overlap was addressed, auth prompt links now close the prompt while navigating, and image errors have an accessible fallback. Hero image delivery was reduced from about 14.4 MB of PNGs to about 2.0 MB of JPEGs; the displayed header logo was reduced from 2.2 MB to 164 KB. Post-change Firefox screenshots and remote CDN behavior are not yet verified.
- **Lighthouse evidence:** A Chrome Lighthouse 13.5.0 Mobile navigation audit was recorded on the local production preview before and after preloading the first hero image. The metric table below records the measured changes. These reports do not verify the deployed Vercel site; see [`docs/lighthouse/`](./docs/lighthouse/README.md).

## Verification metrics

The Lighthouse runs used the local production preview at `http://127.0.0.1:4173/?page=1`, not Vercel. The production build below was generated locally on 2026-11-05.

| Metric | Before | After / current | Change or note |
| --- | ---: | ---: | --- |
| Lighthouse Performance | 65 | 67 | +2; below the Appendix A FULL target of 85 |
| Lighthouse Accessibility | 100 | 100 | No change |
| Lighthouse Best Practices | 100 | 100 | No change |
| Lighthouse SEO | 83 | 83 | No change |
| First Contentful Paint | 2.2 s | 2.2 s | No change |
| Largest Contentful Paint | 7.4 s | 7.1 s | 0.3 s faster |
| Speed Index | 5.3 s | 2.5 s | 2.8 s faster |
| Total Blocking Time | 250 ms | 330 ms | 80 ms slower |
| Cumulative Layout Shift | 0.010 | 0.009 | 0.001 lower |
| Main JavaScript bundle | — | 416.06 kB raw / 121.24 kB gzip | Local Vite production build |
| Git commits | — | 61 | `git rev-list --count HEAD` on 2026-11-05 |
| Pull requests / issues | — | Not measured | Not collected from the remote project board |
| Development hours | — | Not tracked | No verified time log in the repository |

## FULL features implemented

- URL-synced catalog search, category filtering, sorting, and pagination.
- Cart promo code (`10X10`), persisted with the cart and included in checkout/order totals.
- Order detail pages with reorder action and a simulated order-status timeline.
- Shared error boundary, common not-found page, and scroll-to-top behavior on route changes.
- Profile action to clear saved cart, orders, and product reviews while keeping the account and theme.

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
- `npm run build` — passes; Vite generated the optimized production assets in `dist/`.

## Scope and limitations

- The catalog depends on the DummyJSON API and an internet connection.
- User accounts, cart, orders, profile information, wishlist, reviews, and preferences use browser `localStorage`; data is local to that browser and is not a secure production backend. Registered passwords are stored as salted PBKDF2 hashes, while the CORE demo login still accepts any username with a password of at least six characters.
- Checkout is simulated. No payment processor, real order fulfillment, or live carrier tracking is connected.
- The Vercel demo URL is listed in the README, but its current availability and direct nested-route behavior could not be verified from this review environment. The repository's SPA rewrite is present; production behavior must be checked in a browser.
- Verification in this review: `npm run typecheck`, `npm run lint`, `npm run build`, and `git diff --check` completed successfully.
