import { toAccountBalance, type AccountBalanceRow } from './useAccountBalances';

// Only the pure row mapper is tested; the query is a thin Supabase call.
jest.mock('../../lib/supabase', () => ({ supabase: {} }));

const completeRow: AccountBalanceRow = {
  account_id: 'account-1',
  name: 'Visa',
  type: 'credit_card',
  institution: 'Banco Pichincha',
  balance_cents: 12345,
  available_credit_cents: 87655,
};

describe('toAccountBalance', () => {
  it('maps a complete row to camelCase fields', () => {
    expect(toAccountBalance(completeRow)).toEqual({
      accountId: 'account-1',
      name: 'Visa',
      type: 'credit_card',
      institution: 'Banco Pichincha',
      balanceCents: 12345,
      availableCreditCents: 87655,
    });
  });

  it.each<[string, AccountBalanceRow]>([
    ['account_id', { ...completeRow, account_id: null }],
    ['name', { ...completeRow, name: null }],
    ['type', { ...completeRow, type: null }],
    ['balance_cents', { ...completeRow, balance_cents: null }],
  ])('returns null when %s is null', (_field, row) => {
    expect(toAccountBalance(row)).toBeNull();
  });

  it('keeps a null available_credit_cents as null', () => {
    expect(toAccountBalance({ ...completeRow, available_credit_cents: null })?.availableCreditCents).toBeNull();
  });
});
