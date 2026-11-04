# Browser and Deployment Compatibility

## CORE route matrix

This matrix records the status of the Appendix A CORE checks. The Chrome checks were performed in Chrome DevTools responsive emulation; they are useful layout checks, not a substitute for physical-device testing.

| CORE route | Chrome desktop | Chrome 375px | Firefox desktop | Firefox 375px | Source review |
| --- | --- | --- | --- | --- | --- |
| Catalog (`/`) | Pass | Pass (375px) | Not run | Not run | Direct catalog page rendered; mobile header, hero and product view showed no visible horizontal overflow. |
| Login (`/login`) | Not run | Not run | Not run | Not run | Controlled form and inline validation are present; runtime layout is unverified. |
| Product (`/products/93`) | Not run | Pass (375px, direct route) | Not run | Not run | Direct local product route rendered with image and content; live nested route currently returns Vercel 404. |
| Cart (`/cart`) | Not run | Not run | Not run | Not run | Public route, item controls, totals, and empty state are present; runtime layout is unverified. |
| Checkout (`/checkout`) | Not run | Not run | Not run | Not run | Protected controlled form and local order flow are present; runtime layout is unverified. |
| Profile (`/profile`) | Not run | Pass (375px) | Not run | Not run | Profile view and horizontally scrollable section navigation stayed within the emulated viewport. |
| Not found (`*`) | Not run | Not run | Not run | Not run | Shared not-found view is present; runtime layout is unverified. |

The header was also inspected at 1025px: it uses the compact logo, bag, wishlist and menu layout; the floating widgets are hidden at that width.

## Deployment checks

| Check | Result |
| --- | --- |
| Vercel URL listed in README | Present; live catalog page loaded in Chrome. |
| Direct `/products/93` navigation | Failed: Vercel returned `404: NOT_FOUND`. A rewrite is now configured in `vercel.json`; the live deployment must be redeployed before this can be marked as passing. |
| Refresh on a deployed nested route | Not verified; the current direct route fails before refresh can be checked. |
| Compatibility screenshots under `docs/compat/` | Not present. |

Firefox verification, the remaining route checks, and compatibility screenshots remain outstanding. A deployed build using the new `vercel.json` rewrite must also be checked at `/products/:id` before deployment routing can be marked as passing.
