import { useQuery } from '@tanstack/react-query';
import { getFunds } from '@/services/funds.service';
import type { Fund } from '@/types/fund';

export function useAllFunds() {
  return useQuery({
    queryKey: ['funds', 'all'],
    queryFn: () => getFunds({ page: 1, limit: 100 }),
    select: (response): Map<string, Fund> => {
      const map = new Map<string, Fund>();
      for (const fund of response.data) {
        map.set(fund.id, fund);
      }
      return map;
    },
    staleTime: 5 * 60 * 1000,
  });
}
