# API Integration

This document describes how the front-end integrates with the backend API.

## Base Configuration

The Vite dev server proxies all `/api/*` requests to the backend at `http://localhost:3000`:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

This means the front-end calls `/api/funds` which is rewritten to `http://localhost:3000/funds`.

## API Client

The `ApiClient` class in `services/api.ts` provides typed HTTP methods:

```typescript
apiClient.get<T>(path, params?)   // GET with query parameters
apiClient.post<T>(path, body)     // POST with JSON body
```

Error handling: if the response is not OK, the client extracts the error message from the JSON body and throws a standard `Error`.

## Endpoints Used

### GET `/api/funds` - Fund Listing

**Query Parameters:**
- `page` (integer, default 1)
- `limit` (integer, default 10)
- `sort` (string, format `field:direction`, e.g. `name:asc`, `profitability.YTD:desc`)

**Response Shape:**
```json
{
  "pagination": { "page": 1, "limit": 10, "totalFunds": 80, "totalPages": 8 },
  "data": [{ "id": "1", "name": "...", "symbol": "...", "value": {...}, "category": "...", "profitability": {...} }]
}
```

**React Query Key:** `['funds', { page, limit, sort }]`

### GET `/api/funds?page=1&limit=100` - All Funds (for portfolio enrichment)

Same endpoint but requesting all 100 funds to build a lookup map. Used by the `useAllFunds` hook to enrich portfolio items with category data.

**React Query Key:** `['funds', 'all']` (stale time: 5 minutes)

### POST `/api/funds/:id/buy` - Buy Fund

**Body:** `{ "quantity": number }`
**Response:** `{ "message": "Purchase successful", "data": { "portfolio": [...] } }`

**Server Validation:** quantity must be > 0
**Client Validation (additional):** total value (`quantity * fund.value.amount`) must not exceed 10,000 EUR

### POST `/api/funds/:id/sell` - Sell Fund

**Body:** `{ "quantity": number }`
**Response:** `{ "message": "Sale successful", "data": { "portfolio": [...] } }`

**Server Validation:** quantity > 0, must have sufficient holdings
**Client Validation:** quantity > 0, quantity <= current holding

### POST `/api/funds/transfer` - Transfer Between Funds

**Body:** `{ "fromFundId": string, "toFundId": string, "quantity": number }`
**Response:** `{ "message": "Transfer successful", "data": { "portfolio": [...] } }`

**Server Validation:** quantity > 0, fromFundId != toFundId, sufficient holdings, destination fund exists
**Client Validation:** quantity > 0, quantity <= source holding, fromFundId != toFundId, toFundId required

### GET `/api/portfolio` - Portfolio

**Response Shape:**
```json
{
  "data": [
    {
      "id": "1",
      "name": "Global Equity Fund",
      "quantity": 5,
      "totalValue": { "amount": 602.25, "currency": "EUR" }
    }
  ]
}
```

**Important:** The portfolio endpoint does NOT return `category`. The front-end enriches items by cross-referencing the full fund list (via the `useAllFunds` hook) to obtain category information for the grouped portfolio view.

**React Query Key:** `['portfolio']`

## Cache Invalidation Strategy

After any mutation (buy/sell/transfer), the `['portfolio']` query key is invalidated. This triggers a refetch of the portfolio, ensuring the UI reflects the latest server state.

```typescript
// In mutation hooks
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['portfolio'] });
}
```

## Data Transformation Flow

```
API Response -> Service (raw typed data) -> Adapter (UI-friendly format) -> Component (rendering)
```

Example flow for fund listing:
1. `getFunds({ page: 1, limit: 10, sort: 'name:asc' })` returns raw `PaginatedResponse<Fund>`
2. `adaptFunds(data)` converts `profitability.YTD: 0.05` to `formattedYTD: 5`
3. Component renders `+5.00%` using the formatted value

Example flow for portfolio:
1. `getPortfolio()` returns `{ data: PortfolioItem[] }` (without category)
2. `useAllFunds()` provides a `Map<string, Fund>` for lookup
3. `enrichPortfolioItem(item, fund)` merges portfolio data with fund's category and profitability
4. `groupPortfolioByCategory(items, fundsMap)` groups enriched items by category
5. Component renders grouped, sorted portfolio sections
