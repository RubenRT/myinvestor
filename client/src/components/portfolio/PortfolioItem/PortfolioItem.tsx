import type { PortfolioItemEnriched } from '@/types/portfolio';
import { formatCurrency } from '@/utils/format';
import { ActionMenu } from '@/components/ui/ActionMenu/ActionMenu';
import styles from './PortfolioItem.module.css';

interface PortfolioItemRowProps {
  item: PortfolioItemEnriched;
  onSell: () => void;
  onTransfer: () => void;
}

export function PortfolioItemRow({ item, onSell, onTransfer }: PortfolioItemRowProps) {
  const isPositive = item.gainPercent >= 0;
  const arrow = isPositive ? '\u2191' : '\u2193';
  const gainClass = isPositive ? styles.gainPositive : styles.gainNegative;

  const gainAmount = item.totalValue.amount * (item.gainPercent / 100);

  return (
    <div className={styles.item}>
      <div className={styles.icon} aria-hidden="true">
        {isPositive ? '\u2197' : '\u2198'}
      </div>

      <div className={styles.info}>
        <div className={styles.name}>{item.name}</div>
      </div>

      <div className={styles.values}>
        <div className={styles.totalValue}>
          {formatCurrency(item.totalValue.amount, item.totalValue.currency)}
        </div>
        <div className={`${styles.gain} ${gainClass}`}>
          <span>{formatCurrency(Math.abs(gainAmount), item.totalValue.currency)}</span>
          <span>{arrow} {Math.abs(item.gainPercent).toFixed(2)}%</span>
        </div>
      </div>

      <div className={styles.actions}>
        <ActionMenu
          items={[
            { label: 'Vender', onClick: onSell },
            { label: 'Traspasar', onClick: onTransfer },
          ]}
        />
      </div>
    </div>
  );
}
