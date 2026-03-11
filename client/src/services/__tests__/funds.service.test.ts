import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getFunds, getFundById, buyFund, sellFund, transferFund } from '../funds.service';

const mockFetch = vi.fn();

beforeEach(() => {
  mockFetch.mockClear();
  vi.stubGlobal('fetch', mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

function mockOkResponse(data: unknown) {
  return {
    ok: true,
    json: () => Promise.resolve(data),
  };
}

function mockErrorResponse(status: number, error: string) {
  return {
    ok: false,
    status,
    json: () => Promise.resolve({ error }),
  };
}

describe('getFunds', () => {
  it('fetches funds with default params', async () => {
    const body = { pagination: { page: 1, limit: 10, totalFunds: 50, totalPages: 5 }, data: [] };
    mockFetch.mockResolvedValueOnce(mockOkResponse(body));

    const result = await getFunds();

    expect(mockFetch).toHaveBeenCalledOnce();
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain('/funds');
    expect(result).toEqual(body);
  });

  it('includes page, limit, and sort in query params', async () => {
    mockFetch.mockResolvedValueOnce(mockOkResponse({ pagination: {}, data: [] }));

    await getFunds({ page: 2, limit: 20, sort: 'name:asc' });

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain('page=2');
    expect(url).toContain('limit=20');
    expect(url).toContain('sort=name');
  });
});

describe('getFundById', () => {
  it('fetches a single fund by id', async () => {
    const body = { data: { id: '1', name: 'Fund' } };
    mockFetch.mockResolvedValueOnce(mockOkResponse(body));

    const result = await getFundById('1');

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain('/funds/1');
    expect(result).toEqual(body);
  });

  it('encodes the fund id', async () => {
    mockFetch.mockResolvedValueOnce(mockOkResponse({ data: {} }));

    await getFundById('a/b');

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain('/funds/a%2Fb');
  });
});

describe('buyFund', () => {
  it('sends POST with quantity', async () => {
    const body = { message: 'Purchase successful', data: { portfolio: [] } };
    mockFetch.mockResolvedValueOnce(mockOkResponse(body));

    const result = await buyFund('1', 5);

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain('/funds/1/buy');
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toEqual({ quantity: 5 });
    expect(result).toEqual(body);
  });

  it('throws on error response', async () => {
    mockFetch.mockResolvedValueOnce(mockErrorResponse(400, 'Invalid quantity'));

    await expect(buyFund('1', -1)).rejects.toThrow('Invalid quantity');
  });
});

describe('sellFund', () => {
  it('sends POST with quantity', async () => {
    const body = { message: 'Sale successful', data: { portfolio: [] } };
    mockFetch.mockResolvedValueOnce(mockOkResponse(body));

    const result = await sellFund('1', 3);

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain('/funds/1/sell');
    expect(JSON.parse(options.body)).toEqual({ quantity: 3 });
    expect(result).toEqual(body);
  });
});

describe('transferFund', () => {
  it('sends POST with transfer params', async () => {
    const body = { message: 'Transfer successful', data: { portfolio: [] } };
    mockFetch.mockResolvedValueOnce(mockOkResponse(body));

    const result = await transferFund({
      fromFundId: '1',
      toFundId: '2',
      quantity: 5,
    });

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain('/funds/transfer');
    expect(JSON.parse(options.body)).toEqual({
      fromFundId: '1',
      toFundId: '2',
      quantity: 5,
    });
    expect(result).toEqual(body);
  });
});
