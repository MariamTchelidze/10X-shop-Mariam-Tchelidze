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
- **Browser check:** Current Playwright 1.65.0 Chromium mobile audit passes 8 checks at 375 × 812 across Catalog, Product, Cart, Checkout, Profile, Login, Not Found, and the Account/Settings drawer. Current Chrome viewport captures are saved in `docs/compat/`. The Firefox Playwright project is configured, but its executable fails to launch on this Windows environment (`spawn UNKNOWN` / side-by-side configuration error); older Firefox captures are historical only. Current-version desktop captures and validation-state captures remain outstanding. Physical-device testing is not required when browser emulation is used.
- **Mobile and image follow-up:** The reported 375px hero overlap was addressed, auth prompt links now close the prompt while navigating, and image errors have an accessible fallback. The five original PNG hero assets (about 14.4 MB) were replaced by 1.17 MB of JPEG fallbacks plus responsive WebP variants; the logo now uses a 5.7 KB WebP source. Firefox mobile captures are saved; the full-page catalog capture contains blank lazy-loaded image areas, so it should be retaken after scrolling. Live CDN behavior is not verified.
- **Lighthouse evidence:** The latest saved Chrome Lighthouse 13.5.0 HTML/JSON report is for the local production preview. It records 89 / 100 / 100 / 92 (Performance / Accessibility / Best Practices / SEO), with LCP 3.5 s, TBT 140 ms, and CLS 0. That report predates the latest QR modal, card-field masking, and catalog URL changes; rerun Lighthouse against the current build before treating 89 as a current-source result. It does not verify the Vercel deployment. See [`docs/lighthouse/`](./docs/lighthouse/README.md).
- **FULL-flow regression coverage:** `npm test` now exercises catalog endpoint/query construction and sorting, missing product handling, promo normalization and totals, inventory labels, and simulated order-status transitions.
- **Performance work:** Hero images were resized to 1400 × 788 and recompressed, reducing the five JPEG fallback files from 2,059,174 bytes to 1,166,554 bytes (43.3%). Responsive WebP variants are available at 700 px and 1400 px; browsers select a suitable source through `srcset`. The header display logo has a 5.7 KB WebP source. The two locally hosted WOFF2 fonts total 63,692 bytes. Support widget panels, Quick View, and stock-alert modals are separate lazy-loaded chunks. The current local build's initial JS entry is 365.42 kB raw / 112.55 kB gzip; CSS is 56.14 kB / 10.54 kB gzip. The latest saved Lighthouse run scored 89, but it predates the latest source changes. LCP was 3.5 s in that earlier report, and it estimated 42 KiB of unused JavaScript and 243 KiB of image savings.

## Verification metrics

The latest saved Lighthouse run used Chrome Lighthouse 13.5.0 in Mobile / Navigation mode against the local production preview at `http://127.0.0.1:4173/?page=1`, not Vercel. The report is saved as [`after-modal-splitting.report.html`](./docs/lighthouse/after-modal-splitting.report.html) and [`after-modal-splitting.report.json`](./docs/lighthouse/after-modal-splitting.report.json). It was generated after the Quick View and stock-alert lazy-loading change, but before the latest QR modal, card-field masking, and catalog URL changes; its score is historical evidence, not a measurement of the exact current build.

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
| Initial JavaScript entry chunk | 416.06 kB raw / 121.24 kB gzip (before route splitting) | 365.42 kB raw / 112.55 kB gzip (current local build) | Current entry is 50.64 kB raw / 8.69 kB gzip smaller than the pre-route-splitting entry; UI routes and modals still use separate chunks |
| Main CSS chunk | — | 56.14 kB raw / 10.54 kB gzip | Current local Vite production build; stylesheet is still render-blocking |
| Git commits / distinct commit dates | — | 71 commits / 5 dates | `git rev-list --count HEAD` and distinct `git log --format=%cs` values on 2026-11-06; the FULL process target calls for 15 dates |
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

## 3 Challenging Technical Problems Solved

1. **Keeping catalog state in the URL.** Search, category, sorting, and pagination are synchronized with `useSearchParams`, so a refreshed or shared URL restores the same catalog view. Search uses a debounce; selecting a category clears the search; invalid and conflicting parameters are normalized; and page one is represented without an unnecessary `page=1` query parameter. Product-page navigation also retains the catalog URL so returning from a product can restore the filters.
2. **Managing asynchronous API requests safely.** Catalog, product-detail, and related-product requests use `AbortController` and check the abort signal before updating React state. This prevents an older request from overwriting newer results after route or filter changes. Loading, error, retry, and not-found states are handled separately so API failures do not appear as missing products.
3. **Separating store prices from realm exchange estimates.** Realm selection and multiplier rates are shared through `RealmContext` for the Mithril Vault calculator, while catalog, cart, checkout, and order prices use the shared `formatPrice()` USD formatter. This keeps exchange estimates available without letting a selected realm silently change the amount charged or shown for a product.

## AI Usage Summary

AI assistance was used during development to discuss the application structure, divide larger pages and features into focused components, draft and refine typed React implementations, and review error handling and responsive behavior. It also helped investigate issues by tracing state and API flows and suggesting verification steps. AI-generated suggestions were checked against the project requirements and the repository; the application was verified with the documented typecheck, lint, test, and production-build commands. AI was used as a development aid, not as a substitute for reviewing or understanding the submitted code.

## Routes

The app includes the catalog (`/`), login (`/login`), product details (`/products/:id`), cart (`/cart`), checkout (`/checkout`), profile (`/profile`), orders (`/orders`), order confirmation (`/order-success`), wishlist (`/wishlist`), help center (`/help-center`), footer help/about routes, and a not-found route. Checkout and account/order views are protected by the local authentication state.

## Verification

- `npm run typecheck` — passes with strict TypeScript settings.
- `npm test` — all six regression tests pass.
- `npm run lint` — passes.
- `npm run build` — passes; Vite generated the optimized production assets in `dist/`.
- `git diff --check` — passes; only Git line-ending notices were printed.
- Local production preview — `/` and `/products/93` returned the SPA HTML; `robots.txt`, local fonts, and the optimized hero image returned their expected content types. The Lighthouse report cited above is a separate automated mobile audit; it does not replace desktop/browser compatibility checks.
- Current mobile layout suite — `playwright test e2e/mobile-compat.spec.ts --project=chromium` passed all 8 checks at 375 × 812. Firefox was attempted but its executable failed before navigation, including after reinstall, so Firefox is not marked passed.

## Scope and limitations

- The catalog depends on the DummyJSON API and an internet connection.
- User accounts, cart, orders, profile information, wishlist, reviews, and preferences use browser `localStorage`; data is local to that browser and is not a secure production backend. Registered passwords are stored as salted PBKDF2 hashes, while the CORE demo login still accepts any username with a password of at least six characters.
- Checkout is simulated. No payment processor, real order fulfillment, or live carrier tracking is connected.
- The Vercel demo URL is listed in the README, but its current availability and direct nested-route behavior could not be verified from this review environment. The repository's SPA rewrite is present; production behavior must be checked in a browser.
- Verification in this review: `npm run typecheck`, `npm run lint`, `npm run build`, and `git diff --check` completed successfully.

## Final review notes (2026-11-06)

- Current local verification: `npm test` passes all six regression tests; `npm run typecheck`, `npm run lint`, `npm run build`, and `git diff --check` pass. The production build reports a 365.42 kB raw / 112.55 kB gzip initial JavaScript entry and 56.14 kB raw / 10.54 kB gzip CSS entry.
- The catalog's first-page URL normalization is a local source change in `src/pages/CatalogPage/CatalogPage.tsx`; it is uncommitted and is not part of the current Vercel deployment until committed and deployed.
- The latest responsive adjustment shortens the mobile hero and places Catalog search/category controls in two columns, with sorting below them. Current Chromium tests confirm the controls clear the fixed bottom bar and all checked routes fit 375px without horizontal overflow.
- CORE browser evidence remains incomplete for the exact current source: desktop screenshots are absent, Firefox could not be launched in the Playwright environment, and Firefox live deployment/refresh behavior is unverified. Existing Firefox images are historical. The prior Chrome live route check predates recent changes. See [COMPATIBILITY.md](./COMPATIBILITY.md). Browser emulation is accepted by Appendix A; a physical phone is not required.
- `PLAN.md` was first committed on 2026-10-31, after the first source commit on 2026-10-22. Appendix A asks for the plan in week one before feature code; the repository cannot retroactively prove that timing.
- Selected FULL flows are implemented, but the complete FULL checklist is not: Formik/Yup are not used, the FULL Git-history target of 40 commits across 15 dates is not met (the current local history has 71 commits across 5 dates), and a current deployed Lighthouse run is not saved. The latest saved local Lighthouse score of 89 predates the latest source changes.
- Appendix A's final-report section also asks for a first-person reflection (“what I would do differently”) and a 5–6 line AI-use summary. Those personal sections still need the student's own account; the existing DEBUG-LOG records three implementation issues and fixes.
