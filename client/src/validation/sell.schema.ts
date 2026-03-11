import { z } from 'zod';

export function createSellSchema(maxQuantity: number) {
  return z.object({
    quantity: z
      .number({ error: 'Introduce una cantidad valida' })
      .positive('La cantidad debe ser mayor que 0')
      .max(maxQuantity, `No puedes vender mas de ${maxQuantity} participaciones`),
  });
}

export type SellFormData = z.infer<ReturnType<typeof createSellSchema>>;
