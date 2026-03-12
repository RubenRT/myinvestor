export interface PaginationInfo {
  page: number;
  limit: number;
  totalFunds: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  pagination: PaginationInfo;
  data: T[];
}

export interface DataResponse<T> {
  data: T;
}

export interface ApiError {
  error: string;
}

export interface MutationResponse {
  message: string;
  data: {
    portfolio: Array<{ id: string; quantity: number }>;
  };
}
