import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils';
import { PortfolioItemRow } from '../PortfolioItem';
import { makePortfolioItemEnriched } from '@/test/fixtures';

describe('PortfolioItemRow', () => {
  const item = makePortfolioItemEnriched({
    name: 'Global Equity Fund',
    totalValue: { amount: 1000, currency: 'EUR' },
    gainPercent: 5,
  });

  it('renders fund name', () => {
    renderWithProviders(
      <PortfolioItemRow item={item} onSell={vi.fn()} onTransfer={vi.fn()} />,
    );

    expect(screen.getByText('Global Equity Fund')).toBeInTheDocument();
  });

  it('renders total value', () => {
    renderWithProviders(
      <PortfolioItemRow item={item} onSell={vi.fn()} onTransfer={vi.fn()} />,
    );

    // The formatted currency should appear
    expect(screen.getByText(/1.*000/)).toBeInTheDocument();
  });

  it('renders gain percentage', () => {
    renderWithProviders(
      <PortfolioItemRow item={item} onSell={vi.fn()} onTransfer={vi.fn()} />,
    );

    expect(screen.getByText(/5\.00%/)).toBeInTheDocument();
  });

  it('has action menu with Vender and Traspasar options', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <PortfolioItemRow item={item} onSell={vi.fn()} onTransfer={vi.fn()} />,
    );

    await user.click(screen.getByRole('button', { name: 'Acciones' }));

    expect(screen.getByRole('menuitem', { name: 'Vender' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Traspasar' })).toBeInTheDocument();
  });

  it('calls onSell when Vender is clicked', async () => {
    const user = userEvent.setup();
    const onSell = vi.fn();

    renderWithProviders(
      <PortfolioItemRow item={item} onSell={onSell} onTransfer={vi.fn()} />,
    );

    await user.click(screen.getByRole('button', { name: 'Acciones' }));
    await user.click(screen.getByRole('menuitem', { name: 'Vender' }));

    expect(onSell).toHaveBeenCalledOnce();
  });

  it('calls onTransfer when Traspasar is clicked', async () => {
    const user = userEvent.setup();
    const onTransfer = vi.fn();

    renderWithProviders(
      <PortfolioItemRow item={item} onSell={vi.fn()} onTransfer={onTransfer} />,
    );

    await user.click(screen.getByRole('button', { name: 'Acciones' }));
    await user.click(screen.getByRole('menuitem', { name: 'Traspasar' }));

    expect(onTransfer).toHaveBeenCalledOnce();
  });

  it('shows negative style for negative gains', () => {
    const negativeItem = makePortfolioItemEnriched({
      name: 'Losing Fund',
      gainPercent: -3.5,
    });

    renderWithProviders(
      <PortfolioItemRow item={negativeItem} onSell={vi.fn()} onTransfer={vi.fn()} />,
    );

    expect(screen.getByText(/3\.50%/)).toBeInTheDocument();
  });
});
