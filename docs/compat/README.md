# Browser compatibility evidence

Save screenshots captured during manual CORE checks in this folder. The screenshots are evidence only after the named browser and viewport have actually been checked.

## File names

Use this pattern: `<browser>-<viewport>-<route>.png`.

Examples:

- `chrome-desktop-catalog.png`
- `chrome-mobile-375-product.png`
- `firefox-desktop-cart.png`
- `firefox-mobile-375-checkout.png`

Use short route names: `catalog`, `login`, `product`, `cart`, `checkout`, and `not-found`.

## Capture CORE screenshots

For each browser, capture the CORE routes listed in the root `COMPATIBILITY.md` at desktop width and at **375 × 812** mobile emulation. In Chrome, open DevTools and enable the Device Toolbar (`Ctrl+Shift+M`), then enter the viewport dimensions. In Firefox, open Responsive Design Mode (`Ctrl+Shift+M`) and enter the same dimensions. Capture the page with the browser screenshot tool or the operating system's screenshot utility and save the PNG here using the file-name pattern above.

Check the visible layout, horizontal overflow, route content, and any relevant interaction (for example, checkout validation). Record the browser version, viewport, result, and any issue/fix in `COMPATIBILITY.md`. Do not mark a check as passed until it has been observed in that browser.
