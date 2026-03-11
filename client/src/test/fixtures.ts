import type { Fund, Category } from '@/types/fund';
import type { PortfolioItem, PortfolioItemEnriched } from '@/types/portfolio';
import type { PaginatedResponse, MutationResponse } from '@/types/api';

export function makeFund(overrides: Partial<Fund> = {}): Fund {
  return {
    id: '1',
    name: 'Test Fund',
    symbol: 'TF',
    value: { amount: 100, currency: 'EUR' },
    category: 'GLOBAL',
    profitability: {
      YTD: 0.05,
      oneYear: 0.12,
      threeYears: 0.35,
      fiveYears: 0.5,
    },
    ...overrides,
  };
}

export function makePortfolioItem(overrides: Partial<PortfolioItem> = {}): PortfolioItem {
  return {
    id: '1',
    name: 'Test Fund',
    quantity: 10,
    totalValue: { amount: 1000, currency: 'EUR' },
    ...overrides,
  };
}

export function makePortfolioItemEnriched(
  overrides: Partial<PortfolioItemEnriched> = {},
): PortfolioItemEnriched {
  return {
    id: '1',
    name: 'Test Fund',
    quantity: 10,
    totalValue: { amount: 1000, currency: 'EUR' },
    category: 'Global',
    unitValue: { amount: 100, currency: 'EUR' },
    gainPercent: 5,
    ...overrides,
  };
}

export function makePaginatedFundsResponse(
  funds: Fund[] = [makeFund()],
  page = 1,
  totalPages = 1,
): PaginatedResponse<Fund> {
  return {
    pagination: {
      page,
      limit: 10,
      totalFunds: funds.length,
      totalPages,
    },
    data: funds,
  };
}

export function makeMutationResponse(message = 'Success'): MutationResponse {
  return {
    message,
    data: { portfolio: [] },
  };
}

export const TEST_FUNDS: Fund[] = [
  makeFund({ id: '1', name: 'Global Equity Fund', symbol: 'GEF', category: 'GLOBAL' }),
  makeFund({ id: '2', name: 'Tech Innovation Fund', symbol: 'TIF', category: 'TECH', value: { amount: 200, currency: 'USD' } }),
  makeFund({ id: '3', name: 'Health Care Fund', symbol: 'HCF', category: 'HEALTH' }),
];

export const TEST_PORTFOLIO: PortfolioItem[] = [
  makePortfolioItem({ id: '1', name: 'Global Equity Fund', quantity: 10, totalValue: { amount: 1000, currency: 'EUR' } }),
  makePortfolioItem({ id: '2', name: 'Tech Innovation Fund', quantity: 5, totalValue: { amount: 1000, currency: 'USD' } }),
];

export function makeFundsMap(funds: Fund[] = TEST_FUNDS): Map<string, Fund> {
  const map = new Map<string, Fund>();
  for (const fund of funds) {
    map.set(fund.id, fund);
  }
  return map;
}
