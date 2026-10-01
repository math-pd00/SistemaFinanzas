import { useMutation, useQueryClient } from '@tanstack/react-query';

import { accountBalancesQueryKey } from '@/features/accounts/useAccountBalances';
import { transactionsQueryKey } from '@/features/transactions/useTransactions';
import { supabase } from '@/lib/supabase';
import type { Enums } from '@/types/database.types';
import { toLocalIsoDate } from '@/utils/date';

// Registering a movement changes both the recent list and the account balances, so both are refetched.
interface ICreateTransactionVariables {
  householdId: string;
  type: Extract<Enums<'transaction_type'>, 'expense' | 'income'>;
  accountId: string;
  categoryId: string;
  amountCents: number;
  description: string | null;
}

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: ICreateTransactionVariables) => {
      const { error } = await supabase.from('transactions').insert({
        household_id: variables.householdId,
        type: variables.type,
        account_id: variables.accountId,
        category_id: variables.categoryId,
        amount_cents: variables.amountCents,
        description: variables.description,
        transaction_date: toLocalIsoDate(new Date()),
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
