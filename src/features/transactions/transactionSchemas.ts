import { z } from 'zod';

import { parseAmountToCents } from '@/utils/money';

// Category and destination are required only for the types that have them; empty selections become null.
const AMOUNT_ERROR = 'Monto inválido. Usa solo números y hasta 2 decimales, sin separador de miles.';
const MAX_DESCRIPTION_LENGTH = 200;

interface ITransactionFormRules {
  hasCategory: boolean;
  hasDestination: boolean;
}

const selectionField = (isRequired: boolean, requiredMessage: string) =>
  z.string().transform((value, context) => {
    if (value !== '') {
      return value;
    }
    if (isRequired) {
      context.addIssue({ code: 'custom', message: requiredMessage });
      return z.NEVER;
    }

    return null;
  });

export const createTransactionFormSchema = ({ hasCategory, hasDestination }: ITransactionFormRules) =>
  z
    .object({
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
      destinationAccountId: selectionField(hasDestination, 'Elige la cuenta de destino.'),
      categoryId: selectionField(hasCategory, 'Elige una categoría.'),
      description: z
        .string()
        .trim()
        .max(MAX_DESCRIPTION_LENGTH, 'Máximo 200 caracteres.')
        .transform((value) => (value === '' ? null : value)),
    })
    .refine((values) => values.destinationAccountId !== values.accountId, {
      message: 'Elige una cuenta distinta a la de origen.',
      path: ['destinationAccountId'],
    });

export type TransactionFormInput = z.input<ReturnType<typeof createTransactionFormSchema>>;
export type TransactionFormValues = z.output<ReturnType<typeof createTransactionFormSchema>>;
