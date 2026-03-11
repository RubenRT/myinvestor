# MyInvestor - Front-end Challenge

React front-end application for the MyInvestor investment fund management platform. Consumes the provided Express REST API to display funds, manage a portfolio, and execute buy/sell/transfer operations.

## How to Run

### Prerequisites
- Node.js >= 24.5.0

### Start the API server

```bash
# From the project root
npm start
# or
yarn start
```

The API runs on `http://localhost:3000`.

### Start the front-end

```bash
cd client
npm install
npm run dev
```

The front-end runs on `http://localhost:5173`. API calls are proxied to port 3000 automatically.

### Production build

```bash
cd client
npm run build
npm run preview
```

## Features Implemented

### Fund Listing (`/`)
- Paginated table displaying 80 funds (10 per page)
- Sortable columns: name, currency, category, value, YTD, 1Y, 3Y, 5Y profitability
- Sort state persisted in URL query parameters (`?page=2&sort=name:asc`)
- Action menu per fund with "Buy" option
- Responsive: horizontal scroll on mobile

### Buy Fund
- Modal dialog using native HTML `<dialog>` element
- Form validation with react-hook-form + Zod:
  - Quantity must be positive
  - Total value cannot exceed 10,000 EUR
- Live total calculation preview
- Currency input with EUR suffix
- Success/error toast notifications

### Portfolio (`/portfolio`)
- Positions grouped by fund category (Mercado monetario, Global, Tecnologia, Salud)
- Alphabetically sorted within each category
- Shows total value and gain/loss percentage per position
- Tabs: "Fondos" (active), "Ordenes" (placeholder), "Traspasos en curso" (placeholder)
- Empty state with link to fund explorer

### Sell Fund
- Modal with form validation:
  - Quantity must be positive
  - Cannot sell more than current holdings
- Shows current position for reference
- Success/error toast notifications

### Transfer Fund
- Transfer between portfolio positions
- Destination restricted to funds already in portfolio
- Form validation:
  - Quantity must be positive
  - Cannot transfer more than current holdings
  - Cannot transfer to the same fund
- Success/error toast notifications

## Technical Decisions

| Decision | Rationale |
|----------|-----------|
| **Vite** | Fast dev server, no SSR needed, native ESM support |
| **React Query** | Server state management with caching, background refetching, mutation invalidation |
| **Zustand** | Lightweight UI state (notifications only). Server state lives in React Query exclusively |
| **React Hook Form + Zod** | Performant uncontrolled forms with type-safe validation schemas |
| **CSS Modules** | Scoped styles, pure CSS as requested, no runtime cost |
| **URL search params** | Pagination/sorting state survives refresh, is shareable, works with browser navigation |
| **Native `<dialog>`** | Semantic HTML, built-in accessibility (focus trap, Escape key, backdrop) |
| **Adapter pattern** | Transforms API data at boundaries, keeps components clean |
| **Vite proxy** | Clean API URLs (`/api/funds`), avoids CORS config, deployment-friendly |

## Project Structure

```
client/src/
  types/          -- TypeScript interfaces
  services/       -- API client and endpoint calls
  adapters/       -- API response transformations
  hooks/          -- React Query hooks (queries + mutations)
  stores/         -- Zustand stores (UI state)
  validation/     -- Zod form validation schemas
  components/
    ui/           -- Reusable: Button, Modal, CurrencyInput, Pagination, etc.
    funds/        -- Fund list page, buy modal
    portfolio/    -- Portfolio page, sell/transfer modals
  utils/          -- Format helpers, constants
  styles/         -- Global CSS, CSS custom properties
```

See [docs/](../docs/) for detailed architecture documentation.

## What I Would Improve With More Time

- **Tests**: Unit tests with Vitest + Testing Library for components, hooks, and adapters. E2E tests with Playwright for critical flows (buy/sell/transfer).
- **Error boundaries**: React error boundary components for graceful error recovery.
- **Loading states**: Skeleton screens instead of text-based loading indicators.
- **Mobile swipe actions**: Swipe-to-reveal sell/transfer actions on portfolio items.
- **Order history**: Functional "Ordenes" tab tracking buy/sell/transfer history.
- **Search & filtering**: Filter funds by category, search by name.
- **Dark mode**: CSS custom properties already in place, just need alternate values.
- **Accessibility audit**: Full WCAG compliance review with screen reader testing.
- **Performance**: Virtual scrolling for the fund list if dealing with larger datasets.
- **Internationalization**: i18n setup for multi-language support.
