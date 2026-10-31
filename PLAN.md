# LOTR Shop Project Plan

## Goal and scope

Complete the required CORE storefront flow first, then implement FULL and BONUS enhancements. The CORE flow is complete; the additional features listed in [REPORT.md](./REPORT.md) have since been added.

## Three-week milestones

| Week | Dates | Milestones | Status |
| --- | --- | --- | --- |
| 1 | Oct 17–23, 2026 | Configure Vite, React 19, strict TypeScript, Tailwind CSS v4, and routing; define shared types; build the shared layout, login, and initial catalog. | Complete |
| 2 | Oct 24–30, 2026 | Implement product details, shared cart state, cart quantity/removal/totals, controlled checkout, and local order confirmation. | Complete |
| 3 | Oct 31–Nov 6, 2026 | Finish responsive states and error/empty flows; verify typecheck and production build; finalize project docs; prepare hosting with SPA route fallback. | Build and typecheck complete; deployment pending |

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

## Remaining release task

Publish the production build to a hosting provider, configure SPA fallback for direct route refreshes, then add the public URL to the README. No live deployment URL is currently configured in this repository.
