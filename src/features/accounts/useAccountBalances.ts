import { skipToken, useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import type { Enums, Tables } from '@/types/database.types';

// Rows missing required view columns are dropped, so callers get non-null fields without casts.
export interface IAccountBalance {
  accountId: string;
  name: string;
  type: Enums<'account_type'>;
  institution: string | null;
  holder: string | null;
  balanceCents: number;
  availableCreditCents: number | null;
  creditLimitCents: number | null;
  overlimitCents: number;
  statementDay: number | null;
  paymentDueDay: number | null;
}

export type AccountBalanceRow = Pick<
  Tables<'v_account_balances'>,
  | 'account_id'
  | 'name'
  | 'type'
  | 'institution'
  | 'holder'
  | 'balance_cents'
  | 'available_credit_cents'
  | 'credit_limit_cents'
  | 'overlimit_cents'
  | 'statement_day'
  | 'payment_due_day'
>;

const ACCOUNT_BALANCE_COLUMNS =
  'account_id, name, type, institution, holder, balance_cents, available_credit_cents, credit_limit_cents, overlimit_cents, statement_day, payment_due_day';

export const accountBalancesQueryKey = (householdId: string | undefined) => ['accountBalances', householdId];

export const isDebt = (account: IAccountBalance): boolean =>
  (account.type === 'credit_card' || account.type === 'loan') && account.balanceCents > 0;

export const toAccountBalance = (row: AccountBalanceRow): IAccountBalance | null => {
  if (
    row.account_id === null ||
    row.name === null ||
    row.type === null ||
    row.balance_cents === null ||
    row.overlimit_cents === null
  ) {
    return null;
  }

  return {
    accountId: row.account_id,
    name: row.name,
    type: row.type,
    institution: row.institution,
    holder: row.holder,
    balanceCents: row.balance_cents,
    availableCreditCents: row.available_credit_cents,
    creditLimitCents: row.credit_limit_cents,
    overlimitCents: row.overlimit_cents,
    statementDay: row.statement_day,
    paymentDueDay: row.payment_due_day,
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
