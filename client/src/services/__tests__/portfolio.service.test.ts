import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getPortfolio } from '../portfolio.service';

const mockFetch = vi.fn();

beforeEach(() => {
  mockFetch.mockClear();
  vi.stubGlobal('fetch', mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getPortfolio', () => {
  it('fetches the portfolio', async () => {
    const body = {
      data: [
        { id: '1', name: 'Fund A', quantity: 10, totalValue: { amount: 1000, currency: 'EUR' } },
      ],
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(body),
    });

    const result = await getPortfolio();

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain('/portfolio');
    expect(result).toEqual(body);
  });

  it('throws on error response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'Server error' }),
    });

    await expect(getPortfolio()).rejects.toThrow('Server error');
  });
});
