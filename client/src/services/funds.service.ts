import type { Fund } from '@/types/fund';
import type {
  PaginatedResponse,
  DataResponse,
  MutationResponse,
} from '@/types/api';
import { apiClient } from '@/services/api';

interface GetFundsParams {
  page?: number;
  limit?: number;
  sort?: string;
}

export function getFunds(params: GetFundsParams = {}): Promise<PaginatedResponse<Fund>> {
  const queryParams: Record<string, string> = {};
  if (params.page) queryParams.page = String(params.page);
  if (params.limit) queryParams.limit = String(params.limit);
  if (params.sort) queryParams.sort = params.sort;

  return apiClient.get<PaginatedResponse<Fund>>('/funds', queryParams);
}

export function getFundById(id: string): Promise<DataResponse<Fund>> {
  return apiClient.get<DataResponse<Fund>>(`/funds/${encodeURIComponent(id)}`);
}

export function buyFund(id: string, quantity: number): Promise<MutationResponse> {
  return apiClient.post<MutationResponse>(
    `/funds/${encodeURIComponent(id)}/buy`,
    { quantity },
  );
}

export function sellFund(id: string, quantity: number): Promise<MutationResponse> {
  return apiClient.post<MutationResponse>(
    `/funds/${encodeURIComponent(id)}/sell`,
    { quantity },
  );
}

export interface TransferParams {
  fromFundId: string;
  toFundId: string;
  quantity: number;
}

export function transferFund(params: TransferParams): Promise<MutationResponse> {
  return apiClient.post<MutationResponse>('/funds/transfer', params);
}
