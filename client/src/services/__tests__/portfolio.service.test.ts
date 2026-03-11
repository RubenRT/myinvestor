import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/mocks/server';
import { getPortfolio } from '../portfolio.service';

describe('getPortfolio', () => {
  it('fetches the portfolio', async () => {
    const result = await getPortfolio();

    expect(result.data).toBeDefined();
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data[0]).toHaveProperty('id');
    expect(result.data[0]).toHaveProperty('quantity');
  });

  it('throws on error response', async () => {
    server.use(
      http.get('/api/portfolio', () =>
        HttpResponse.json({ error: 'Server error' }, { status: 500 }),
      ),
    );

    await expect(getPortfolio()).rejects.toThrow('Server error');
  });
});
