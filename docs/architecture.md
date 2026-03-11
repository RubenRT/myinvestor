# Architecture & Technical Decisions

## Tech Stack

| Technology | Purpose | Justification |
|------------|---------|---------------|
| **Vite + React + TypeScript** | Build tool & framework | Fast dev server, native ESM, excellent TS support. Vite chosen over CRA/Next.js for simplicity since no SSR is needed. |
| **React Router v7** | Client-side routing | Industry standard. Supports URL-driven state for pagination/sorting via `useSearchParams`. |
| **TanStack React Query** | Server state management | Handles caching, background refetching, mutation invalidation. Eliminates manual loading/error state management. Avoids duplicating server data in client stores. |
| **React Hook Form + Zod** | Forms & validation | react-hook-form provides uncontrolled form performance. Zod schemas are composable and type-safe. The `@hookform/resolvers` package bridges both cleanly. |
| **Zustand** | UI state management | Lightweight store for toast notifications. Only used for client-side UI state -- server state lives in React Query. |
| **CSS Modules** | Styling | Pure CSS as requested, scoped per component via CSS Modules. No runtime overhead. CSS custom properties for theming consistency. |

## Project Structure

```
client/src/
  types/          -- TypeScript interfaces mirroring API shapes
  services/       -- API client layer (thin fetch wrappers)
  adapters/       -- Transform API responses to UI-friendly models
  hooks/          -- React Query hooks (queries + mutations)
  stores/         -- Zustand stores (UI state only)
  validation/     -- Zod schemas for form validation
  components/
    ui/           -- Reusable, generic UI components
    funds/        -- Fund listing feature components
    portfolio/    -- Portfolio feature components
  utils/          -- Format helpers, constants
  styles/         -- Global CSS, CSS custom properties
```

### Layer Responsibilities

1. **Services** (`services/`): Pure API calls. No business logic, no transformations. Return raw API response types. Use a shared `ApiClient` class for consistent error handling.

2. **Adapters** (`adapters/`): Transform API data at the boundary. Fund adapter converts profitability decimals (0.05) to display percentages (5.00%). Portfolio adapter enriches items with category data by cross-referencing the fund list (since `/portfolio` endpoint omits category).

3. **Hooks** (`hooks/`): React Query wrappers. Query hooks specify query keys for cache management. Mutation hooks handle invalidation and integrate with the notification store for user feedback.

4. **Components** (`components/`): UI rendering. Split into `ui/` (reusable) and feature directories (`funds/`, `portfolio/`). Each component gets its own directory with `.tsx` and `.module.css` files.

## Key Architecture Decisions

### 1. Vite Proxy Instead of Direct API URL

The Vite dev server proxies `/api/*` requests to `http://localhost:3000/*`. This approach:
- Avoids CORS issues during development
- Keeps the API URL configuration in one place (`vite.config.ts`)
- Makes the base URL (`/api`) deployment-friendly

### 2. React Query as Single Source of Truth for Server State

All server data lives in React Query's cache. Zustand is deliberately NOT used for server data. This prevents the common anti-pattern of syncing server state between a client store and the server.

After mutations (buy/sell/transfer), we invalidate the relevant query keys rather than manually updating local state. This guarantees consistency with the server.

### 3. URL-Driven Pagination and Sorting

Fund list pagination and sorting are stored in URL search params (`?page=2&sort=name:asc`) using React Router's `useSearchParams`. Benefits:
- State survives page refresh
- URLs are shareable/bookmarkable
- Browser back/forward navigation works naturally
- No Zustand/useState needed for this state

### 4. Native HTML `<dialog>` for Modals

The Modal component wraps the native `<dialog>` element with `showModal()`/`close()`. Benefits:
- Built-in backdrop, focus trapping, and Escape key handling
- Semantic HTML -- accessible by default
- No third-party modal library needed
- Matches the bonus requirement from the task spec

### 5. Adapter Pattern for API Boundaries

Adapters transform API data at the boundary between services and UI:

- **Fund adapter**: Converts profitability from decimals (0.05) to percentages (5.00), maps category codes (`MONEY_MARKET`) to Spanish labels (`Mercado monetario`).
- **Portfolio adapter**: Enriches portfolio items with category information by cross-referencing the full fund list (since the API's `/portfolio` endpoint only returns `{ id, name, quantity, totalValue }` without `category`). Groups items by category for the categorized view.

### 6. Dynamic Zod Schemas with Closures

Validation schemas are created dynamically via factory functions (e.g., `createBuySchema(fundValue)`) rather than being static. This allows:
- Buy validation: compute max quantity based on fund's unit value (`quantity * fundValue <= 10000`)
- Sell validation: limit based on current holding quantity
- Transfer validation: exclude source fund from destination options

### 7. Component Composition Pattern

Each feature is composed of focused, single-responsibility components:

```
FundList (page) -> FundRow (row rendering) -> ActionMenu (interaction)
                -> SortableHeader (sort control)
                -> Pagination (page navigation)
                -> BuyFundModal (buy dialog)

Portfolio (page) -> PortfolioGroup (category section) -> PortfolioItem (position row)
                                                      -> ActionMenu
                 -> SellFundModal (sell dialog)
                 -> TransferFundModal (transfer dialog)
```

### 8. Notification Store with Auto-Dismiss

Zustand store manages toast notifications with auto-dismissal after 4 seconds. Mutation hooks (buy/sell/transfer) push success/error notifications through the store. The `ToastContainer` component renders them with slide-in animation.

## Responsive Strategy

- **Mobile-first** approach using CSS custom properties and media queries
- Fund table: horizontal scroll on mobile (via `overflow-x: auto` wrapper)
- Portfolio: stacks vertically on mobile
- Navigation: compact on mobile, full on desktop
- Breakpoints: 768px (mobile/tablet), 1024px (tablet/desktop)

## Error Handling Strategy

- **API errors**: Caught in the `ApiClient` class, thrown as `Error` with the server's error message
- **Query errors**: React Query handles retry logic (1 retry configured)
- **Mutation errors**: Displayed via toast notifications through the Zustand notification store
- **Form errors**: Displayed inline below fields via react-hook-form's error state
