# Browser and Deployment Compatibility

## Current Playwright mobile audit (2026-11-06)

`e2e/mobile-compat.spec.ts` checks a 375 × 812 viewport in the configured Playwright `chromium` and `firefox` projects. It visits Catalog, Product 93, Cart, Checkout, Profile, Login, and Not Found; checks horizontal overflow; and verifies that the Account/Settings drawer fills the viewport and disables background scrolling. The catalog test also checks that its filters are not covered by the fixed bottom navigation. DummyJSON responses and local demo account/cart state are seeded, so this is a repeatable local layout check rather than a live API or deployment test.

| Browser project | Result | Evidence |
| --- | --- | --- |
| Chromium (Playwright 1.65.0) | **9 passed** after the mobile layout and login validation fixes | The eight current 375 × 812 route/drawer captures use `chrome-mobile-375-{catalog,product,cart,checkout,profile,login,not-found,account-menu}.png`; an additional demo-login check verifies redirect and persisted session. |
| Firefox (Playwright 1.65.0) | **Could not launch** | All 8 tests stop before page navigation with `browserType.launch: spawn UNKNOWN`; the Playwright Firefox executable fails with a Windows side-by-side configuration error. A forced reinstall of the pinned Firefox build did not resolve it. |

Firefox images already in this folder are historical captures from 2026-11-05; they are not evidence for the current source. Current-source Firefox layout remains unverified until the browser can launch or a manual Firefox run is recorded.

## Recorded local CORE checks

On 2026-11-06, a Playwright smoke run against a local production build (`vite build` + `vite preview`) passed in Chrome at desktop (1440 × 900) and mobile viewport emulation (375 × 812):

| Check | Chrome desktop | Chrome 375 × 812 |
| --- | --- | --- |
| Catalog loads and has no horizontal overflow | Pass | Pass |
| Product `/products/93` opens directly and remains on that URL after reload | Pass | Pass |
| Public cart opens for a guest | Pass | Pass |
| Guest checkout redirects to `/login` | Pass | Pass |
| Checkout and profile render with seeded demo state | Pass | Pass |
| Invalid product ID renders not-found | Pass | Pass |
| Desktop QR prompt opens; mobile viewport does not mount it | Pass | Pass |

The historical Chrome run completed with 4 tests passed. Its captures remain in [`docs/compat/`](docs/compat/README.md). These are local build captures, not proof of the deployed version.

## Latest Chrome mobile layout audit

On 2026-11-06, the current source was rendered in headless Chrome against the local Vite server at 375 × 812. All 24 application routes checked—including Catalog, `/products/93`, Cart, Checkout, Profile, Orders, Wishlist, Help Center, help/corporate pages, Login, and Not Found—measured `documentElement.scrollWidth === 375` and `body.scrollWidth === 375`; no horizontal overflow was observed. The Account/Settings drawer measured 375 × 812 and set `document.body.style.overflow` to `hidden`. The refreshed screenshots, including the open drawer, are listed in [`docs/compat/README.md`](docs/compat/README.md). Profile and cart were opened with seeded local demo state. This was a local viewport/layout check, not a full interaction regression suite or a deployed-site check.

### Firefox status

The current Playwright Firefox project is configured, but its pinned Windows executable cannot start (`side-by-side configuration is incorrect`, surfaced as `spawn UNKNOWN`). The current-source Firefox suite therefore did not reach the app. Existing Firefox screenshots are historical visual evidence only; complete and record a current Firefox run before claiming cross-browser coverage.

## Deployment checks

Canonical deployment URL from README: <https://treasures-of-middle-earth-git-main-mariam-tchelidze-s-projects.vercel.app/>.

The historical Chrome automation used a local production preview. The previous manual Chrome deployment check (2026-11-05) confirmed `/`, `/products/93`, and refresh behavior for the deployed version available then. Re-run the deployment checks after the latest changes are deployed; Firefox deployment behavior remains unverified.

## Lighthouse evidence

Saved before/after HTML and JSON reports are from a local production preview and record Performance 65→67, Accessibility 100, Best Practices 100, and SEO 83. The later Lighthouse screenshot shared in the conversation showed scores of 81/100/100/50, but the score panel is not saved as a reproducible report. The saved local report does not establish deployed-site performance. See [`docs/lighthouse/README.md`](docs/lighthouse/README.md).
