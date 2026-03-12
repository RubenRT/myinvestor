import { describe, it, expect } from 'vitest';
import { enrichPortfolioItem, groupPortfolioByCategory } from '../portfolio.adapter';
import type { Fund } from '@/types/fund';
import type { PortfolioItem } from '@/types/portfolio';

const makeFund = (overrides: Partial<Fund> = {}): Fund => ({
  id: '1',
  name: 'Test Fund',
  symbol: 'TF',
  value: { amount: 100, currency: 'EUR' },
  category: 'GLOBAL',
  profitability: { YTD: 0.05, oneYear: 0.12, threeYears: 0.35, fiveYears: 0.5 },
  ...overrides,
});

const makePortfolioItem = (overrides: Partial<PortfolioItem> = {}): PortfolioItem => ({
  id: '1',
  name: 'Test Fund',
  quantity: 10,
  totalValue: { amount: 1000, currency: 'EUR' },
  ...overrides,
});

describe('enrichPortfolioItem', () => {
  it('enriches item with fund data', () => {
    const fund = makeFund({ category: 'TECH' });
    const item = makePortfolioItem();
    const result = enrichPortfolioItem(item, fund);

    expect(result.category).toBe('Tecnologia');
    expect(result.unitValue).toEqual({ amount: 100, currency: 'EUR' });
    expect(result.gainPercent).toBe(5);
  });

  it('uses defaults when fund is undefined', () => {
    const item = makePortfolioItem();
    const result = enrichPortfolioItem(item, undefined);

    expect(result.category).toBe('Global');
    expect(result.unitValue).toEqual({ amount: 0, currency: 'EUR' });
    expect(result.gainPercent).toBe(0);
  });

  it('preserves original portfolio item fields', () => {
    const item = makePortfolioItem({ id: '5', name: 'My Fund', quantity: 20 });
    const result = enrichPortfolioItem(item, makeFund());

    expect(result.id).toBe('5');
    expect(result.name).toBe('My Fund');
    expect(result.quantity).toBe(20);
  });
});

describe('groupPortfolioByCategory', () => {
  it('groups items by category following CATEGORY_ORDER', () => {
    const fundsMap = new Map<string, Fund>([
      ['1', makeFund({ id: '1', category: 'TECH' })],
      ['2', makeFund({ id: '2', category: 'MONEY_MARKET' })],
      ['3', makeFund({ id: '3', category: 'TECH' })],
    ]);

    const items = [
      { ...enrichPortfolioItem(makePortfolioItem({ id: '1', name: 'B Fund' }), fundsMap.get('1')) },
      { ...enrichPortfolioItem(makePortfolioItem({ id: '2', name: 'A Fund' }), fundsMap.get('2')) },
      { ...enrichPortfolioItem(makePortfolioItem({ id: '3', name: 'A Fund' }), fundsMap.get('3')) },
    ];

    const groups = groupPortfolioByCategory(items, fundsMap);

    // CATEGORY_ORDER: MONEY_MARKET, GLOBAL, TECH, HEALTH
    expect(groups).toHaveLength(2);
    expect(groups[0].category).toBe('MONEY_MARKET');
    expect(groups[0].items).toHaveLength(1);
    expect(groups[1].category).toBe('TECH');
    expect(groups[1].items).toHaveLength(2);
  });

  it('sorts items within each group alphabetically', () => {
    const fundsMap = new Map<string, Fund>([
      ['1', makeFund({ id: '1', category: 'GLOBAL' })],
      ['2', makeFund({ id: '2', category: 'GLOBAL' })],
    ]);

    const items = [
      { ...enrichPortfolioItem(makePortfolioItem({ id: '1', name: 'Zebra Fund' }), fundsMap.get('1')) },
      { ...enrichPortfolioItem(makePortfolioItem({ id: '2', name: 'Alpha Fund' }), fundsMap.get('2')) },
    ];

    const groups = groupPortfolioByCategory(items, fundsMap);

    expect(groups[0].items[0].name).toBe('Alpha Fund');
    expect(groups[0].items[1].name).toBe('Zebra Fund');
  });

  it('returns empty array for empty input', () => {
    const groups = groupPortfolioByCategory([], new Map());
    expect(groups).toEqual([]);
  });

  it('omits categories with no items', () => {
    const fundsMap = new Map<string, Fund>([
      ['1', makeFund({ id: '1', category: 'HEALTH' })],
    ]);

    const items = [
      { ...enrichPortfolioItem(makePortfolioItem({ id: '1' }), fundsMap.get('1')) },
    ];

    const groups = groupPortfolioByCategory(items, fundsMap);
    expect(groups).toHaveLength(1);
    expect(groups[0].category).toBe('HEALTH');
  });
});
