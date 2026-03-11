import styles from './SortableHeader.module.css';

type SortDirection = 'asc' | 'desc' | null;

interface SortableHeaderProps {
  label: string;
  field: string;
  currentSort: string | null;
  onSort: (sort: string | null) => void;
}

function parseSortState(currentSort: string | null, field: string): SortDirection {
  if (!currentSort) return null;
  const [sortField, direction] = currentSort.split(':');
  if (sortField !== field) return null;
  return (direction as SortDirection) ?? 'asc';
}

function getNextSort(field: string, current: SortDirection): string | null {
  if (current === null) return `${field}:asc`;
  if (current === 'asc') return `${field}:desc`;
  return null;
}

export function SortableHeader({ label, field, currentSort, onSort }: SortableHeaderProps) {
  const direction = parseSortState(currentSort, field);
  const nextSort = getNextSort(field, direction);

  const arrowSymbol = direction === 'asc' ? ' \u2191' : direction === 'desc' ? ' \u2193' : '';

  return (
    <th
      className={styles.header}
      onClick={() => onSort(nextSort)}
      role="columnheader"
      aria-sort={direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none'}
    >
      <span className={styles.label}>
        {label}
        {arrowSymbol && (
          <span className={`${styles.arrow} ${styles.active}`}>{arrowSymbol}</span>
        )}
      </span>
    </th>
  );
}
