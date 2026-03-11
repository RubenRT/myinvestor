import type { PortfolioItem } from '@/types/portfolio';
import type { DataResponse } from '@/types/api';
import { apiClient } from '@/services/api';

export function getPortfolio(): Promise<DataResponse<PortfolioItem[]>> {
  return apiClient.get<DataResponse<PortfolioItem[]>>('/portfolio');
}
