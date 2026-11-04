# LOTR Shop Project Report

## Project overview

LOTR Shop (Middle-earth Market) is a responsive single-page storefront built with React 19, TypeScript, Vite, Tailwind CSS v4, React Router, and DummyJSON product data. The visual system uses Cinzel and Lora typography, a Middle-earth inspired palette, and persistent light/dark themes.

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
- **Release check:** The Vercel catalog loaded in Chrome, but direct `/products/93` navigation returned Vercel `404: NOT_FOUND`. Added `vercel.json` to rewrite SPA paths to `index.html`; this repository change must be deployed and the nested route rechecked before the release check passes.
- **Browser check:** Chrome responsive emulation was checked at 375px for catalog, product details, cart, checkout, and profile, and at 1025px for the header/widget layout. Login validation and invalid-route handling were also checked in Chrome. Firefox, physical-device checks, and compatibility screenshots remain outstanding; see [COMPATIBILITY.md](./COMPATIBILITY.md).

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
- Realm-based currency conversion and the Mithril Vault calculator.
- Light/dark theme toggle with saved preference.
- Global Eagle Post newsletter and Council support widgets.
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
- The Vercel demo URL is listed in the README. The live catalog is reachable, but the current deployment does not serve nested SPA routes directly; the new rewrite fix is pending deployment verification.
- Verification in this review: `npm run typecheck`, `npm run lint`, `npm run build`, and `git diff --check` completed successfully.
