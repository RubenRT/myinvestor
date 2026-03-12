import { useQuery } from '@tanstack/react-query';
import { getPortfolio } from '@/services/portfolio.service';

export function usePortfolio() {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: getPortfolio,
    select: (response) => response.data,
  });
}
