import { skipToken, useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import type { Enums, Tables } from '@/types/database.types';

const RECENT_LIMIT = 50;
const TRANSACTION_COLUMNS =
  'id, type, account_id, destination_account_id, category_id, amount_cents, transaction_date, description';

export interface ITransaction {
  id: string;
  type: Enums<'transaction_type'>;
  accountId: string;
  destinationAccountId: string | null;
  categoryId: string | null;
  amountCents: number;
  transactionDate: string;
  description: string | null;
}

export type TransactionRow = Pick<
  Tables<'transactions'>,
  | 'id'
  | 'type'
  | 'account_id'
  | 'destination_account_id'
  | 'category_id'
  | 'amount_cents'
  | 'transaction_date'
  | 'description'
>;

export const transactionsQueryKey = (householdId: string | undefined) => ['transactions', householdId];

export const toTransaction = (row: TransactionRow): ITransaction => ({
  id: row.id,
  type: row.type,
  accountId: row.account_id,
  destinationAccountId: row.destination_account_id,
  categoryId: row.category_id,
  amountCents: row.amount_cents,
  transactionDate: row.transaction_date,
  description: row.description,
});

export const useTransactions = (householdId: string | undefined) =>
  useQuery({
    queryKey: transactionsQueryKey(householdId),
    queryFn:
      householdId === undefined
        ? skipToken
        : async (): Promise<ITransaction[]> => {
            const { data, error } = await supabase
              .from('transactions')
              .select(TRANSACTION_COLUMNS)
              .eq('household_id', householdId)
              .order('transaction_date', { ascending: false })
              .order('created_at', { ascending: false })
              .limit(RECENT_LIMIT);
            if (error) {
              throw error;
            }

            return data.map(toTransaction);
          },
  });
