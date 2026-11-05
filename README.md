

# 10X Shop — Treasures of Middle-earth

### A Market Beyond the Shire

An editorial fantasy storefront for curious travelers, artifact collectors, and all who journey beyond the Shire.

[**Explore the live Vercel demo →**](https://treasures-of-middle-earth-git-main-mariam-tchelidze-s-projects.vercel.app/?page=1)


---

## About the project

**10X Shop — Treasures of Middle-earth** is a responsive single-page shopping experience built as an individual graduation project. It pairs the required 10X Shop brand with a Middle-earth inspired visual identity, product catalog, shopping flow, and account area.

Product catalog data comes from the [DummyJSON Products API](https://dummyjson.com/). This is a front-end demo: account state and many saved features live in browser storage, and checkout does not collect payment or arrange real delivery.

## Key features

### Shopping experience

- Mobile-first layout with a responsive header, full-height burger menu, and quick access to the bag and wishlist.
- Catalog search, category filters, sorting, and pagination synchronized with the URL.
- Product details with stock status, variant selection, related items, and local reviews.
- Product quick view and quick-add actions.
- Persistent bag with quantity controls, order totals, and the `10X10` promo code.
- Checkout form and local order confirmation flow.

### Middle-earth interface

- **The Shire** light theme and **Mordor** dark theme, with a saved theme preference.
- Cinzel display typography and Lora-inspired editorial styling.
- Realm and currency selector with realm-specific conversion rates.
- Responsive floating tools on desktop, with their actions available from the mobile menu.

### Accounts and saved items

- Login and registration forms with required-field validation.
- Password confirmation during registration and show/hide controls for password fields.
- Profile sections for personal settings, addresses, purchases, refunds, and saved card references.
- Persistent wishlist, order history, cart, and selected preferences.

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

- Node.js 20 or newer
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

**[treasures-of-middle-earth — Live demo](https://treasures-of-middle-earth-git-main-mariam-tchelidze-s-projects.vercel.app/?page=1)**

The application uses `BrowserRouter`; deployments should serve `index.html` as the fallback for client-side routes.
