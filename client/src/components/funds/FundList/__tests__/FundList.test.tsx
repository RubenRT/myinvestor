import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, screen, waitFor } from '@/test/test-utils';
import { FundList } from '../FundList';

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  });
});

describe('FundList', () => {
  it('shows loading state initially', () => {
    renderWithProviders(<FundList />);

    expect(screen.getByText('Cargando fondos...')).toBeInTheDocument();
  });

  it('renders fund data after loading', async () => {
    renderWithProviders(<FundList />);

    await waitFor(() => {
      expect(screen.getByText('Global Equity Fund')).toBeInTheDocument();
    });

    expect(screen.getByText('Tech Innovation Fund')).toBeInTheDocument();
    expect(screen.getByText('Health Care Fund')).toBeInTheDocument();
  });

  it('renders the page title', async () => {
    renderWithProviders(<FundList />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Fondos de inversion' })).toBeInTheDocument();
    });
  });

  it('renders sortable column headers', async () => {
    renderWithProviders(<FundList />);

    await waitFor(() => {
      expect(screen.getByText('Nombre')).toBeInTheDocument();
    });

    expect(screen.getByText('Div')).toBeInTheDocument();
    expect(screen.getByText('Categoria')).toBeInTheDocument();
    expect(screen.getByText('Valor liquidativo')).toBeInTheDocument();
  });

  it('shows error state on API failure', async () => {
    const { http, HttpResponse } = await import('msw');
    const { server } = await import('@/test/mocks/server');
    server.use(http.get('/api/funds', () => HttpResponse.json({ error: 'Fail' }, { status: 500 })));

    renderWithProviders(<FundList />);

    await waitFor(() => {
      expect(screen.getByText('Error al cargar los fondos')).toBeInTheDocument();
    });
  });
});
