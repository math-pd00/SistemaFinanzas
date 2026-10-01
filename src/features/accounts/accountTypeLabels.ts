import type { Enums } from '@/types/database.types';

// Typed over the generated enum so a new account type fails typecheck until it gets a label.
export const accountTypeLabels: Record<Enums<'account_type'>, string> = {
  credit_card: 'Tarjeta de crédito',
  loan: 'Préstamo',
  bank_account: 'Cuenta bancaria',
  cash: 'Efectivo',
};
