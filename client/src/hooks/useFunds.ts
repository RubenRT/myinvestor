import { useQuery } from '@tanstack/react-query';
import { getFunds } from '@/services/funds.service';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';

interface UseFundsParams {
  page?: number;
  limit?: number;
  sort?: string;
}

export function useFunds({ page = 1, limit = DEFAULT_PAGE_SIZE, sort }: UseFundsParams = {}) {
  return useQuery({
    queryKey: ['funds', { page, limit, sort }],
    queryFn: () => getFunds({ page, limit, sort }),
  });
}
