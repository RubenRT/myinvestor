import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, screen, userEvent, waitFor } from '@/test/test-utils';
import { BuyFundModal } from '../BuyFundModal';
import { makeFund } from '@/test/fixtures';
import { useNotificationStore } from '@/stores/notification.store';

beforeEach(() => {
  useNotificationStore.setState({ notifications: [] });
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  });
});

describe('BuyFundModal', () => {
  const fund = makeFund({ id: '1', name: 'Global Equity Fund', value: { amount: 100, currency: 'EUR' } });

  it('renders fund name and value', () => {
    renderWithProviders(
      <BuyFundModal fund={fund} open onClose={vi.fn()} />,
    );

    expect(screen.getByText('Global Equity Fund')).toBeInTheDocument();
    expect(screen.getByText(/Valor:/)).toBeInTheDocument();
  });

  it('renders buy modal title', () => {
    renderWithProviders(
      <BuyFundModal fund={fund} open onClose={vi.fn()} />,
    );

    expect(screen.getByText('Comprar fondo')).toBeInTheDocument();
  });

  it('shows Comprar and Cancelar buttons', () => {
    renderWithProviders(
      <BuyFundModal fund={fund} open onClose={vi.fn()} />,
    );

    expect(screen.getByRole('button', { name: 'Comprar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
  });

  it('calls onClose when Cancelar is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProviders(
      <BuyFundModal fund={fund} open onClose={onClose} />,
    );

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('shows validation error for empty quantity on submit', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <BuyFundModal fund={fund} open onClose={vi.fn()} />,
    );

    await user.click(screen.getByRole('button', { name: 'Comprar' }));

    await waitFor(() => {
      expect(screen.getByText('Introduce una cantidad valida')).toBeInTheDocument();
    });
  });

  it('submits successfully with valid quantity', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProviders(
      <BuyFundModal fund={fund} open onClose={onClose} />,
    );

    await user.type(screen.getByRole('spinbutton'), '5');
    await user.click(screen.getByRole('button', { name: 'Comprar' }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});
