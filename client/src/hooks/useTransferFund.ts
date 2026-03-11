import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transferFund, type TransferParams } from '@/services/funds.service';
import { useNotificationStore } from '@/stores/notification.store';

export function useTransferFund() {
  const queryClient = useQueryClient();
  const addNotification = useNotificationStore((s) => s.addNotification);

  return useMutation({
    mutationFn: (params: TransferParams) => transferFund(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      addNotification('success', 'Traspaso realizado con exito');
    },
    onError: (error: Error) => {
      addNotification('error', error.message || 'Error al realizar el traspaso');
    },
  });
}
