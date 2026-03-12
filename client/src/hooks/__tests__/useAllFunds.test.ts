import { describe, it, expect } from 'vitest';
import { renderHookWithProviders, waitFor } from '@/test/test-utils';
import { useAllFunds } from '../useAllFunds';

describe('useAllFunds', () => {
  it('returns a Map of funds keyed by id', async () => {
    const { result } = renderHookWithProviders(() => useAllFunds());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const map = result.current.data!;
    expect(map).toBeInstanceOf(Map);
    expect(map.size).toBeGreaterThan(0);
    expect(map.get('1')).toBeDefined();
    expect(map.get('1')!.name).toBe('Global Equity Fund');
  });

  it('handles empty fund list', async () => {
    const { http, HttpResponse } = await import('msw');
    const { server } = await import('@/test/mocks/server');
    server.use(
      http.get('/api/funds', () =>
        HttpResponse.json({
          pagination: { page: 1, limit: 100, totalFunds: 0, totalPages: 0 },
          data: [],
        }),
      ),
    );

    const { result } = renderHookWithProviders(() => useAllFunds());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data!.size).toBe(0);
  });
});
