import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercentage, formatNumber } from '../format';

describe('formatCurrency', () => {
  it('formats EUR amounts with comma decimal separator', () => {
    const result = formatCurrency(1234.56, 'EUR');
    expect(result).toContain('1234,56');
    expect(result).toContain('€');
  });

  it('formats USD amounts', () => {
    const result = formatCurrency(1234.56, 'USD');
    expect(result).toContain('1234,56');
    expect(result).toContain('$');
  });

  it('formats zero', () => {
    const result = formatCurrency(0, 'EUR');
    expect(result).toContain('0,00');
  });

  it('formats negative amounts', () => {
    const result = formatCurrency(-500.5, 'EUR');
    expect(result).toContain('500,50');
  });

  it('defaults to EUR formatting for unknown currencies', () => {
    const result = formatCurrency(100, 'GBP');
    // Falls through to EUR formatter
    expect(result).toContain('100,00');
  });
});

describe('formatPercentage', () => {
  it('formats positive percentages', () => {
    const result = formatPercentage(0.05);
    expect(result).toContain('5');
    expect(result).toContain('%');
  });

  it('formats negative percentages', () => {
    const result = formatPercentage(-0.03);
    expect(result).toContain('3');
    expect(result).toContain('%');
  });

  it('formats zero', () => {
    const result = formatPercentage(0);
    expect(result).toContain('0');
    expect(result).toContain('%');
  });
});

describe('formatNumber', () => {
  it('formats numbers with 2 decimal places', () => {
    const result = formatNumber(1234.5);
    expect(result).toContain('1234,50');
  });

  it('formats zero', () => {
    const result = formatNumber(0);
    expect(result).toContain('0,00');
  });
});
