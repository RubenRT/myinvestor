import { describe, it, expect } from 'vitest';
import { renderHookWithProviders, waitFor, act } from '@/test/test-utils';
import { useBuyFund } from '../useBuyFund';
import { useNotificationStore } from '@/stores/notification.store';

describe('useBuyFund', () => {
  beforeEach(() => {
    useNotificationStore.setState({ notifications: [] });
  });

  it('successfully buys a fund and shows Spanish success message', async () => {
    const { result } = renderHookWithProviders(() => useBuyFund());

    await act(async () => {
      result.current.mutate({ fundId: '1', quantity: 5 });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const notifications = useNotificationStore.getState().notifications;
    expect(notifications[0].type).toBe('success');
    expect(notifications[0].message).toBe('Compra realizada con exito');
  });

  it('shows error notification on failure', async () => {
    const { http, HttpResponse } = await import('msw');
    const { server } = await import('@/test/mocks/server');
    server.use(
      http.post('/api/funds/:id/buy', () =>
        HttpResponse.json({ error: 'Invalid quantity' }, { status: 400 }),
      ),
    );

    const { result } = renderHookWithProviders(() => useBuyFund());

    await act(async () => {
      result.current.mutate({ fundId: '1', quantity: -1 });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    const notifications = useNotificationStore.getState().notifications;
    expect(notifications[0].type).toBe('error');
  });
});
