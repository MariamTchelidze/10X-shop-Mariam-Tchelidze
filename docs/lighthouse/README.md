# Lighthouse Reports

## Latest saved run

- Date: 2026-11-05
- Tool: Chrome DevTools Lighthouse 13.5.0
- Mode: Navigation, Mobile; Performance, Accessibility, Best Practices, SEO
- URL: `http://127.0.0.1:4173/?page=1` — local production preview, not the Vercel deployment.
- Full report: [`after-modal-splitting.report.html`](./after-modal-splitting.report.html) and [`after-modal-splitting.report.json`](./after-modal-splitting.report.json).

| Metric | Earlier run | Current local run | Change |
| --- | ---: | ---: | ---: |
| Performance | 65 | 89 | +24; above the FULL target of 85 in this local run |
| Accessibility | 100 | 100 | Maintained |
| Best Practices | 100 | 100 | Maintained |
| SEO | 83 | 92 | +9 |
| First Contentful Paint | 2.2 s | 1.5 s | 0.7 s faster |
| Largest Contentful Paint | 7.4 s | 3.5 s | 3.9 s faster, but still above 2.5 s |
| Speed Index | 5.3 s | 1.6 s | 3.7 s faster |
| Total Blocking Time | 250 ms | 140 ms | 110 ms lower |
| Cumulative Layout Shift | 0.010 | 0 | Lower |

This is a saved local report, not a Vercel result. Lighthouse results vary by run and device. The score exceeds the target in this run; it does not prove that the deployed site reaches 85. The report still estimates 42 KiB of unused JavaScript and 243 KiB of image savings.

## Optimizations in the current source

- Five hero JPEG fallbacks were resized to 1400 × 788 and recompressed, reducing their combined size from 2,059,174 to 1,166,554 bytes (43.3%). Responsive WebP variants are available at 700 px and 1400 px; the browser selects a source through `srcset`.
- The header uses a 5.7 KB WebP logo source with a JPEG fallback. The favicon remains PNG.
- Cinzel and Lora WOFF2 fonts are hosted locally and preloaded; the external Google Fonts stylesheet request was removed.
- Support widget panels, Quick View, and stock-alert modals are on-demand chunks.
- Current build initial JS entry: 341.63 kB raw / 104.31 kB gzip. CSS entry: 52.10 kB raw / 10.03 kB gzip.
- The hero has explicit dimensions, responsive sources, and a high-priority preload. The saved audit reports CLS 0.
- Lighthouse still reports an estimated 150 ms of render-blocking savings. The stylesheet remains blocking; inlining or asynchronously applying the full generated CSS was not introduced because it risks a flash of unstyled content and complicates no-JavaScript fallback. Revisit only with a measurable, regression-safe approach.

## Earlier reports

- [`before.html`](./before.html) and [`after.html`](./after.html): earlier Chrome Lighthouse reports.
- [`before.json`](./before.json) and [`after.json`](./after.json): machine-readable data for those runs.
- [`before.jpg`](./before.jpg) and [`after.jpg`](./after.jpg): page captures from the earlier report set.
- [`after-optimized.report.html`](./after-optimized.report.html) and [`after-optimized.report.json`](./after-optimized.report.json): the 81-point intermediate report before Quick View and stock-alert splitting.
- `after(iPhone 16).png` is a page capture, not a Lighthouse report.

## Limitations and next check

The saved reports use a local production build and do not verify current Vercel behavior, production routing, or image CDN delivery. After deploying current source, rerun Lighthouse against the public URL and save its HTML/JSON separately. The FULL target of 85 is met by the latest local run, but the production deployment still needs measurement.
