import { skipToken, useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import type { Enums, Tables } from '@/types/database.types';

// Rows missing required view columns are dropped, so callers get non-null fields without casts.
export interface IAccountBalance {
  accountId: string;
  name: string;
  type: Enums<'account_type'>;
  institution: string | null;
  balanceCents: number;
  availableCreditCents: number | null;
}

export type AccountBalanceRow = Pick<
  Tables<'v_account_balances'>,
  'account_id' | 'name' | 'type' | 'institution' | 'balance_cents' | 'available_credit_cents'
>;

const ACCOUNT_BALANCE_COLUMNS = 'account_id, name, type, institution, balance_cents, available_credit_cents';

export const accountBalancesQueryKey = (householdId: string | undefined) => ['accountBalances', householdId];

export const toAccountBalance = (row: AccountBalanceRow): IAccountBalance | null => {
  if (row.account_id === null || row.name === null || row.type === null || row.balance_cents === null) {
    return null;
  }

  return {
    accountId: row.account_id,
    name: row.name,
    type: row.type,
    institution: row.institution,
    balanceCents: row.balance_cents,
    availableCreditCents: row.available_credit_cents,
  };
};

export const useAccountBalances = (householdId: string | undefined) =>
  useQuery({
    queryKey: accountBalancesQueryKey(householdId),
    queryFn:
      householdId === undefined
        ? skipToken
        : async () => {
            const { data, error } = await supabase
              .from('v_account_balances')
              .select(ACCOUNT_BALANCE_COLUMNS)
              .eq('household_id', householdId)
              .order('name');
            if (error) {
              throw error;
            }

            return data.map(toAccountBalance).filter((balance) => balance !== null);
          },
  });
