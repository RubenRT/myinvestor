import { describe, it, expect } from 'vitest';
import { renderHookWithProviders, waitFor } from '@/test/test-utils';
import { useFunds } from '../useFunds';

describe('useFunds', () => {
  it('returns paginated fund data on success', async () => {
    const { result } = renderHookWithProviders(() => useFunds());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.data).toBeDefined();
    expect(result.current.data?.pagination).toBeDefined();
  });

  it('returns loading state initially', () => {
    const { result } = renderHookWithProviders(() => useFunds());

    expect(result.current.isLoading).toBe(true);
  });

  it('returns error state on API failure', async () => {
    const { http, HttpResponse } = await import('msw');
    const { server } = await import('@/test/mocks/server');
    server.use(http.get('/api/funds', () => HttpResponse.json({ error: 'Fail' }, { status: 500 })));

    const { result } = renderHookWithProviders(() => useFunds());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('uses custom page and sort params in query key', async () => {
    const { result } = renderHookWithProviders(() =>
      useFunds({ page: 2, sort: 'name:asc' }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
