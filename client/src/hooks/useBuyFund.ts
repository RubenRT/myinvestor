import { buyFund } from '@/services/funds.service';
import { usePortfolioMutation } from '@/hooks/usePortfolioMutation';

export function useBuyFund() {
  return usePortfolioMutation({
    mutationFn: ({ fundId, quantity }: { fundId: string; quantity: number }) =>
      buyFund(fundId, quantity),
    successMessage: 'Compra realizada con exito',
    errorMessage: 'Error al realizar la compra',
  });
}
