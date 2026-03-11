import { describe, it, expect } from 'vitest';
import { adaptFund, adaptFunds } from '../fund.adapter';
import type { Fund } from '@/types/fund';

const makeFund = (overrides: Partial<Fund> = {}): Fund => ({
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
});

describe('adaptFund', () => {
  it('multiplies profitability values by 100', () => {
    const result = adaptFund(makeFund());
    expect(result.formattedYTD).toBe(5);
    expect(result.formattedOneYear).toBe(12);
    expect(result.formattedThreeYears).toBe(35);
    expect(result.formattedFiveYears).toBe(50);
  });

  it('resolves category labels', () => {
    expect(adaptFund(makeFund({ category: 'GLOBAL' })).categoryLabel).toBe('Global');
    expect(adaptFund(makeFund({ category: 'TECH' })).categoryLabel).toBe('Tecnologia');
    expect(adaptFund(makeFund({ category: 'HEALTH' })).categoryLabel).toBe('Salud');
    expect(adaptFund(makeFund({ category: 'MONEY_MARKET' })).categoryLabel).toBe('Mercado monetario');
  });

  it('preserves original fund fields', () => {
    const fund = makeFund({ id: '42', name: 'My Fund', symbol: 'MF' });
    const result = adaptFund(fund);
    expect(result.id).toBe('42');
    expect(result.name).toBe('My Fund');
    expect(result.symbol).toBe('MF');
    expect(result.value).toEqual({ amount: 100, currency: 'EUR' });
  });

  it('handles negative profitability', () => {
    const fund = makeFund({
      profitability: { YTD: -0.03, oneYear: -0.1, threeYears: -0.2, fiveYears: -0.5 },
    });
    const result = adaptFund(fund);
    expect(result.formattedYTD).toBeCloseTo(-3);
    expect(result.formattedOneYear).toBeCloseTo(-10);
  });
});

describe('adaptFunds', () => {
  it('maps an array of funds', () => {
    const funds = [makeFund({ id: '1' }), makeFund({ id: '2' })];
    const result = adaptFunds(funds);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('2');
  });

  it('returns empty array for empty input', () => {
    expect(adaptFunds([])).toEqual([]);
  });
});
