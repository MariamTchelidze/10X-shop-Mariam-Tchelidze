# Browser compatibility evidence

The Playwright CORE smoke suite saves viewport screenshots from real browser runs here. The captured image is evidence for the named browser, viewport, and local/deployed target recorded in `COMPATIBILITY.md`.

## File names

Use this pattern: `<browser>-<viewport>-<route>.png`.

Examples:

- `chrome-desktop-catalog.png`
- `chrome-mobile-375-product.png`
- `firefox-desktop-cart.png`
- `firefox-mobile-375-checkout.png`

Use short route names: `catalog`, `login`, `product`, `cart`, `checkout`, `profile`, and `not-found`.

## Automated capture

Install the browser dependencies once, then run `npm run test:e2e`. The suite uses the local production preview and writes desktop and 375 × 812 screenshots for the tested routes. Use `PLAYWRIGHT_BASE_URL` to check a deployed build. Details and the current Firefox runtime limitation are documented in [`docs/testing/playwright.md`](../testing/playwright.md).

The latest successful automated evidence in this folder is from Chrome desktop and Chrome 375 × 812. Existing Firefox captures predate this Playwright run and are not current automated evidence. When `PLAYWRIGHT_BASE_URL` is set, captures go to `docs/compat/deployed/` so they do not overwrite local-build screenshots.

The tests also check route content, mobile horizontal overflow, direct product navigation/refresh, the public cart, guest checkout redirection, and the desktop-only QR prompt. Record the browser version, target URL, viewport, result, and any remaining issues in `COMPATIBILITY.md`. A screenshot alone does not establish a behavior that the test did not check.
