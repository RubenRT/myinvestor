# Development Process

This document describes the step-by-step development process followed to build the MyInvestor front-end.

## Phase 1: Analysis & Planning

### Backend Exploration
1. Read all server source files (`server/app.ts`, `server/data/funds.ts`, `server/utils.ts`) to understand:
   - All API endpoints, their request/response shapes, and validation rules
   - TypeScript types: `Fund`, `Amount`, `Profitability`, `Category`, `Currency`
   - Portfolio mutation behavior (in-memory, buy adds/increments, sell decrements/removes)
   - Sort implementation (whitelist of valid fields, nested dot notation for profitability)
   - Pagination logic (page/limit query params, totalPages calculation)

2. Analyzed the design reference screenshots to understand the expected UI:
   - Fund list: table with sortable columns and action menus
   - Portfolio: categorized list with fund names, values, gain/loss percentages
   - Portfolio actions: three-dot menu with sell/transfer options

3. Identified a key gap: the `/portfolio` endpoint returns `{ id, name, quantity, totalValue }` but does NOT include `category`. The front-end needs to cross-reference the fund list to enrich portfolio items with category data for the grouped view.

### Technology Selection
- Chose Vite over Create React App or Next.js -- no SSR needed, fastest dev experience
- Selected React Query over Redux Toolkit Query -- simpler API, better cache management
- Chose Zustand over Context API -- more ergonomic for global UI state, less boilerplate
- Zod v4 (latest) with @hookform/resolvers for type-safe form validation
- CSS Modules for scoped, pure CSS styling as requested

## Phase 2: Project Scaffold & Foundation

### Step 1: Initialize Project
- Scaffolded Vite + React + TypeScript project using `npm create vite@latest client -- --template react-ts`
- Configured Vite proxy: `/api/*` -> `http://localhost:3000/*` to avoid hardcoding the API URL

### Step 2: Install Dependencies
- Runtime: `react-router-dom`, `@tanstack/react-query`, `react-hook-form`, `@hookform/resolvers`, `zod`, `zustand`
- All dependencies are justified by their specific roles (routing, server state, forms, validation, UI state)

### Step 3: TypeScript Types
- Created `types/fund.ts`, `types/portfolio.ts`, `types/api.ts` mirroring server types
- Added `PortfolioItemEnriched` interface extending the API response with `category`, `unitValue`, and `gainPercent`

### Step 4: Service Layer
- Created `services/api.ts` with an `ApiClient` class providing typed `get<T>()` and `post<T>()` methods
- Created `services/funds.service.ts` with all fund-related API calls (getFunds, getFundById, buyFund, sellFund, transferFund)
- Created `services/portfolio.service.ts` for portfolio fetching
- All service functions are pure -- they accept parameters and return typed promises

### Step 5: Adapter Layer
- `adapters/fund.adapter.ts`: Converts profitability decimals to percentages, maps category codes to Spanish labels
- `adapters/portfolio.adapter.ts`: Enriches portfolio items with category from fund data, groups items by category with alphabetical sorting

### Step 6: Hooks Layer
- Query hooks: `useFunds` (paginated, sorted), `usePortfolio`, `useAllFunds` (for category enrichment)
- Mutation hooks: `useBuyFund`, `useSellFund`, `useTransferFund` -- each invalidates portfolio query on success and pushes notifications

### Step 7: Global Styles
- CSS custom properties for colors, spacing, typography, border radius, shadows
- CSS reset (box-sizing, margin/padding removal)
- Global `<dialog>` styling (border, border-radius, backdrop)
- Responsive breakpoints defined as comments for reference

## Phase 3: UI Components

### Reusable Components Built
1. **Button** - Variants: primary, secondary, danger, icon. Sizes: small, default.
2. **Modal** - Wraps native `<dialog>` with `showModal()`/`close()`. Accepts title, children, footer.
3. **CurrencyInput** - Number input with currency suffix label, error display, forwarded ref for react-hook-form.
4. **Pagination** - Smart page number rendering with ellipsis for large page counts.
5. **SortableHeader** - Clickable `<th>` that cycles through none/asc/desc, displays arrow indicator.
6. **ActionMenu** - Three-dot button with dropdown menu, closes on outside click.
7. **ToastContainer** - Renders notifications from Zustand store with slide-in animation.

### Design Decisions for Components
- All components use CSS Modules for style scoping
- Components accept the minimum necessary props
- No internal state duplication -- state is lifted to parent or URL params
- Accessibility: proper ARIA attributes (`role`, `aria-label`, `aria-sort`, `aria-expanded`, `aria-live`)

## Phase 4: Feature Pages

### Fund List Page
- Table with 8 sortable columns + actions column
- Sorting and pagination state stored in URL search params via `useSearchParams`
- `SortableHeader` cycles sort direction: none -> asc -> desc -> none
- Pagination resets to page 1 when sort changes
- Each row shows an ActionMenu with "Comprar" action
- Responsive: horizontal scroll wrapper on mobile

### Buy Fund Modal
- Triggered from fund list action menu
- Dynamic Zod schema: `createBuySchema(fundValue)` enforces `quantity * fundValue <= 10000`
- Live total calculation displayed as form is filled
- react-hook-form with `zodResolver` handles validation
- On success: resets form, closes modal, invalidates portfolio, shows toast

### Portfolio Page
- Three tabs: "Fondos" (active), "Ordenes" (empty state), "Traspasos en curso" (disabled)
- Portfolio items enriched with category by fetching all funds via `useAllFunds` hook
- Grouped by category using `CATEGORY_ORDER` for consistent ordering
- Alphabetically sorted within each group
- Empty state with link to fund list

### Sell Fund Modal
- Dynamic schema: `createSellSchema(maxQuantity)` limits to current holding
- Shows current position count for user reference
- On success: invalidates portfolio, shows toast

### Transfer Fund Modal
- Dynamic schema: `createTransferSchema(maxQuantity, fromFundId)` prevents self-transfer
- Destination dropdown only shows other funds currently in portfolio
- Source fund pre-selected and displayed as header info
- On success: invalidates portfolio, shows toast

## Phase 5: Validation Schemas

Created three Zod schema factories:
1. **Buy**: `quantity > 0`, `quantity * fundValue <= 10000`
2. **Sell**: `quantity > 0`, `quantity <= maxQuantity` (current holding)
3. **Transfer**: `quantity > 0`, `quantity <= maxQuantity`, `toFundId != fromFundId`, `toFundId` required

All schemas use Zod v4 syntax with `.refine()` for custom validation rules and Spanish error messages.

## Phase 6: Integration & Polish

### Notification System
- Zustand store with `addNotification(type, message)` and auto-dismiss after 4 seconds
- `ToastContainer` component with slide-in animation
- All mutation hooks push success/error notifications

### Responsive Design
- Mobile-first CSS with breakpoints at 768px
- Fund table: `overflow-x: auto` for horizontal scroll on small screens
- Navigation: compact spacing on mobile
- Portfolio items: adjust padding for mobile

### Build Verification
- TypeScript compilation: `tsc -b` passes with zero errors
- Vite production build: generates optimized bundle (~117KB gzip JS, ~3KB gzip CSS)
