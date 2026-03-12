import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, screen, waitFor } from '@/test/test-utils';
import { Portfolio } from '../Portfolio';

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  });
});

describe('Portfolio', () => {
  it('shows loading state initially', () => {
    renderWithProviders(<Portfolio />);

    expect(screen.getByText('Cargando cartera...')).toBeInTheDocument();
  });

  it('renders portfolio items grouped by category after loading', async () => {
    renderWithProviders(<Portfolio />);

    await waitFor(() => {
      expect(screen.getByText('Global Equity Fund')).toBeInTheDocument();
    });

    expect(screen.getByText('Tech Innovation Fund')).toBeInTheDocument();
  });

  it('renders the page title', async () => {
    renderWithProviders(<Portfolio />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Mi cartera' })).toBeInTheDocument();
    });
  });

  it('renders tab navigation', async () => {
    renderWithProviders(<Portfolio />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Fondos/ })).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /Ordenes/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Traspasos en curso/ })).toBeInTheDocument();
  });

  it('shows error state on API failure', async () => {
    const { http, HttpResponse } = await import('msw');
    const { server } = await import('@/test/mocks/server');
    server.use(http.get('/api/portfolio', () => HttpResponse.json({ error: 'Fail' }, { status: 500 })));

    renderWithProviders(<Portfolio />);

    await waitFor(() => {
      expect(screen.getByText('Error al cargar la cartera')).toBeInTheDocument();
    });
  });

  it('shows empty state when portfolio has no items', async () => {
    const { http, HttpResponse } = await import('msw');
    const { server } = await import('@/test/mocks/server');
    server.use(http.get('/api/portfolio', () => HttpResponse.json({ data: [] })));

    renderWithProviders(<Portfolio />);

    await waitFor(() => {
      expect(screen.getByText('No tienes fondos en tu cartera')).toBeInTheDocument();
    });

    expect(screen.getByText('Explorar fondos')).toBeInTheDocument();
  });
});
