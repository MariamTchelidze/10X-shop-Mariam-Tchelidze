# Browser compatibility evidence

This folder stores screenshots from manual browser checks. Each image is evidence for the named browser, viewport, route, and local/deployed target recorded in `COMPATIBILITY.md`; a screenshot does not by itself prove interaction behavior.

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
