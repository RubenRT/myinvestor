import type { PortfolioGroup as PortfolioGroupType } from '@/adapters/portfolio.adapter';
import type { PortfolioItemEnriched } from '@/types/portfolio';
import { PortfolioItemRow } from '@/components/portfolio/PortfolioItem/PortfolioItem';
import styles from './PortfolioGroup.module.css';

interface PortfolioGroupProps {
  group: PortfolioGroupType;
  onSell: (item: PortfolioItemEnriched) => void;
  onTransfer: (item: PortfolioItemEnriched) => void;
}

export function PortfolioGroup({ group, onSell, onTransfer }: PortfolioGroupProps) {
  return (
    <section className={styles.group}>
      <h2 className={styles.groupTitle}>{group.label}</h2>
      <div className={styles.items}>
        {group.items.map((item) => (
          <PortfolioItemRow
            key={item.id}
            item={item}
            onSell={() => onSell(item)}
            onTransfer={() => onTransfer(item)}
          />
        ))}
      </div>
    </section>
  );
}
