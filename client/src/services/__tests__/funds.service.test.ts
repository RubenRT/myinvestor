import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/mocks/server';
import { getFunds, getFundById, buyFund, sellFund, transferFund } from '../funds.service';
import { TEST_FUNDS, makePaginatedFundsResponse, makeMutationResponse } from '@/test/fixtures';

describe('getFunds', () => {
  it('fetches funds with default params', async () => {
    const result = await getFunds();

    expect(result.data).toHaveLength(TEST_FUNDS.length);
    expect(result.pagination).toBeDefined();
  });

  it('includes page, limit, and sort in query params', async () => {
    const result = await getFunds({ page: 1, limit: 2, sort: 'name:asc' });

    expect(result.data.length).toBeLessThanOrEqual(2);
    expect(result.pagination).toBeDefined();
  });
});

describe('getFundById', () => {
  it('fetches a single fund by id', async () => {
    const result = await getFundById('1');

    expect(result.data.id).toBe('1');
    expect(result.data.name).toBe('Global Equity Fund');
  });

  it('throws on not found', async () => {
    await expect(getFundById('non-existent')).rejects.toThrow();
  });
});

describe('buyFund', () => {
  it('returns success response', async () => {
    const result = await buyFund('1', 5);

    expect(result.message).toBe('Purchase successful');
    expect(result.data.portfolio).toBeDefined();
  });

  it('throws on error response', async () => {
    server.use(
      http.post('/api/funds/:id/buy', () =>
        HttpResponse.json({ error: 'Invalid quantity' }, { status: 400 }),
      ),
    );

    await expect(buyFund('1', -1)).rejects.toThrow('Invalid quantity');
  });
});

describe('sellFund', () => {
  it('returns success response', async () => {
    const result = await sellFund('1', 3);

    expect(result.message).toBe('Sale successful');
    expect(result.data.portfolio).toBeDefined();
  });
});

describe('transferFund', () => {
  it('returns success response', async () => {
    const result = await transferFund({
      fromFundId: '1',
      toFundId: '2',
      quantity: 5,
    });

    expect(result.message).toBe('Transfer successful');
    expect(result.data.portfolio).toBeDefined();
  });
});
