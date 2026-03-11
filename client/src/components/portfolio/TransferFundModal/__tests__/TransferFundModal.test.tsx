import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, screen, userEvent, waitFor } from '@/test/test-utils';
import { TransferFundModal } from '../TransferFundModal';
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

describe('TransferFundModal', () => {
  const sourceItem = makePortfolioItemEnriched({
    id: '1',
    name: 'Global Equity Fund',
    quantity: 10,
    totalValue: { amount: 1000, currency: 'EUR' },
  });
  const otherItem = makePortfolioItemEnriched({
    id: '2',
    name: 'Tech Innovation Fund',
    quantity: 5,
    totalValue: { amount: 1000, currency: 'USD' },
  });
  const portfolioItems = [sourceItem, otherItem];

  it('renders fund name and current position', () => {
    renderWithProviders(
      <TransferFundModal item={sourceItem} portfolioItems={portfolioItems} open onClose={vi.fn()} />,
    );

    expect(screen.getByText('Global Equity Fund')).toBeInTheDocument();
    expect(screen.getByText(/Posicion actual: 10 participaciones/)).toBeInTheDocument();
  });

  it('renders modal title', () => {
    renderWithProviders(
      <TransferFundModal item={sourceItem} portfolioItems={portfolioItems} open onClose={vi.fn()} />,
    );

    expect(screen.getByText('Traspasar fondo')).toBeInTheDocument();
  });

  it('shows destination fund select with other portfolio items only', () => {
    renderWithProviders(
      <TransferFundModal item={sourceItem} portfolioItems={portfolioItems} open onClose={vi.fn()} />,
    );

    const select = screen.getByRole('combobox');
    const options = Array.from(select.querySelectorAll('option'));

    // Default + destination options
    expect(options).toHaveLength(2); // "Selecciona un fondo" + otherItem
    expect(options[1].textContent).toBe('Tech Innovation Fund');
  });

  it('does not include the source fund in destination options', () => {
    renderWithProviders(
      <TransferFundModal item={sourceItem} portfolioItems={portfolioItems} open onClose={vi.fn()} />,
    );

    const select = screen.getByRole('combobox');
    const optionValues = Array.from(select.querySelectorAll('option')).map((o) => o.value);

    expect(optionValues).not.toContain('1');
  });

  it('shows Traspasar and Cancelar buttons', () => {
    renderWithProviders(
      <TransferFundModal item={sourceItem} portfolioItems={portfolioItems} open onClose={vi.fn()} />,
    );

    expect(screen.getByRole('button', { name: 'Traspasar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
  });

  it('calls onClose when Cancelar is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProviders(
      <TransferFundModal item={sourceItem} portfolioItems={portfolioItems} open onClose={onClose} />,
    );

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('submits successfully with valid destination and quantity', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProviders(
      <TransferFundModal item={sourceItem} portfolioItems={portfolioItems} open onClose={onClose} />,
    );

    await user.selectOptions(screen.getByRole('combobox'), '2');
    await user.type(screen.getByRole('spinbutton'), '3');
    await user.click(screen.getByRole('button', { name: 'Traspasar' }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});
