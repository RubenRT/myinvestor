import { describe, it, expect } from 'vitest';
import { createTransferSchema } from '../transfer.schema';

describe('createTransferSchema', () => {
  const maxQuantity = 10;
  const fromFundId = 'fund-1';
  const schema = createTransferSchema(maxQuantity, fromFundId);

  it('accepts a valid transfer', () => {
    const result = schema.safeParse({ toFundId: 'fund-2', quantity: 5 });
    expect(result.success).toBe(true);
  });

  it('rejects transfer to same fund', () => {
    const result = schema.safeParse({ toFundId: 'fund-1', quantity: 5 });
    expect(result.success).toBe(false);
  });

  it('rejects missing toFundId', () => {
    const result = schema.safeParse({ toFundId: '', quantity: 5 });
    expect(result.success).toBe(false);
  });

  it('rejects quantity exceeding max', () => {
    const result = schema.safeParse({ toFundId: 'fund-2', quantity: 11 });
    expect(result.success).toBe(false);
  });

  it('accepts quantity exactly at max', () => {
    const result = schema.safeParse({ toFundId: 'fund-2', quantity: 10 });
    expect(result.success).toBe(true);
  });

  it('rejects zero quantity', () => {
    const result = schema.safeParse({ toFundId: 'fund-2', quantity: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects negative quantity', () => {
    const result = schema.safeParse({ toFundId: 'fund-2', quantity: -3 });
    expect(result.success).toBe(false);
  });

  it('rejects missing quantity', () => {
    const result = schema.safeParse({ toFundId: 'fund-2' });
    expect(result.success).toBe(false);
  });
});
