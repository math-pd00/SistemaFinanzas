import { useMutation, useQueryClient } from '@tanstack/react-query';

import { accountBalancesQueryKey } from '@/features/accounts/useAccountBalances';
import { transactionsQueryKey } from '@/features/transactions/useTransactions';
import { supabase } from '@/lib/supabase';
import type { Enums } from '@/types/database.types';

export type TransactionEntryType = Exclude<Enums<'transaction_type'>, 'adjustment'>;

// Registering a movement changes both the recent list and the account balances, so both are refetched.
interface ICreateTransactionVariables {
  householdId: string;
  type: TransactionEntryType;
  accountId: string;
  destinationAccountId: string | null;
  categoryId: string | null;
  amountCents: number;
  description: string | null;
  transactionDate: string;
}

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: ICreateTransactionVariables) => {
      const { error } = await supabase.from('transactions').insert({
        household_id: variables.householdId,
        type: variables.type,
        account_id: variables.accountId,
        destination_account_id: variables.destinationAccountId,
        category_id: variables.categoryId,
        amount_cents: variables.amountCents,
        description: variables.description,
        transaction_date: variables.transactionDate,
      });
      if (error) {
        throw error;
      }
    },
    onSuccess: (_data, { householdId }) =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: transactionsQueryKey(householdId),
        }),
        queryClient.invalidateQueries({
          queryKey: accountBalancesQueryKey(householdId),
        }),
      ]),
  });
};
