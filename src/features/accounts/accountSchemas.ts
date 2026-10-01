import { z } from 'zod';

import type { Enums, TablesInsert } from '@/types/database.types';
import { parseAmountToCents } from '@/utils/money';

// Inputs stay strings for the form; transforms produce DB-ready values (cents, integers, percent).
const AMOUNT_ERROR = 'Monto inválido. Usa solo números y hasta 2 decimales, sin separador de miles.';
const DAY_ERROR = 'Ingresa un día entre 1 y 31.';
const RATE_ERROR = 'Ingresa una tasa entre 0 y 100.';
const MAX_TEXT_LENGTH = 80;
const MAX_TEXT_ERROR = 'Máximo 80 caracteres.';
const DAY_PATTERN = /^\d{1,2}$/;
const RATE_PATTERN = /^\d{1,3}(?:[.,]\d{1,2})?$/;

const optionalText = z
  .string()
  .trim()
  .max(MAX_TEXT_LENGTH, MAX_TEXT_ERROR)
  .transform((value) => (value === '' ? null : value));

const optionalAmount = z
  .string()
  .trim()
  .transform((value, context) => {
    if (value === '') {
      return null;
    }
    const cents = parseAmountToCents(value);
    if (cents === null) {
      context.addIssue({ code: 'custom', message: AMOUNT_ERROR });
      return z.NEVER;
    }

    return cents;
  });

const optionalDay = z
  .string()
  .trim()
  .transform((value, context) => {
    if (value === '') {
      return null;
    }
    const day = Number(value);
    if (!DAY_PATTERN.test(value) || day < 1 || day > 31) {
      context.addIssue({ code: 'custom', message: DAY_ERROR });
      return z.NEVER;
    }

    return day;
  });

const optionalRate = z
  .string()
  .trim()
  .transform((value, context) => {
    if (value === '') {
      return null;
    }
    const rate = Number(value.replace(',', '.'));
    if (!RATE_PATTERN.test(value) || rate > 100) {
      context.addIssue({ code: 'custom', message: RATE_ERROR });
      return z.NEVER;
    }

    return rate;
  });

export const accountFormSchema = z.object({
  name: z.string().trim().min(1, 'Ingresa un nombre.').max(MAX_TEXT_LENGTH, MAX_TEXT_ERROR),
  institution: optionalText,
  holder: optionalText,
  creditLimit: optionalAmount,
  overlimit: optionalAmount,
  statementDay: optionalDay,
  paymentDueDay: optionalDay,
  annualRate: optionalRate,
});

export type AccountFormInput = z.input<typeof accountFormSchema>;
export type AccountFormValues = z.output<typeof accountFormSchema>;

export const adjustBalanceSchema = z.object({
  targetBalance: z
    .string()
    .trim()
    .min(1, 'Ingresa el saldo.')
    .transform((value, context) => {
      const cents = parseAmountToCents(value);
      if (cents === null || cents < 0) {
        context.addIssue({ code: 'custom', message: AMOUNT_ERROR });
        return z.NEVER;
      }

      return cents;
    }),
});

export type AdjustBalanceInput = z.input<typeof adjustBalanceSchema>;
export type AdjustBalanceValues = z.output<typeof adjustBalanceSchema>;

export const toAccountInsert = (
  values: AccountFormValues,
  type: Enums<'account_type'>,
  householdId: string,
): TablesInsert<'accounts'> => {
  const base = { household_id: householdId, type, name: values.name, institution: values.institution };
  const annualRate = values.annualRate === null ? {} : { annual_rate: values.annualRate };

  switch (type) {
    case 'credit_card':
      return {
        ...base,
        ...annualRate,
        ...(values.overlimit === null ? {} : { overlimit_cents: values.overlimit }),
        holder: values.holder,
        credit_limit_cents: values.creditLimit,
        statement_day: values.statementDay,
        payment_due_day: values.paymentDueDay,
      };
    case 'loan':
      return { ...base, ...annualRate };
    case 'bank_account':
    case 'cash':
      return base;
  }
};
