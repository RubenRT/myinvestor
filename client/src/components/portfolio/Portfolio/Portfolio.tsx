import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useAllFunds } from '@/hooks/useAllFunds';
import { enrichPortfolioItem, groupPortfolioByCategory } from '@/adapters/portfolio.adapter';
import { PortfolioGroup } from '@/components/portfolio/PortfolioGroup/PortfolioGroup';
import { SellFundModal } from '@/components/portfolio/SellFundModal/SellFundModal';
import { TransferFundModal } from '@/components/portfolio/TransferFundModal/TransferFundModal';
import type { PortfolioItemEnriched } from '@/types/portfolio';
import styles from './Portfolio.module.css';

type ModalState =
  | { type: 'none' }
  | { type: 'sell'; item: PortfolioItemEnriched }
  | { type: 'transfer'; item: PortfolioItemEnriched };

export function Portfolio() {
  const { data: portfolioData, isLoading, isError } = usePortfolio();
  const { data: fundsMap } = useAllFunds();
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [activeTab, setActiveTab] = useState<'funds' | 'orders'>('funds');

  const enrichedItems = useMemo(() => {
    if (!portfolioData || !fundsMap) return [];
    return portfolioData.map((item) => enrichPortfolioItem(item, fundsMap.get(item.id)));
  }, [portfolioData, fundsMap]);

  const groups = useMemo(() => {
    if (!fundsMap) return [];
    return groupPortfolioByCategory(enrichedItems, fundsMap);
  }, [enrichedItems, fundsMap]);

  if (isLoading) {
    return <div className={styles.loading}>Cargando cartera...</div>;
  }

  if (isError) {
    return <div className={styles.error}>Error al cargar la cartera</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mi cartera</h1>

      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'funds' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('funds')}
        >
          Fondos
          {activeTab === 'funds' && <span className={styles.tabDot} />}
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'orders' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Ordenes
        </button>
        <button type="button" className={styles.tab} disabled>
          Traspasos en curso
        </button>
      </div>

      {activeTab === 'funds' && (
        <>
          {groups.length === 0 ? (
            <div className={styles.empty}>
              <p>No tienes fondos en tu cartera</p>
              <Link to="/" className={styles.emptyLink}>
                Explorar fondos
              </Link>
            </div>
          ) : (
            groups.map((group) => (
              <PortfolioGroup
                key={group.category}
                group={group}
                onSell={(item) => setModal({ type: 'sell', item })}
                onTransfer={(item) => setModal({ type: 'transfer', item })}
              />
            ))
          )}
        </>
      )}

      {activeTab === 'orders' && (
        <div className={styles.empty}>
          <p>No hay ordenes recientes</p>
        </div>
      )}

      {modal.type === 'sell' && (
        <SellFundModal
          item={modal.item}
          open
          onClose={() => setModal({ type: 'none' })}
        />
      )}

      {modal.type === 'transfer' && (
        <TransferFundModal
          item={modal.item}
          portfolioItems={enrichedItems}
          open
          onClose={() => setModal({ type: 'none' })}
        />
      )}
    </div>
  );
}
