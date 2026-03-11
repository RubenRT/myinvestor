import { useMutation, useQueryClient } from '@tanstack/react-query';
import { buyFund } from '@/services/funds.service';
import { useNotificationStore } from '@/stores/notification.store';

export function useBuyFund() {
  const queryClient = useQueryClient();
  const addNotification = useNotificationStore((s) => s.addNotification);

  return useMutation({
    mutationFn: ({ fundId, quantity }: { fundId: string; quantity: number }) =>
      buyFund(fundId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      addNotification('success', 'Compra realizada con exito');
    },
    onError: (error: Error) => {
      addNotification('error', error.message || 'Error al realizar la compra');
    },
  });
}
