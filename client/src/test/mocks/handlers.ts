import { http, HttpResponse } from 'msw';
import {
  TEST_FUNDS,
  TEST_PORTFOLIO,
  makePaginatedFundsResponse,
  makeMutationResponse,
} from '../fixtures';

export const handlers = [
  http.get('/api/funds', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 10;
    const totalPages = Math.ceil(TEST_FUNDS.length / limit);
    const start = (page - 1) * limit;
    const data = TEST_FUNDS.slice(start, start + limit);

    return HttpResponse.json(makePaginatedFundsResponse(data, page, totalPages));
  }),

  http.get('/api/funds/:id', ({ params }) => {
    const fund = TEST_FUNDS.find((f) => f.id === params.id);
    if (!fund) {
      return HttpResponse.json({ error: 'Fund not found' }, { status: 404 });
    }
    return HttpResponse.json({ data: fund });
  }),

  http.post('/api/funds/:id/buy', () => {
    return HttpResponse.json(makeMutationResponse('Purchase successful'));
  }),

  http.post('/api/funds/:id/sell', () => {
    return HttpResponse.json(makeMutationResponse('Sale successful'));
  }),

  http.post('/api/funds/transfer', () => {
    return HttpResponse.json(makeMutationResponse('Transfer successful'));
  }),

  http.get('/api/portfolio', () => {
    return HttpResponse.json({ data: TEST_PORTFOLIO });
  }),
];
