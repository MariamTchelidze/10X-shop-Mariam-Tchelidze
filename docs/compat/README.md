# Browser compatibility evidence

This folder stores screenshots from browser checks. Each image is evidence for the named browser, viewport, route, and local/deployed target recorded in `COMPATIBILITY.md`; a screenshot does not by itself prove interaction behavior.

## Latest Chrome mobile capture

On 2026-11-06, the current source was opened in headless Chrome against the local Vite server with a 375 × 812 viewport. Overflow checks covered 24 app routes, including all core pages and help/corporate routes. Updated captures are available for the catalog, product 93, cart, checkout, profile, and login; `chrome-mobile-375-account-menu.png` shows the open account/settings drawer. Both document and body widths measured 375px on every checked route. The drawer measured 375 × 812 and set body scrolling to `hidden` while open. Profile and cart views used seeded local demo state. These captures document the local source and are not deployment evidence.

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
