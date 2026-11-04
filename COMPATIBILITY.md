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
| Vercel URL listed in README | Present. After pushing the current `main` commit, both the root and nested route redirected to Vercel SSO login instead of returning the app shell. |
| Direct `/products/93` navigation | Inconclusive: Vercel returned its login page, so the SPA response and the `vercel.json` rewrite could not be inspected anonymously. |
| Refresh on a deployed nested route | Inconclusive for the same Vercel SSO redirect; repeated direct requests returned the login page. |
| Compatibility screenshots under `docs/compat/` | Not present. |

Firefox verification, physical-device checks, and compatibility screenshots remain outstanding. The Firefox window was present, but the Windows browser-control policy stopped further UI inspection because it could not enforce the current browser URL policy. The user-facing Vercel deployment is protected by SSO, so its SPA rewrite must be retested from an allowed public URL or after its access configuration is made testable. No credentials or security controls were bypassed.
