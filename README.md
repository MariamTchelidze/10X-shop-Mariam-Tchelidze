# LOTR Shop — Middle-earth Market

A responsive fantasy editorial storefront built as an individual graduation project. The shop uses DummyJSON for product catalog data and browser storage to demonstrate account, cart, order, and personalization flows.

## Live demo

**Not deployed yet.** The repository currently has no configured hosting URL. [View the source repository](https://github.com/MariamTchelidze/10X-shop-ReactJS-project), or follow the steps below to run the app locally and preview its production build. See [deployment notes](#deployment).

## Tech stack

- React 19 and TypeScript (strict mode)
- Vite 6
- Tailwind CSS v4 with the Vite plugin
- React Router 7
- DummyJSON Products API
- Browser `localStorage` for demo state

## Requirements

- Node.js 20 or newer
- npm

## Setup and run

```sh
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run typecheck` | Run strict TypeScript checks. |
| `npm run build` | Type-check and create an optimized production bundle in `dist/`. |
| `npm run preview` | Serve the production bundle locally for review. |
| `npm run lint` | Run ESLint. |

## Features

- Product catalog with URL-synced search, category, sort, and pagination controls
- Product detail, related items, reviews, and quick view
- Local demo registration and sign-in, protected account and checkout flows
- Persistent cart, wishlist, order history, and profile sections
- Promo code support, inventory updates, and stock alert requests
- Light and dark Middle-earth themes, realm currency selector, and floating support tools
- Responsive layout, help center, and footer information pages

See [REPORT.md](./REPORT.md) for the CORE/FULL/BONUS implementation summary and known limitations. The three-week milestone plan is in [PLAN.md](./PLAN.md).

## Deployment

Build and inspect the production output locally:

```sh
npm run build
npm run preview
```

The app uses `BrowserRouter`. When deploying to a static host, configure its SPA fallback so direct requests to routes such as `/products/:id`, `/profile`, and `/checkout` serve `index.html`. Once a hosting target is published, replace the live-demo status at the top of this README with its public URL.

## Demo data and privacy

Product data is fetched from DummyJSON. Authentication, orders, saved profile data, cart contents, wishlist items, and several feature preferences are client-side demonstrations stored in the browser; they are not a production account service. Checkout does not collect payment or dispatch real goods. Use fictional information while exploring the app.
