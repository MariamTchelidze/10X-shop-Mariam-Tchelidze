# Browser and Deployment Compatibility

## CORE route matrix

The saved captures document the rendered views at 375px. A screenshot does not by itself verify form validation, navigation, direct-route loading, or refresh behavior.

| Route | Chrome mobile (375px) | Firefox mobile (375px) | Desktop / interaction notes |
| --- | --- | --- | --- |
| Catalog (`/`) | Screenshot saved | Screenshot saved | Chrome desktop/header was checked previously; no desktop screenshot. Firefox capture is a full-page image where some lazy-loaded product images are blank, so scroll and recapture after they load. |
| Login (`/login`) | Screenshot saved | Screenshot saved | Captures show the blank form; Firefox validation-on-submit is not evidenced. |
| Product (`/products/93`) | Screenshot saved | Screenshot saved | Product page rendered in Chrome on the deployment; see deployment checks below. Firefox capture shows a product page but not the address bar. |
| Cart (`/cart`) | Empty and populated screenshots saved | Populated screenshot saved | Firefox capture contains three cart items. |
| Checkout (`/checkout`) | Screenshot saved | Screenshot saved | Captures show the order summary; inline validation behavior is not evidenced by these screenshots. |
| Profile (`/profile`) | No valid 375px capture | Screenshot saved | `chrome-mobile-375-profile.png` is 1527px wide and shows the previous Middle-earth Market branding and floating widgets removed from the current source; it is not evidence for the current mobile layout. |
| Not found (`*`) | No screenshot saved | No screenshot saved | Chrome wildcard/invalid product-ID behavior was checked previously; no current visual evidence. |

### Screenshots in `docs/compat/`

Chrome:

- `chrome-mobile-375-catalog.png`
- `chrome-mobile-375-login.png`
- `chrome-mobile-375-product.png`
- `chrome-mobile-375-cart-empty.png`
- `chrome-mobile-375-checkout.png`
- `chrome-mobile-375-cart - items aadded.png` (populated cart; filename contains a typo)
- `chrome-mobile-375-profile.png` (1527px-wide capture of an older app version; replace with a current 375px Profile capture)

Firefox:

- `firefox-mobile-375-Catalog.png` (capitalization differs from the naming convention)
- `firefox-mobile-375-login.png`
- `firefox-mobile-375-product.png`
- `firefox-mobile-375-cart.png`
- `firefox-mobile-375-checkout.png`
- `firefox-mobile-375-profile.png`

There are no valid desktop screenshots for the current app in the folder. Capture desktop views and replace the stale Chrome Profile file with a current 375px capture. Re-capture the Firefox catalog after scrolling through the products so lazy-loaded images appear; capture Login and Checkout validation states if interaction evidence is required.

## Deployment checks

Canonical deployment URL from README: <https://treasures-of-middle-earth-git-main-mariam-tchelidze-s-projects.vercel.app/>.

| Check | Chrome | Firefox |
| --- | --- | --- |
| Open `/` | Pass; catalog rendered | Not verified on the live deployment |
| Reload `/` | Pass; catalog remained visible | Not verified on the live deployment |
| Open `/products/93` directly | Pass; product details rendered after API data loaded | Not verified on the live deployment |
| Reload `/products/93` | Pass; product details remained visible and URL stayed on `/products/93` | Not verified on the live deployment |

The Chrome checks were performed on 2026-11-05, before the latest local performance changes. Firefox screenshots do not include the browser address bar, so they do not establish the live URL or direct-route refresh behavior. The repository's `vercel.json` rewrites all paths to `/index.html`; after deploying the current local build, repeat the Chrome checks to confirm the deployed version matches the reviewed source.

## Lighthouse evidence

Saved `before` and `after` HTML/JSON reports are from a local production preview and record Performance 65→67, Accessibility 100, Best Practices 100, and SEO 83. A later Lighthouse screenshot shared in the conversation showed scores of 81/100/100/50, but the score panel is not saved with the project artifacts. `docs/lighthouse/after(iPhone 16).png` is a page capture, not a Lighthouse report. Save the latest audit report as HTML/JSON and record the URL, mode, viewport, and throttling before treating 81/100/100/50 as reproducible evidence. The saved local report does not establish deployed-site performance.
