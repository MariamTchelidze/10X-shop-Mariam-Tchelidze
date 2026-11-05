# Browser and Deployment Compatibility

## CORE route matrix

The pass entries below are recorded from previous Chrome DevTools responsive checks. They have not all been repeated during the latest documentation/code update. Appendix A allows DevTools or Responsive Design Mode emulation; a physical phone is not required. A screenshot is evidence for the captured view, but does not by itself verify every interaction on that route.

| CORE route | Chrome desktop | Chrome 375px | Firefox desktop | Firefox 375px | Evidence / note |
| --- | --- | --- | --- | --- | --- |
| Catalog (`/`) | Pass (previous check) | Pass (screenshot saved) | Not verified | Not verified in repository | Mobile screenshot shows catalog and hero; scroll through the full catalog to verify lazy-loaded images. |
| Login (`/login`) | Pass (required-field check) | Screenshot saved; validation not rechecked at this size | Not verified | User shared a mobile capture in chat; not saved here | Screenshot shows the Login view, not a completed registration flow. |
| Product (`/products/93`) | Not run | Pass (direct local route; screenshot saved) | Not verified | Not verified | Local direct route was captured; deployed nested route remains unverified. |
| Cart (`/cart`) | Not run | Empty-state screenshot saved; populated state was previously checked | Not verified | Not verified | The saved image covers the empty state only. |
| Checkout (`/checkout`) | Not run | Pass (validation and persisted cart; previous check) | Not verified | Not verified | No route screenshot is currently saved. |
| Profile (`/profile`) | Not run | Pass (previous check) | Not verified | Not verified | No route screenshot is currently saved. |
| Not found (`*`) | Pass (wildcard and invalid product ID; previous check) | Not run | Not verified | Not verified | A non-numeric product ID was confirmed not to start an API request. |

### Screenshots currently saved in `docs/compat/`

- `chrome-mobile-375-catalog.png`
- `chrome-mobile-375-login.png`
- `chrome-mobile-375-product.png`
- `chrome-mobile-375-cart-empty.png`

These files document four Chrome mobile views. There are no desktop screenshots or Firefox screenshots saved in this folder. The Firefox catalog and sign-in-prompt captures supplied in chat are useful observations, but need to be captured after the latest fixes and saved here to count as repository evidence.

## Deployment checks

The canonical URL currently listed in README is `https://treasures-of-middle-earth-git-main-mariam-tchelidze-s-projects.vercel.app/`.

| Check | Latest result |
| --- | --- |
| Current README URL, `/` | The read-only web checker could not access this URL on 2026-11-05; it returned no page or HTTP status. Browser-visible result is therefore unknown. |
| Current README URL, `/products/93` | The read-only web checker could not access this URL on 2026-11-05; it returned no page or HTTP status. Browser-visible result is therefore unknown. |
| Refresh on the current deployed routes | Not verified. |
| SPA rewrite in repository | Present in `vercel.json`: all paths rewrite to `/index.html`. Production behavior still needs a browser check. |
| Earlier, different deployment URL | A previous check of `treasures-of-middle-earth-bsu8k7jch-mariam-tchelidze-s-projects.vercel.app` recorded a Vercel login page. That observation is for the earlier URL and does not establish the current README URL's behavior. |

The Windows browser-control tool stopped before inspecting Chrome or Firefox because it could not determine the active browser URL with enough confidence to enforce its URL policy. No login credentials or access settings were changed. Recheck the current README URL directly in Chrome and Firefox and record the visible page, then reload `/` and `/products/93`.

## Latest 375px screenshot audit

The Firefox screenshots shared in chat showed the hero controls competing with featured links and the sign-in prompt remaining open after selecting Register. The source changes separate the mobile hero controls and links and close the prompt when either navigation link is selected. The saved screenshots above predate those changes; a fresh Chrome and Firefox capture is still needed to verify the result.

The five hero images were converted from PNGs (about 14.4 MB combined) to JPEGs (about 2.0 MB combined), and the displayed logo was reduced from about 2.2 MB to about 164 KB. Catalog, product, cart, order, and quick-view images use asynchronous decoding and an accessible fallback on load failure. The live image/CDN behavior has not been confirmed in the current deployment.
