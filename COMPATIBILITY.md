# Browser and Deployment Compatibility

## CORE route matrix

This matrix records the status of the Appendix A CORE checks. The Chrome checks were performed in Chrome DevTools responsive emulation; they are useful layout checks, not a substitute for physical-device testing.

| CORE route | Chrome desktop | Chrome 375px | Firefox desktop | Firefox 375px | Source review |
| --- | --- | --- | --- | --- | --- |
| Catalog (`/`) | Pass | Pass (375px) | Not run | Not run | Direct catalog page rendered; mobile header, hero and product view showed no visible horizontal overflow. |
| Login (`/login`) | Pass (required-field errors shown) | Not run | Not run | Not run | Empty submission showed the username and password validation messages. |
| Product (`/products/93`) | Not run | Pass (375px, direct route) | Not run | Not run | Direct local product route rendered with image and content; live nested route currently returns Vercel 404. |
| Cart (`/cart`) | Not run | Pass (375px, populated and empty states) | Not run | Not run | Product row, remove action, order summary and empty-state link rendered; test item removed after verification. |
| Checkout (`/checkout`) | Not run | Pass (375px, validation and persisted cart) | Not run | Not run | Order summary survived reload; submitting empty fields displayed inline errors for all four required fields. |
| Profile (`/profile`) | Not run | Pass (375px) | Not run | Not run | Profile view and horizontally scrollable section navigation stayed within the emulated viewport. |
| Not found (`*`) | Pass (wildcard and invalid product ID) | Not run | Not run | Not run | Unknown routes and a non-numeric product ID rendered the not-found view; invalid ID did not initiate a product lookup. |

The header was also inspected at 1025px: it uses the compact logo, bag, wishlist and menu layout; the floating widgets are hidden at that width.

## Deployment checks

| Check | Result |
| --- | --- |
| Vercel URL listed in README | Present; live catalog page loaded in Chrome. |
| Direct `/products/93` navigation | Failed: Vercel returned `404: NOT_FOUND`. A rewrite is now configured in `vercel.json`; the live deployment must be redeployed before this can be marked as passing. |
| Refresh on a deployed nested route | Not verified; the current direct route fails before refresh can be checked. |
| Compatibility screenshots under `docs/compat/` | Not present. |

Firefox verification, physical-device checks, and compatibility screenshots remain outstanding. A deployed build using the new `vercel.json` rewrite must also be checked at `/products/:id` before deployment routing can be marked as passing.
