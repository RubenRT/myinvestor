import { transferFund, type TransferParams } from '@/services/funds.service';
import { usePortfolioMutation } from '@/hooks/usePortfolioMutation';

export function useTransferFund() {
  return usePortfolioMutation({
    mutationFn: (params: TransferParams) => transferFund(params),
    successMessage: 'Traspaso realizado con exito',
    errorMessage: 'Error al realizar el traspaso',
  });
}
