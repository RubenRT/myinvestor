import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sellFund } from '@/services/funds.service';
import { useNotificationStore } from '@/stores/notification.store';

export function useSellFund() {
  const queryClient = useQueryClient();
  const addNotification = useNotificationStore((s) => s.addNotification);

  return useMutation({
    mutationFn: ({ fundId, quantity }: { fundId: string; quantity: number }) =>
      sellFund(fundId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      addNotification('success', 'Venta realizada con exito');
    },
    onError: (error: Error) => {
      addNotification('error', error.message || 'Error al realizar la venta');
    },
  });
}
