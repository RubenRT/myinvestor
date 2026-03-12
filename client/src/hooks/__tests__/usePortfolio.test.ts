import { describe, it, expect } from 'vitest';
import { renderHookWithProviders, waitFor } from '@/test/test-utils';
import { usePortfolio } from '../usePortfolio';

describe('usePortfolio', () => {
  it('returns unwrapped portfolio data array', async () => {
    const { result } = renderHookWithProviders(() => usePortfolio());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(Array.isArray(result.current.data)).toBe(true);
    expect(result.current.data![0]).toHaveProperty('id');
    expect(result.current.data![0]).toHaveProperty('quantity');
  });

  it('returns error state on failure', async () => {
    const { http, HttpResponse } = await import('msw');
    const { server } = await import('@/test/mocks/server');
    server.use(http.get('/api/portfolio', () => HttpResponse.json({ error: 'Fail' }, { status: 500 })));

    const { result } = renderHookWithProviders(() => usePortfolio());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('handles empty portfolio', async () => {
    const { http, HttpResponse } = await import('msw');
    const { server } = await import('@/test/mocks/server');
    server.use(http.get('/api/portfolio', () => HttpResponse.json({ data: [] })));

    const { result } = renderHookWithProviders(() => usePortfolio());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });
});
