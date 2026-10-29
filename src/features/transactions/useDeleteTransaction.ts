import { useMutation, useQueryClient } from '@tanstack/react-query';

import { accountBalancesQueryKey } from '@/features/accounts/useAccountBalances';
import { transactionsQueryKey } from '@/features/transactions/useTransactions';
import { supabase } from '@/lib/supabase';

// The deleted row is selected back because a delete that matches nothing does not return an error.
interface IDeleteTransactionVariables {
  householdId: string;
  transactionId: string;
}

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ transactionId }: IDeleteTransactionVariables) => {
      const { data, error } = await supabase.from('transactions').delete().eq('id', transactionId).select('id');
      if (error) {
        throw error;
      }
      if (data.length === 0) {
        throw new Error('Transaction was not deleted.');
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
