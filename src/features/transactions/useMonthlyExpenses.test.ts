import { transactionsQueryKey } from '@/features/transactions/useTransactions';
import { householdIdFixture } from '@/test/fixtures/household.fixture';
import {
  expenseRowFixture,
  expenseRowWithoutTotalFixture,
  expenseRowWithoutTypeFixture,
  monthStartFixture,
} from '@/test/fixtures/monthlyExpenses.fixture';

import { monthlyExpensesQueryKey, toMonthlyExpense } from './useMonthlyExpenses';

jest.mock('../../lib/supabase');

describe('toMonthlyExpense', () => {
  it('maps a complete row to camelCase fields', () => {
    expect(toMonthlyExpense(expenseRowFixture)).toEqual({
      categoryId: 'category-food',
      type: 'expense',
      totalCents: 4550,
    });
  });

  it('returns null when type is null', () => {
    expect(toMonthlyExpense(expenseRowWithoutTypeFixture)).toBeNull();
  });

  it('returns null when total_cents is null', () => {
    expect(toMonthlyExpense(expenseRowWithoutTotalFixture)).toBeNull();
  });
});

describe('monthlyExpensesQueryKey', () => {
  it('starts with the transactions key so movement changes refresh the totals', () => {
    expect(monthlyExpensesQueryKey(householdIdFixture, monthStartFixture).slice(0, 2)).toEqual(
      transactionsQueryKey(householdIdFixture),
    );
  });
});
