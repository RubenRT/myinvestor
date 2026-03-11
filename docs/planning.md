# Planning

## Initial Analysis

The challenge provides an Express 5 + TypeScript REST API with 80 investment funds stored in-memory. The task is to build a React front-end implementing: fund listing, buy action, portfolio detail, sell action, and transfer action -- in that priority order.

## Task Breakdown

### Priority 1: Fund Listing
- Paginated table displaying fund data (name, symbol, category, value, profitability)
- Sortable columns via clickable headers
- Action menu per row
- Responsive design with horizontal scroll on mobile

### Priority 2: Buy Fund Action
- Modal dialog using native HTML `<dialog>` element
- Form with react-hook-form + Zod validation
- Constraints: quantity > 0, total value <= 10,000 EUR
- Currency-formatted input component
- Live total calculation preview

### Priority 3: Portfolio Detail
- View portfolio positions grouped by fund category
- Tabs: "Fondos" (functional), "Ordenes", "Traspasos en curso" (placeholders)
- Alphabetical sorting within each category group
- Display: fund name, total value, gain/loss percentage

### Priority 4: Sell Fund Action
- Modal with form validation
- Constraints: quantity > 0, quantity <= current position
- Triggered from portfolio item action menu

### Priority 5: Transfer Fund Action
- Modal with source fund pre-selected
- Destination dropdown restricted to funds already in portfolio
- Constraints: quantity > 0, quantity <= source position, source != destination

## Time Allocation Estimate

| Phase | Tasks |
|-------|-------|
| Foundation | Project scaffold, types, services, adapters, styles, hooks |
| Fund List | Table, sorting, pagination, responsive |
| Buy Action | Modal, form validation, currency input |
| Portfolio | Page layout, category grouping, item rendering |
| Sell/Transfer | Two modal forms with validation |
| Polish | Notifications, responsive refinements, documentation |

## Scope Decisions

### Included
- All five main tasks (fund list, buy, portfolio, sell, transfer)
- Pagination and sorting (bonus)
- Form validation with Zod (bonus)
- Native `<dialog>` element (bonus)
- Category grouping in portfolio (bonus)
- Alphabetical sorting within groups (bonus)
- Responsive mobile-first design (bonus)
- Currency input formatting (bonus)
- Toast notifications for action feedback

### Excluded (future improvements)
- Unit tests / E2E tests
- Swipe actions on mobile portfolio items
- Order history tab
- "Traspasos en curso" functional tab
- Dark mode
- Loading skeletons / Suspense boundaries
- Error boundary components
- Category filtering on fund list
- Search functionality
