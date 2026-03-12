import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils';
import { Pagination } from '../Pagination';

describe('Pagination', () => {
  it('renders nothing when totalPages <= 1', () => {
    const { container } = renderWithProviders(
      <Pagination page={1} totalPages={1} onPageChange={vi.fn()} />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders page buttons for small page counts', () => {
    renderWithProviders(
      <Pagination page={1} totalPages={3} onPageChange={vi.fn()} />,
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('highlights current page with aria-current', () => {
    renderWithProviders(
      <Pagination page={2} totalPages={5} onPageChange={vi.fn()} />,
    );
    expect(screen.getByText('2')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('1')).not.toHaveAttribute('aria-current');
  });

  it('disables previous button on first page', () => {
    renderWithProviders(
      <Pagination page={1} totalPages={5} onPageChange={vi.fn()} />,
    );
    expect(screen.getByLabelText('Pagina anterior')).toBeDisabled();
  });

  it('disables next button on last page', () => {
    renderWithProviders(
      <Pagination page={5} totalPages={5} onPageChange={vi.fn()} />,
    );
    expect(screen.getByLabelText('Pagina siguiente')).toBeDisabled();
  });

  it('calls onPageChange with correct page on click', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    renderWithProviders(
      <Pagination page={2} totalPages={5} onPageChange={onPageChange} />,
    );

    await user.click(screen.getByText('3'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange with page - 1 on previous click', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    renderWithProviders(
      <Pagination page={3} totalPages={5} onPageChange={onPageChange} />,
    );

    await user.click(screen.getByLabelText('Pagina anterior'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('shows ellipsis for large page counts', () => {
    renderWithProviders(
      <Pagination page={5} totalPages={20} onPageChange={vi.fn()} />,
    );
    const ellipses = screen.getAllByText('...');
    expect(ellipses.length).toBeGreaterThanOrEqual(1);
  });

  it('has accessible nav landmark', () => {
    renderWithProviders(
      <Pagination page={1} totalPages={3} onPageChange={vi.fn()} />,
    );
    expect(screen.getByRole('navigation', { name: 'Paginacion' })).toBeInTheDocument();
  });
});
