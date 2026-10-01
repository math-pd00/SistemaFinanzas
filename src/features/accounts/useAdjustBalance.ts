import { useMutation, useQueryClient } from '@tanstack/react-query';

import { accountBalancesQueryKey } from '@/features/accounts/useAccountBalances';
import { supabase } from '@/lib/supabase';

// The balance is re-read right before inserting so the delta is computed against the latest server value.
interface IAdjustBalanceVariables {
  householdId: string;
  accountId: string;
  targetCents: number;
}

export const useAdjustBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ householdId, accountId, targetCents }: IAdjustBalanceVariables): Promise<number> => {
      const { data, error } = await supabase
        .from('v_account_balances')
        .select('balance_cents')
        .eq('account_id', accountId)
        .single();
      if (error) {
        throw error;
      }
      if (data.balance_cents === null) {
        throw new Error('Account balance is unavailable.');
      }

      const deltaCents = targetCents - data.balance_cents;
      if (deltaCents === 0) {
        return 0;
      }

      const { error: insertError } = await supabase.from('transactions').insert({
        household_id: householdId,
        account_id: accountId,
        type: 'adjustment',
        amount_cents: deltaCents,
        description: 'Ajuste de saldo',
      });
      if (insertError) {
        throw insertError;
      }

      return deltaCents;
    },
    onSuccess: (_deltaCents, { householdId }) =>
      queryClient.invalidateQueries({ queryKey: accountBalancesQueryKey(householdId) }),
  });
};
