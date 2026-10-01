import { z } from 'zod';

import { parseAmountToCents } from '@/utils/money';

const AMOUNT_ERROR = 'Monto inválido. Usa solo números y hasta 2 decimales, sin separador de miles.';
const MAX_DESCRIPTION_LENGTH = 200;

export const transactionFormSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, 'Ingresa el monto.')
    .transform((value, context) => {
      const cents = parseAmountToCents(value);
      if (cents === null || cents <= 0) {
        context.addIssue({ code: 'custom', message: AMOUNT_ERROR });
        return z.NEVER;
      }

      return cents;
    }),
  accountId: z.string().min(1, 'Elige una cuenta.'),
  categoryId: z.string().min(1, 'Elige una categoría.'),
  description: z
    .string()
    .trim()
    .max(MAX_DESCRIPTION_LENGTH, 'Máximo 200 caracteres.')
    .transform((value) => (value === '' ? null : value)),
});

export type TransactionFormInput = z.input<typeof transactionFormSchema>;
export type TransactionFormValues = z.output<typeof transactionFormSchema>;
