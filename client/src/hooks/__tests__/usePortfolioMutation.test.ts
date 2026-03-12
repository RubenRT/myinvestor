import { describe, it, expect, vi } from 'vitest';
import { renderHookWithProviders, waitFor, act } from '@/test/test-utils';
import { usePortfolioMutation } from '../usePortfolioMutation';
import { useNotificationStore } from '@/stores/notification.store';
import type { MutationResponse } from '@/types/api';

describe('usePortfolioMutation', () => {
  beforeEach(() => {
    useNotificationStore.setState({ notifications: [] });
  });

  it('calls mutationFn with correct params', async () => {
    const mutationFn = vi.fn<(p: { id: string }) => Promise<MutationResponse>>().mockResolvedValue({
      message: 'OK',
      data: { portfolio: [] },
    });

    const { result } = renderHookWithProviders(() =>
      usePortfolioMutation({
        mutationFn,
        successMessage: 'Done',
        errorMessage: 'Failed',
      }),
    );

    await act(async () => {
      result.current.mutate({ id: '1' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mutationFn.mock.calls[0][0]).toEqual({ id: '1' });
  });

  it('shows success notification on success', async () => {
    const mutationFn = vi.fn().mockResolvedValue({
      message: 'OK',
      data: { portfolio: [] },
    });

    const { result } = renderHookWithProviders(() =>
      usePortfolioMutation({
        mutationFn,
        successMessage: 'Compra realizada',
        errorMessage: 'Error',
      }),
    );

    await act(async () => {
      result.current.mutate({});
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const notifications = useNotificationStore.getState().notifications;
    expect(notifications).toHaveLength(1);
    expect(notifications[0].type).toBe('success');
    expect(notifications[0].message).toBe('Compra realizada');
  });

  it('shows error notification with error.message on failure', async () => {
    const mutationFn = vi.fn().mockRejectedValue(new Error('Server error'));

    const { result } = renderHookWithProviders(() =>
      usePortfolioMutation({
        mutationFn,
        successMessage: 'OK',
        errorMessage: 'Fallback error',
      }),
    );

    await act(async () => {
      result.current.mutate({});
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    const notifications = useNotificationStore.getState().notifications;
    expect(notifications).toHaveLength(1);
    expect(notifications[0].type).toBe('error');
    expect(notifications[0].message).toBe('Server error');
  });

  it('uses fallback errorMessage when error has no message', async () => {
    const mutationFn = vi.fn().mockRejectedValue(new Error(''));

    const { result } = renderHookWithProviders(() =>
      usePortfolioMutation({
        mutationFn,
        successMessage: 'OK',
        errorMessage: 'Fallback',
      }),
    );

    await act(async () => {
      result.current.mutate({});
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    const notifications = useNotificationStore.getState().notifications;
    expect(notifications[0].message).toBe('Fallback');
  });
});
