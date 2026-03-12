import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '@/utils/constants';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async parseJsonSafe(response: Response): Promise<Record<string, unknown>> {
    try {
      return await response.json();
    } catch (err) {
      console.warn('Failed to parse error response body:', err);
      return {};
    }
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) {
      const body = await this.parseJsonSafe(response);
      throw new Error((body.error as string) || `Request failed: ${response.status}`);
    }
    return response.json();
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      const data = await this.parseJsonSafe(response);
      throw new Error((data.error as string) || `Request failed: ${response.status}`);
    }
    return response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
