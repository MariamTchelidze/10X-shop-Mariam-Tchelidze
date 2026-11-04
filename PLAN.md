# LOTR Shop Project Plan

## Goal and scope

Complete the required CORE storefront flow first, then implement FULL and BONUS enhancements. The CORE flow is complete; the additional features listed in [REPORT.md](./REPORT.md) have since been added.

## Three-week milestones

| Week | Dates | Milestones | Status |
| --- | --- | --- | --- |
| 1 | Oct 17–23, 2026 | Configure Vite, React 19, strict TypeScript, Tailwind CSS v4, and routing; define shared types; build the shared layout, login, and initial catalog. | Complete |
| 2 | Oct 24–30, 2026 | Implement product details, shared cart state, cart quantity/removal/totals, controlled checkout, and local order confirmation. | Complete |
| 3 | Oct 31–Nov 6, 2026 | Finish responsive states and error/empty flows; verify typecheck and production build; finalize project docs; prepare hosting with SPA route fallback. | Code checks and docs complete; verify the published URL and direct-route fallback externally |

## CORE work breakdown and risks

| Epic | Estimate | Week | Definition of done |
| --- | ---: | --- | --- |
| Auth and shared layout | 5 h | 1 | Shared Header/Footer routes render; Login updates AuthContext; protected Checkout redirects back after login. |
| Catalog and product details | 7 h | 1–2 | Typed API data renders in cards; details route handles loading, errors, missing IDs, and add-to-cart. |
| Cart and checkout | 8 h | 2 | Cart quantity, removal, clearing, and totals update; controlled Checkout validates and confirms an order. |
| Responsive and quality pass | 5 h | 3 | CORE routes fit 375px; typecheck, lint, build, and error handling complete. |
| Documentation and release | 3 h | 3 | README, PLAN, REPORT, and DEBUG-LOG are present; deployment URL and SPA fallback are checked. |

| Risk | Mitigation |
| --- | --- |
| DummyJSON is unavailable or slow | Show a clear loading/error state and allow the user to retry the request. |
| Browser storage is unavailable or full | Catch storage failures and show an inline Checkout error instead of pretending the order was saved. |
| Nested routes fail after a production refresh | Configure the host to serve `index.html` as the SPA fallback and verify a direct product-route refresh. |

## CORE definition of done

- Routes work for `/`, `/login`, `/products/:id`, `/cart`, `/checkout`, and `*`, with a shared layout and protected checkout redirect.
- Catalog and product details load typed DummyJSON data and present loading, error, and empty states.
- Login and checkout use controlled forms with basic validation. Authentication is simulated locally; checkout is a local confirmation with no real payment.
- Products can be added to the shared cart; quantity, removal, badge, and totals stay in sync.
- Pages use responsive layouts and Tailwind utilities for mobile and desktop breakpoints.
- `npm run typecheck` and `npm run build` succeed.
- README, PLAN, and REPORT document setup, scope, status, and limitations.

## Additional scope

After CORE completion, the project added URL-synced catalog filtering, wishlist, reviews, related products, promo codes, profile and order history, theme and realm selection, stock alerts, quick view, support widgets, and footer/help pages. See [REPORT.md](./REPORT.md) for the complete feature summary.

## Remaining release check

The README contains the Vercel demo URL. Confirm that the deployment is reachable and that refreshing a nested route returns the SPA entry point; live hosting behavior cannot be established by the local build alone.
