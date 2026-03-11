import { sellFund } from '@/services/funds.service';
import { usePortfolioMutation } from '@/hooks/usePortfolioMutation';

export function useSellFund() {
  return usePortfolioMutation({
    mutationFn: ({ fundId, quantity }: { fundId: string; quantity: number }) =>
      sellFund(fundId, quantity),
    successMessage: 'Venta realizada con exito',
    errorMessage: 'Error al realizar la venta',
  });
}
