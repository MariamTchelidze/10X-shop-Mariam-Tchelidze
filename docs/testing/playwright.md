# Playwright browser checks

Playwright is configured separately from the existing `npm test` Node suite. It launches the Vite production preview, runs the browser checks, stores traces/screenshots for failures in `test-results/`, creates an HTML report in `playwright-report/`, and saves compatibility screenshots under `docs/compat/`.

## First-time setup

```bash
npm install
npx playwright install firefox
```

The Chrome project uses the machine's installed Google Chrome (`channel: "chrome"`). Playwright downloads its Firefox build; it does not automate the separate Firefox installation as if it were a manual browser session.

## Run checks

```bash
npm run typecheck:e2e
npm run test:e2e
npm run test:e2e:chrome
npm run test:e2e:firefox
npm run test:e2e -- --project=chrome-mobile-375
npm run test:e2e:ui
npm run test:e2e:report
```

The four configured projects are Chrome desktop, Firefox desktop, Chrome 375 × 812, and Firefox 375 × 812. The suite covers the catalog, direct `/products/93` navigation and reload, public cart, guest checkout redirect, seeded checkout/profile views, not-found behavior, and QR modal viewport behavior. It captures route screenshots in `docs/compat/` after the corresponding browser flow runs.

To use the deployed site rather than building locally, set `PLAYWRIGHT_BASE_URL` to the deployment URL before invoking Playwright. This disables the local `webServer` and targets that URL; browser screenshots and test results should be recorded as deployed-site evidence separately from local captures.

## Firefox on Windows in this environment

The Playwright Firefox package installed successfully, but its bundled executable could not start. Windows reported a SideBySide event (ID 33): dependent assembly `mozglue`, version `1.0.0.0`, could not be found; Playwright surfaces this as `spawn UNKNOWN`. This is a browser-runtime startup failure, not a failed application assertion. The system Firefox installation also cannot be substituted because Playwright needs its automation-enabled Firefox build. Check the Windows Application log for the SideBySide event and reinstall the Playwright Firefox runtime; if it persists, preserve the event details when troubleshooting with Playwright/Windows support:

```powershell
npx playwright install firefox
npm run test:e2e -- --project=firefox-desktop --grep "cart remains public"
```

Do not mark Firefox as passed until the Playwright run finishes successfully; manual Firefox screenshots remain useful visual evidence but do not replace route automation. In this workspace, Chrome tests passed and Firefox remains blocked at process startup.

## Scope

These browser tests are smoke and layout checks, not a complete regression suite. They verify the built local app and selected CORE navigation rules. The application still reads DummyJSON over the network, so API availability can affect product content and screenshot completeness. A local passing run does not verify the Vercel deployment; set `PLAYWRIGHT_BASE_URL` or repeat the specified direct-route and refresh checks after deployment.
