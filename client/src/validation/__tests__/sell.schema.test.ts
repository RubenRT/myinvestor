import { describe, it, expect } from 'vitest';
import { createSellSchema } from '../sell.schema';

describe('createSellSchema', () => {
  const maxQuantity = 10;
  const schema = createSellSchema(maxQuantity);

  it('accepts a valid quantity', () => {
    const result = schema.safeParse({ quantity: 5 });
    expect(result.success).toBe(true);
  });

  it('accepts quantity exactly at max', () => {
    const result = schema.safeParse({ quantity: 10 });
    expect(result.success).toBe(true);
  });

  it('rejects quantity exceeding max', () => {
    const result = schema.safeParse({ quantity: 11 });
    expect(result.success).toBe(false);
  });

  it('rejects zero quantity', () => {
    const result = schema.safeParse({ quantity: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects negative quantity', () => {
    const result = schema.safeParse({ quantity: -1 });
    expect(result.success).toBe(false);
  });

  it('rejects non-numeric quantity', () => {
    const result = schema.safeParse({ quantity: 'abc' });
    expect(result.success).toBe(false);
  });

  it('works with fractional quantities', () => {
    const result = schema.safeParse({ quantity: 0.5 });
    expect(result.success).toBe(true);
  });
});
