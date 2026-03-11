import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotificationStore } from '@/stores/notification.store';
import type { MutationResponse } from '@/types/api';

interface UsePortfolioMutationOptions<TParams> {
  mutationFn: (params: TParams) => Promise<MutationResponse>;
  successMessage: string;
  errorMessage: string;
}

export function usePortfolioMutation<TParams>({
  mutationFn,
  successMessage,
  errorMessage,
}: UsePortfolioMutationOptions<TParams>) {
  const queryClient = useQueryClient();
  const addNotification = useNotificationStore((s) => s.addNotification);

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      addNotification('success', successMessage);
    },
    onError: (error: Error) => {
      addNotification('error', error.message || errorMessage);
    },
  });
}
