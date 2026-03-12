import { describe, it, expect } from 'vitest';
import { createBuySchema } from '../buy.schema';

describe('createBuySchema', () => {
  const fundValue = 100; // €100 per unit
  const schema = createBuySchema(fundValue);

  it('accepts a valid quantity', () => {
    const result = schema.safeParse({ quantity: 5 });
    expect(result.success).toBe(true);
  });

  it('accepts quantity exactly at €10,000 limit', () => {
    const result = schema.safeParse({ quantity: 100 }); // 100 × €100 = €10,000
    expect(result.success).toBe(true);
  });

  it('rejects quantity exceeding €10,000 total', () => {
    const result = schema.safeParse({ quantity: 101 }); // 101 × €100 = €10,100
    expect(result.success).toBe(false);
  });

  it('rejects zero quantity', () => {
    const result = schema.safeParse({ quantity: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects negative quantity', () => {
    const result = schema.safeParse({ quantity: -5 });
    expect(result.success).toBe(false);
  });

  it('rejects non-numeric quantity', () => {
    const result = schema.safeParse({ quantity: 'abc' });
    expect(result.success).toBe(false);
  });

  it('adapts limit to fund value', () => {
    const expensiveSchema = createBuySchema(5000); // €5,000 per unit
    expect(expensiveSchema.safeParse({ quantity: 2 }).success).toBe(true);  // €10,000
    expect(expensiveSchema.safeParse({ quantity: 3 }).success).toBe(false); // €15,000
  });

  it('works with fractional quantities', () => {
    const result = schema.safeParse({ quantity: 0.5 });
    expect(result.success).toBe(true);
  });
});
