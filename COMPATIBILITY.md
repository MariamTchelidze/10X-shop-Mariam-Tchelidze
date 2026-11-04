# Browser and Deployment Compatibility

## CORE route matrix

This matrix records the status of the Appendix A CORE checks. This audit used only the repository and Appendix A; no browser or deployment was opened, so source code is not treated as proof of rendered behavior.

| CORE route | Chrome desktop | Chrome 375px | Firefox desktop | Firefox 375px | Source review |
| --- | --- | --- | --- | --- | --- |
| Catalog (`/`) | Not run | Not run | Not run | Not run | Responsive grid and typed API flow are present; runtime layout is unverified. |
| Login (`/login`) | Not run | Not run | Not run | Not run | Controlled form and inline validation are present; runtime layout is unverified. |
| Product (`/products/:id`) | Not run | Not run | Not run | Not run | ID validation, fetch, stock, and cart actions are present; runtime layout is unverified. |
| Cart (`/cart`) | Not run | Not run | Not run | Not run | Public route, item controls, totals, and empty state are present; runtime layout is unverified. |
| Checkout (`/checkout`) | Not run | Not run | Not run | Not run | Protected controlled form and local order flow are present; runtime layout is unverified. |
| Not found (`*`) | Not run | Not run | Not run | Not run | Shared not-found view is present; runtime layout is unverified. |

## Deployment checks

| Check | Result |
| --- | --- |
| Vercel URL listed in README | Present; reachability was not checked. |
| Direct `/products/1` navigation and refresh | Not verified. |
| Compatibility screenshots under `docs/compat/` | Not present. |

The Appendix A CORE cross-browser and 375px checks remain outstanding. A real Chrome and Firefox run at desktop and 375px, plus deployment route-refresh verification, is required before these rows can be marked as passing.
