import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, screen, userEvent, waitFor } from '@/test/test-utils';
import { SellFundModal } from '../SellFundModal';
import { makePortfolioItemEnriched } from '@/test/fixtures';
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

describe('SellFundModal', () => {
  const item = makePortfolioItemEnriched({
    id: '1',
    name: 'Global Equity Fund',
    quantity: 10,
    totalValue: { amount: 1000, currency: 'EUR' },
  });

  it('renders fund name and current position', () => {
    renderWithProviders(
      <SellFundModal item={item} open onClose={vi.fn()} />,
    );

    expect(screen.getByText('Global Equity Fund')).toBeInTheDocument();
    expect(screen.getByText(/Posicion actual: 10 participaciones/)).toBeInTheDocument();
  });

  it('renders modal title', () => {
    renderWithProviders(
      <SellFundModal item={item} open onClose={vi.fn()} />,
    );

    expect(screen.getByText('Vender fondo')).toBeInTheDocument();
  });

  it('shows Vender and Cancelar buttons', () => {
    renderWithProviders(
      <SellFundModal item={item} open onClose={vi.fn()} />,
    );

    expect(screen.getByRole('button', { name: 'Vender' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
  });

  it('calls onClose when Cancelar is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProviders(
      <SellFundModal item={item} open onClose={onClose} />,
    );

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('submits successfully with valid quantity', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProviders(
      <SellFundModal item={item} open onClose={onClose} />,
    );

    await user.type(screen.getByRole('spinbutton'), '5');
    await user.click(screen.getByRole('button', { name: 'Vender' }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});
