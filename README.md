

# 10X Shop — Treasures of Middle-earth

### A Market Beyond the Shire

An editorial fantasy storefront for curious travelers, artifact collectors, and all who journey beyond the Shire.

[**Explore the live Vercel demo →**](https://treasures-of-middle-earth-git-main-mariam-tchelidze-s-projects.vercel.app/)


---

## About the project

**10X Shop — Treasures of Middle-earth** is a responsive single-page shopping experience built as an individual graduation project. It pairs the required 10X Shop brand with a Middle-earth inspired visual identity, product catalog, shopping flow, and account area.

Product catalog data comes from the [DummyJSON Products API](https://dummyjson.com/). This is a front-end demo: account state and many saved features live in browser storage, and checkout does not collect payment or arrange real delivery.

## Key features

### CORE requirements

- Product catalog loaded from DummyJSON with loading, error, and empty states.
- Product details with price, brand/category, rating, stock status, quantity controls, and add-to-cart action.
- Public cart with quantity updates, removal, subtotal, and total.
- Controlled login and checkout forms; checkout is protected and ends in a local order confirmation.
- Shared responsive layout and mobile-first product grid.

### FULL requirements implemented

- URL-synchronized catalog search, category filters, sorting, and pagination.
- Profile and order-history sections, persistent wishlist, and product reviews/related products.
- Cart promo code (`10X10`) and local inventory updates after checkout.
- Light/dark themes with saved preference and realm-based currency exchange calculator.
- Quick view, stock-alert flow, desktop QR prompt, and responsive account/settings drawer with Eagle Post and Council tools.

These FULL items are the implemented subset; the project does not claim every Appendix A FULL item is complete. The **Mithril Vault** is an exchange calculator; storefront product and order prices remain standard USD.

> **Demo security note:** Authentication and profile data are simulated in the browser with `localStorage`. This is not production-secure authentication or a backend account system. Do not enter real passwords, payment details, or sensitive personal information. Checkout is simulated and no payment is processed.

## Tech stack

| Technology | Role |
| --- | --- |
| React 19 | Component-based UI |
| TypeScript | Strictly typed application code |
| Vite | Development server and production bundler |
| Tailwind CSS v4 | Responsive styling and theme utilities |
| React Router 7 | Client-side routing |
| DummyJSON | Product catalog API |

## Getting started

### Prerequisites

- Node.js 20 or newer for the Vite app (Node.js 22.15 or newer for `npm test`, which uses Node's built-in TypeScript loader)
- npm
- Git

### Install and run locally

```bash
git clone https://github.com/MariamTchelidze/10X-shop-ReactJS-project.git
cd 10X-shop-ReactJS-project
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

### Type-check and build

```bash
npm run typecheck
npm test
npm run build
```

The optimized production output is written to `dist/`. To serve that build locally:

```bash
npm run preview
```

## Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run typecheck` | Run the strict TypeScript project check. |
| `npm test` | Run the built-in Node tests for catalog requests, promo totals, stock labels, and order status. |
| `npm run build` | Type-check and generate the production bundle. |
| `npm run preview` | Preview the generated production bundle. |
| `npm run lint` | Run ESLint. |

## Project structure

```text
src/
├── api/          # DummyJSON API services
├── components/   # Reusable UI, header, widgets, and product components
├── context/      # Authentication, cart, inventory, realms, notifications, and app state
├── hooks/        # Shared React hooks
├── pages/        # Route-level pages and page-specific components
├── types/        # Shared TypeScript models
└── utils/        # Formatting, storage, and product helpers
```

## Architecture and data flow

The route-level pages compose reusable UI components, while Context providers hold shared authentication, cart, inventory, wishlist, realm, and notification state. A page requests catalog data through the typed DummyJSON API service; loading, error, and empty states are rendered by the page. User actions call handlers that update React state immutably, and the cart is synchronized to browser storage so its badge and totals stay consistent across the app. Checkout is guarded by the local authentication state and creates a local demo order without contacting a payment service.

## Demo account and credits

- **Demo login:** `emilys` / `emilyspass`. The local demo also accepts any non-empty username with a password of at least six characters on a fresh browser profile.
- **Author:** Mariam Tchelidze.
- **Development assistance:** OpenAI Codex was used for implementation support and code review; all changes were reviewed against the project requirements.
- **Product data:** [DummyJSON](https://dummyjson.com/).

## Main routes

`/` catalog · `/products/:id` product details · `/cart` bag · `/wishlist` wishlist · `/checkout` checkout · `/login` sign in/register · `/profile` account · `/orders` order history · `/help-center` help and lore

## Deployment

The live Vercel deployment is available here:

**[treasures-of-middle-earth — Live demo](https://treasures-of-middle-earth-git-main-mariam-tchelidze-s-projects.vercel.app/)**

The application uses `BrowserRouter`; deployments should serve `index.html` as the fallback for client-side routes.

## Browser verification

Appendix A requires browser compatibility checks and screenshot evidence. These checks are performed manually in Chrome and Firefox using desktop viewports and browser device emulation at **375 × 812**; a physical phone is not required. Check the catalog, product details, cart, checkout, profile, and not-found routes, then record the browser/version, viewport, URL, result, and any issue in [`COMPATIBILITY.md`](COMPATIBILITY.md). Save screenshots in [`docs/compat/`](docs/compat/README.md). Local checks do not prove the deployed Vercel version; verify direct route loading and refresh on the live URL separately.
