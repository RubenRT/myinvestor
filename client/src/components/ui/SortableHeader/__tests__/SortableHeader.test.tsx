import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils';
import { SortableHeader } from '../SortableHeader';

function renderInTable(ui: React.ReactElement) {
  return renderWithProviders(
    <table>
      <thead>
        <tr>{ui}</tr>
      </thead>
    </table>,
  );
}

describe('SortableHeader', () => {
  it('renders label text', () => {
    renderInTable(
      <SortableHeader label="Nombre" field="name" currentSort={null} onSort={vi.fn()} />,
    );
    expect(screen.getByText('Nombre')).toBeInTheDocument();
  });

  it('sets aria-sort to none when not sorted', () => {
    renderInTable(
      <SortableHeader label="Nombre" field="name" currentSort={null} onSort={vi.fn()} />,
    );
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'none');
  });

  it('sets aria-sort to ascending when sorted asc', () => {
    renderInTable(
      <SortableHeader label="Nombre" field="name" currentSort="name:asc" onSort={vi.fn()} />,
    );
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'ascending');
  });

  it('sets aria-sort to descending when sorted desc', () => {
    renderInTable(
      <SortableHeader label="Nombre" field="name" currentSort="name:desc" onSort={vi.fn()} />,
    );
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'descending');
  });

  it('cycles null → asc on click', async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();

    renderInTable(
      <SortableHeader label="Nombre" field="name" currentSort={null} onSort={onSort} />,
    );
    await user.click(screen.getByRole('columnheader'));
    expect(onSort).toHaveBeenLastCalledWith('name:asc');
  });

  it('cycles asc → desc on click', async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();

    renderInTable(
      <SortableHeader label="Nombre" field="name" currentSort="name:asc" onSort={onSort} />,
    );
    await user.click(screen.getByRole('columnheader'));
    expect(onSort).toHaveBeenLastCalledWith('name:desc');
  });

  it('cycles desc → null on click', async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();

    renderInTable(
      <SortableHeader label="Nombre" field="name" currentSort="name:desc" onSort={onSort} />,
    );
    await user.click(screen.getByRole('columnheader'));
    expect(onSort).toHaveBeenLastCalledWith(null);
  });

  it('ignores other fields in currentSort', () => {
    renderInTable(
      <SortableHeader label="Nombre" field="name" currentSort="category:asc" onSort={vi.fn()} />,
    );
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'none');
  });
});
