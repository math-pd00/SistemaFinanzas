import { skipToken, useQuery } from '@tanstack/react-query';

import { transactionsQueryKey } from '@/features/transactions/useTransactions';
import { supabase } from '@/lib/supabase';
import type { Enums, Tables } from '@/types/database.types';

// Keyed under the transactions key so creating or deleting a movement also refreshes these totals.
export interface IMonthlyExpense {
  categoryId: string | null;
  type: Enums<'transaction_type'>;
  totalCents: number;
}

export type MonthlyExpenseRow = Pick<Tables<'v_monthly_expenses'>, 'category_id' | 'type' | 'total_cents'>;

export const monthlyExpensesQueryKey = (householdId: string | undefined, month: string) => [
  ...transactionsQueryKey(householdId),
  'monthlyExpenses',
  month,
];

export const toMonthlyExpense = (row: MonthlyExpenseRow): IMonthlyExpense | null => {
  if (row.type === null || row.total_cents === null) {
    return null;
  }

  return { categoryId: row.category_id, type: row.type, totalCents: row.total_cents };
};

export const useMonthlyExpenses = (householdId: string | undefined, month: string) =>
  useQuery({
    queryKey: monthlyExpensesQueryKey(householdId, month),
    queryFn:
      householdId === undefined
        ? skipToken
        : async () => {
            const { data, error } = await supabase
              .from('v_monthly_expenses')
              .select('category_id, type, total_cents')
              .eq('household_id', householdId)
              .eq('month', month);
            if (error) {
              throw error;
            }

            return data.map(toMonthlyExpense).filter((expense) => expense !== null);
          },
  });
