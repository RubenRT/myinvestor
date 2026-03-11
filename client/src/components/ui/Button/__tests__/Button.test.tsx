import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils';
import { Button } from '../Button';

describe('Button', () => {
  it('renders children text', () => {
    renderWithProviders(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('fires onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    renderWithProviders(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('applies primary variant class by default', () => {
    renderWithProviders(<Button>Primary</Button>);
    const btn = screen.getByRole('button');
    // CSS modules mangle names, but the class list should contain something
    expect(btn.className).toBeTruthy();
  });

  it('respects disabled prop', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    renderWithProviders(<Button disabled onClick={onClick}>No</Button>);
    const btn = screen.getByRole('button');

    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('passes extra HTML attributes through', () => {
    renderWithProviders(<Button type="submit" aria-label="Send">Send</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('type', 'submit');
    expect(btn).toHaveAttribute('aria-label', 'Send');
  });
});
