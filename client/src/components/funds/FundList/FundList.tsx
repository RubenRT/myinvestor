import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFunds } from '@/hooks/useFunds';
import { adaptFunds } from '@/adapters/fund.adapter';
import { formatCurrency } from '@/utils/format';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { SortableHeader } from '@/components/ui/SortableHeader/SortableHeader';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { ActionMenu } from '@/components/ui/ActionMenu/ActionMenu';
import { BuyFundModal } from '@/components/funds/BuyFundModal/BuyFundModal';
import type { Fund } from '@/types/fund';
import styles from './FundList.module.css';

export function FundList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [buyingFund, setBuyingFund] = useState<Fund | null>(null);

  const page = Number(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || undefined;

  const { data, isLoading, isError } = useFunds({
    page,
    limit: DEFAULT_PAGE_SIZE,
    sort,
  });

  const funds = data ? adaptFunds(data.data) : [];
  const pagination = data?.pagination;

  function handleSort(newSort: string | null) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newSort) {
        next.set('sort', newSort);
      } else {
        next.delete('sort');
      }
      next.set('page', '1');
      return next;
    });
  }

  function handlePageChange(newPage: number) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(newPage));
      return next;
    });
  }

  const currentSort = sort ?? null;

  if (isLoading) {
    return <div className={styles.loading}>Cargando fondos...</div>;
  }

  if (isError) {
    return <div className={styles.error}>Error al cargar los fondos</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Fondos de inversion</h1>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <SortableHeader label="Nombre" field="name" currentSort={currentSort} onSort={handleSort} />
              <SortableHeader label="Div" field="currency" currentSort={currentSort} onSort={handleSort} />
              <SortableHeader label="Categoria" field="category" currentSort={currentSort} onSort={handleSort} />
              <SortableHeader label="Valor liquidativo" field="value" currentSort={currentSort} onSort={handleSort} />
              <SortableHeader label="2025" field="profitability.YTD" currentSort={currentSort} onSort={handleSort} />
              <SortableHeader label="1A" field="profitability.oneYear" currentSort={currentSort} onSort={handleSort} />
              <SortableHeader label="3A" field="profitability.threeYears" currentSort={currentSort} onSort={handleSort} />
              <SortableHeader label="5A" field="profitability.fiveYears" currentSort={currentSort} onSort={handleSort} />
              <th className={styles.actionsCell}></th>
            </tr>
          </thead>
          <tbody>
            {funds.map((fund) => (
              <FundRow
                key={fund.id}
                fund={fund}
                onBuy={() => setBuyingFund(fund)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {buyingFund && (
        <BuyFundModal
          fund={buyingFund}
          open={!!buyingFund}
          onClose={() => setBuyingFund(null)}
        />
      )}
    </div>
  );
}

interface FundRowProps {
  fund: ReturnType<typeof adaptFunds>[number];
  onBuy: () => void;
}

function FundRow({ fund, onBuy }: FundRowProps) {
  const profitClass = (value: number) =>
    value >= 0 ? styles.positive : styles.negative;

  const formatProfit = (value: number) =>
    `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

  return (
    <tr>
      <td>
        <span className={styles.fundName}>
          {fund.name}
          <span className={styles.fundSymbol}>{fund.symbol}</span>
        </span>
      </td>
      <td>{fund.value.currency}</td>
      <td>
        <span className={styles.category}>{fund.categoryLabel}</span>
      </td>
      <td className={styles.numericCell}>
        {formatCurrency(fund.value.amount, fund.value.currency)}
      </td>
      <td className={`${styles.numericCell} ${profitClass(fund.formattedYTD)}`}>
        {formatProfit(fund.formattedYTD)}
      </td>
      <td className={`${styles.numericCell} ${profitClass(fund.formattedOneYear)}`}>
        {formatProfit(fund.formattedOneYear)}
      </td>
      <td className={`${styles.numericCell} ${profitClass(fund.formattedThreeYears)}`}>
        {formatProfit(fund.formattedThreeYears)}
      </td>
      <td className={`${styles.numericCell} ${profitClass(fund.formattedFiveYears)}`}>
        {formatProfit(fund.formattedFiveYears)}
      </td>
      <td className={styles.actionsCell}>
        <ActionMenu
          items={[{ label: 'Comprar', onClick: onBuy }]}
        />
      </td>
    </tr>
  );
}
