import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils';
import { CurrencyInput } from '../CurrencyInput';

describe('CurrencyInput', () => {
  it('renders a number input', () => {
    renderWithProviders(<CurrencyInput />);
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('displays label when provided', () => {
    renderWithProviders(<CurrencyInput label="Amount" />);
    expect(screen.getByText('Amount')).toBeInTheDocument();
  });

  it('displays currency suffix (default EUR)', () => {
    renderWithProviders(<CurrencyInput />);
    expect(screen.getByText('EUR')).toBeInTheDocument();
  });

  it('displays custom currency suffix', () => {
    renderWithProviders(<CurrencyInput currency="USD" />);
    expect(screen.getByText('USD')).toBeInTheDocument();
  });

  it('displays error message when provided', () => {
    renderWithProviders(<CurrencyInput error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('does not display error when not provided', () => {
    renderWithProviders(<CurrencyInput />);
    expect(screen.queryByText('Required')).not.toBeInTheDocument();
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CurrencyInput placeholder="0" />);

    const input = screen.getByRole('spinbutton');
    await user.type(input, '42');

    expect(input).toHaveValue(42);
  });

  it('forwards ref to input element', () => {
    const ref = vi.fn();
    renderWithProviders(<CurrencyInput ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});
