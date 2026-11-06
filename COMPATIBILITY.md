# Browser and Deployment Compatibility

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

The historical Chrome run completed with 4 tests passed. Its captures remain in [`docs/compat/`](docs/compat/README.md). Playwright has since been removed from the project; this records the earlier run only and is not a repeatable test command in the current repository. These are local build captures, not proof of the deployed version.

### Firefox status

The earlier Playwright Firefox 159.0 executable could not start in the Windows environment (`side-by-side configuration is incorrect`, surfaced as `spawn UNKNOWN`), so that automated Firefox run did not complete. The Firefox screenshots in `docs/compat/` are visual evidence only; they do not prove every route or interaction. Complete and record manual Firefox checks for the current source before claiming cross-browser coverage.

## Deployment checks

Canonical deployment URL from README: <https://treasures-of-middle-earth-git-main-mariam-tchelidze-s-projects.vercel.app/>.

The historical Chrome automation used a local production preview. The previous manual Chrome deployment check (2026-11-05) confirmed `/`, `/products/93`, and refresh behavior for the deployed version available then. Re-run the deployment checks after the latest changes are deployed; Firefox deployment behavior remains unverified.

## Lighthouse evidence

Saved before/after HTML and JSON reports are from a local production preview and record Performance 65→67, Accessibility 100, Best Practices 100, and SEO 83. The later Lighthouse screenshot shared in the conversation showed scores of 81/100/100/50, but the score panel is not saved as a reproducible report. The saved local report does not establish deployed-site performance. See [`docs/lighthouse/README.md`](docs/lighthouse/README.md).
