# Copilot Instructions — MyInvestor Challenge

## Project Overview

This is a **front-end coding challenge** for MyInvestor. The repo contains a pre-built **Express 5 + TypeScript REST API** (the `server/` directory) that serves as the backend. The task is to build a **React front-end** that consumes this API — fund listing, buying, selling, transferring, and portfolio view.

## Architecture

- **Backend (provided, do not modify):** `server/app.ts` — Express 5 app with in-memory portfolio state. No database. Runs via `node --watch` (Node 24+).
- **Data layer:** `server/data/funds.ts` — static fund dataset with typed exports (`Fund`, `Amount`). Fund IDs are strings.
- **Front-end (to be built):** React app consuming the API at `http://localhost:3000`. Use Vite, Next.js, or similar.

## Key API Endpoints

| Method | Endpoint | Body | Notes |
|--------|----------|------|-------|
| GET | `/funds?page=&limit=&sort=` | — | Paginated, sortable (`field:asc\|desc`) |
| GET | `/funds/:id` | — | Single fund detail |
| POST | `/funds/:id/buy` | `{ quantity }` | Adds to in-memory portfolio |
| POST | `/funds/:id/sell` | `{ quantity }` | Fails if insufficient holdings |
| POST | `/funds/transfer` | `{ fromFundId, toFundId, quantity }` | Between portfolio positions |
| GET | `/portfolio` | — | Returns enriched portfolio with `totalValue` |

Swagger docs available at `/api-docs` when the server is running.

## Running the Project

- **Requires:** Node >= 24.5.0
- **Start API server:** `npm run start` or `yarn start` (runs on port 3000)
- TypeScript is executed directly via `node --watch 'server/app.ts'` (no build step for server)

## Conventions & Patterns

- **TypeScript throughout** — use strict types. The server uses `Readonly<>` wrappers on data types; follow this immutability pattern.
- **ESM modules** — `"type": "module"` in package.json. Use `.ts` extensions in imports (e.g., `import { isNumber } from './utils.ts'`).
- **Formatting:** Prettier + ESLint configured. Run formatting before committing.
- **Sort query format:** `field:direction` (e.g., `name:asc`, `profitability.YTD:desc`). Nested fields use dot notation.
- **Fund categories:** `'GLOBAL' | 'TECH' | 'HEALTH' | 'MONEY_MARKET'`
- **Currencies:** `'EUR' | 'USD'`
- **Amounts** are `{ amount: number, currency: string }` objects — not plain numbers.

## Front-end Implementation Notes

- Build features in this order: fund list → buy → portfolio → sell → transfer
- Buy validation: max 10,000 €, no negative values
- Use responsive, mobile-first design
- Prefer native HTML elements (e.g., `<dialog>` for modals)
- Portfolio state is server-side (in-memory) — always re-fetch after mutations
