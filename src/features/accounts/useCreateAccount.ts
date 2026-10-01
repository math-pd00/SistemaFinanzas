import { useMutation, useQueryClient } from '@tanstack/react-query';

import { accountBalancesQueryKey } from '@/features/accounts/useAccountBalances';
import { supabase } from '@/lib/supabase';
import type { TablesInsert } from '@/types/database.types';

// Invalidating the household's balances makes the accounts list refetch with the new account.
export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (account: TablesInsert<'accounts'>) => {
      const { error } = await supabase.from('accounts').insert(account);
      if (error) {
        throw error;
      }
    },
    onSuccess: (_data, variables) =>
      queryClient.invalidateQueries({ queryKey: accountBalancesQueryKey(variables.household_id) }),
  });
};
