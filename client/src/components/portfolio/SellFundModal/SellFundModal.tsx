import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal/Modal';
import { Button } from '@/components/ui/Button/Button';
import { CurrencyInput } from '@/components/ui/CurrencyInput/CurrencyInput';
import { createSellSchema, type SellFormData } from '@/validation/sell.schema';
import { useSellFund } from '@/hooks/useSellFund';
import type { PortfolioItemEnriched } from '@/types/portfolio';
import styles from './SellFundModal.module.css';

interface SellFundModalProps {
  item: PortfolioItemEnriched;
  open: boolean;
  onClose: () => void;
}

export function SellFundModal({ item, open, onClose }: SellFundModalProps) {
  const sellMutation = useSellFund();
  const schema = useMemo(() => createSellSchema(item.quantity), [item.quantity]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SellFormData>({
    resolver: zodResolver(schema),
    defaultValues: { quantity: undefined },
  });

  function onSubmit(data: SellFormData) {
    sellMutation.mutate(
      { fundId: item.id, quantity: data.quantity },
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
      title="Vender fondo"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleSubmit(onSubmit)}
            disabled={sellMutation.isPending}
          >
            {sellMutation.isPending ? 'Vendiendo...' : 'Vender'}
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
        <CurrencyInput
          label="Cantidad a vender (participaciones)"
          placeholder="0"
          currency={item.totalValue.currency}
          error={errors.quantity?.message}
          {...register('quantity', { valueAsNumber: true })}
        />
      </form>
    </Modal>
  );
}
