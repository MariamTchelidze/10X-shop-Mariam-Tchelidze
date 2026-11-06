# Browser compatibility evidence

This folder stores screenshots from browser checks. Each image is evidence for the named browser, viewport, route, and local/deployed target recorded in `COMPATIBILITY.md`; a screenshot does not by itself prove interaction behavior.

## Latest Chrome mobile capture

On 2026-11-06, Playwright 1.65.0 checked the current source in Chromium at 375 × 812 against the local Vite server. DummyJSON responses and local account/cart data were seeded. Eight checks passed across Catalog, Product 93, Cart, Checkout, Profile, Login, Not Found, and the open Account/Settings drawer. The suite checked document/body overflow on each page, that catalog filters clear the fixed bottom navigation, and that the drawer measures 375 × 812 while locking background scrolling. The current viewport captures use the `chrome-mobile-375-*.png` names. They document local layout, not deployment behavior.

The same suite is configured for Firefox, but the Playwright Firefox executable could not start in this Windows environment (`spawn UNKNOWN` / side-by-side configuration error), so the existing Firefox captures are historical and do not verify the current source.

## File names

Use this pattern: `<browser>-<viewport>-<route>.png`.

Examples:

- `chrome-desktop-catalog.png`
- `chrome-mobile-375-product.png`
- `firefox-desktop-cart.png`
- `firefox-mobile-375-checkout.png`

Use short route names: `catalog`, `login`, `product`, `cart`, `checkout`, `profile`, and `not-found`.

## Manual capture checklist

Use Chrome and Firefox, recording desktop and **375 × 812** mobile-emulation checks separately. Capture the catalog, product, cart, checkout, profile, and not-found routes. Name each file with the pattern above, and record browser version, target URL, viewport, refresh/navigation result, and remaining issues in [`COMPATIBILITY.md`](../../COMPATIBILITY.md). Verify direct `/products/93` loading and refresh as a separate behavior from the screenshot.
