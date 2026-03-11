import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils';
import { ActionMenu } from '../ActionMenu';

describe('ActionMenu', () => {
  const items = [
    { label: 'Vender', onClick: vi.fn() },
    { label: 'Traspasar', onClick: vi.fn() },
  ];

  it('renders the trigger button', () => {
    renderWithProviders(<ActionMenu items={items} />);
    expect(screen.getByRole('button', { name: 'Acciones' })).toBeInTheDocument();
  });

  it('does not show menu items by default', () => {
    renderWithProviders(<ActionMenu items={items} />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('shows menu items on trigger click', async () => {
    const user = userEvent.setup();

    renderWithProviders(<ActionMenu items={items} />);
    await user.click(screen.getByRole('button', { name: 'Acciones' }));

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Vender' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Traspasar' })).toBeInTheDocument();
  });

  it('calls item onClick and closes menu on selection', async () => {
    const user = userEvent.setup();
    const venderFn = vi.fn();
    const testItems = [
      { label: 'Vender', onClick: venderFn },
      { label: 'Traspasar', onClick: vi.fn() },
    ];

    renderWithProviders(<ActionMenu items={testItems} />);
    await user.click(screen.getByRole('button', { name: 'Acciones' }));
    await user.click(screen.getByRole('menuitem', { name: 'Vender' }));

    expect(venderFn).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes menu on outside click', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <div>
        <span data-testid="outside">outside</span>
        <ActionMenu items={items} />
      </div>,
    );

    await user.click(screen.getByRole('button', { name: 'Acciones' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.click(screen.getByTestId('outside'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('toggles menu open/closed on trigger', async () => {
    const user = userEvent.setup();

    renderWithProviders(<ActionMenu items={items} />);
    const trigger = screen.getByRole('button', { name: 'Acciones' });

    await user.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.click(trigger);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('sets aria-expanded on trigger', async () => {
    const user = userEvent.setup();

    renderWithProviders(<ActionMenu items={items} />);
    const trigger = screen.getByRole('button', { name: 'Acciones' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
});
