import { z } from 'zod';

export function createBuySchema(fundValue: number) {
  return z.object({
    quantity: z
      .number({ error: 'Introduce una cantidad valida' })
      .positive('La cantidad debe ser mayor que 0')
      .refine(
        (val) => val * fundValue <= 10_000,
        'El importe total no puede superar 10.000 EUR',
      ),
  });
}

export type BuyFormData = z.infer<ReturnType<typeof createBuySchema>>;
