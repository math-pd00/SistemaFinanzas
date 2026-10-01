import type { Enums } from '@/types/database.types';

export const transactionTypeLabels: Record<Enums<'transaction_type'>, string> = {
  income: 'Ingreso',
  expense: 'Gasto',
  payment: 'Pago',
  transfer: 'Transferencia',
  interest: 'Interés',
  fee: 'Comisión',
  adjustment: 'Ajuste de saldo',
};
