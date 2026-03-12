import { z } from 'zod';

export function createTransferSchema(maxQuantity: number, fromFundId: string) {
  return z
    .object({
      toFundId: z.string().min(1, 'Selecciona un fondo de destino'),
      quantity: z
        .number({ error: 'Introduce una cantidad valida' })
        .positive('La cantidad debe ser mayor que 0')
        .max(maxQuantity, `No puedes traspasar mas de ${maxQuantity} participaciones`),
    })
    .refine((data) => data.toFundId !== fromFundId, {
      message: 'No puedes traspasar al mismo fondo',
      path: ['toFundId'],
    });
}

export type TransferFormData = z.infer<ReturnType<typeof createTransferSchema>>;
