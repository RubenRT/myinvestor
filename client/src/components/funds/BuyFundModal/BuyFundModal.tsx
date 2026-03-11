import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal/Modal';
import { Button } from '@/components/ui/Button/Button';
import { CurrencyInput } from '@/components/ui/CurrencyInput/CurrencyInput';
import { createBuySchema, type BuyFormData } from '@/validation/buy.schema';
import { useBuyFund } from '@/hooks/useBuyFund';
import { formatCurrency } from '@/utils/format';
import type { Fund } from '@/types/fund';
import styles from './BuyFundModal.module.css';

interface BuyFundModalProps {
  fund: Fund;
  open: boolean;
  onClose: () => void;
}

export function BuyFundModal({ fund, open, onClose }: BuyFundModalProps) {
  const buyMutation = useBuyFund();
  const schema = useMemo(() => createBuySchema(fund.value.amount), [fund.value.amount]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<BuyFormData>({
    resolver: zodResolver(schema),
    defaultValues: { quantity: undefined },
  });

  const quantity = watch('quantity');
  const total = (quantity || 0) * fund.value.amount;

  function onSubmit(data: BuyFormData) {
    buyMutation.mutate(
      { fundId: fund.id, quantity: data.quantity },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Comprar fondo"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={buyMutation.isPending}
          >
            {buyMutation.isPending ? 'Comprando...' : 'Comprar'}
          </Button>
        </>
      }
    >
      <div className={styles.info}>
        <div className={styles.fundName}>{fund.name}</div>
        <div className={styles.fundValue}>
          Valor: {formatCurrency(fund.value.amount, fund.value.currency)}
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <CurrencyInput
          label="Cantidad (participaciones)"
          placeholder="0"
          currency={fund.value.currency}
          error={errors.quantity?.message}
          {...register('quantity', { valueAsNumber: true })}
        />

        <div className={styles.total}>
          <span className={styles.totalLabel}>Importe total</span>
          <span className={styles.totalValue}>
            {formatCurrency(total, fund.value.currency)}
          </span>
        </div>
      </form>
    </Modal>
  );
}
