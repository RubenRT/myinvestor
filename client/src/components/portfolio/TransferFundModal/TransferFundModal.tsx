import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal/Modal';
import { Button } from '@/components/ui/Button/Button';
import { CurrencyInput } from '@/components/ui/CurrencyInput/CurrencyInput';
import { createTransferSchema, type TransferFormData } from '@/validation/transfer.schema';
import { useTransferFund } from '@/hooks/useTransferFund';
import type { PortfolioItemEnriched } from '@/types/portfolio';
import styles from './TransferFundModal.module.css';

interface TransferFundModalProps {
  item: PortfolioItemEnriched;
  portfolioItems: PortfolioItemEnriched[];
  open: boolean;
  onClose: () => void;
}

export function TransferFundModal({ item, portfolioItems, open, onClose }: TransferFundModalProps) {
  const transferMutation = useTransferFund();
  const schema = useMemo(
    () => createTransferSchema(item.quantity, item.id),
    [item.quantity, item.id],
  );

  const destinationFunds = useMemo(
    () => portfolioItems.filter((p) => p.id !== item.id),
    [portfolioItems, item.id],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransferFormData>({
    resolver: zodResolver(schema),
    defaultValues: { toFundId: '', quantity: undefined },
  });

  function onSubmit(data: TransferFormData) {
    transferMutation.mutate(
      {
        fromFundId: item.id,
        toFundId: data.toFundId,
        quantity: data.quantity,
      },
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
      title="Traspasar fondo"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={transferMutation.isPending}
          >
            {transferMutation.isPending ? 'Traspasando...' : 'Traspasar'}
          </Button>
        </>
      }
    >
      <div className={styles.info}>
        <div className={styles.fundName}>{item.name}</div>
        <div className={styles.currentPosition}>
          Posicion actual: {item.quantity} participaciones
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.fieldWrapper}>
          <label className={styles.fieldLabel}>Fondo de destino</label>
          <select
            className={`${styles.select} ${errors.toFundId ? styles.selectError : ''}`}
            {...register('toFundId')}
          >
            <option value="">Selecciona un fondo</option>
            {destinationFunds.map((fund) => (
              <option key={fund.id} value={fund.id}>
                {fund.name}
              </option>
            ))}
          </select>
          {errors.toFundId && (
            <span className={styles.error}>{errors.toFundId.message}</span>
          )}
        </div>

        <CurrencyInput
          label="Cantidad a traspasar (participaciones)"
          placeholder="0"
          currency={item.totalValue.currency}
          error={errors.quantity?.message}
          {...register('quantity', { valueAsNumber: true })}
        />
      </form>
    </Modal>
  );
}
