import {
  accountBalancesFixture,
  bankAccountFixture,
  cashAccountFixture,
  creditCardFixture,
  loanFixture,
  noAccountBalancesFixture,
} from '@/test/fixtures/accountBalances.fixture';
import { categoriesFixture } from '@/test/fixtures/categories.fixture';
import { monthlyExpensesFixture } from '@/test/fixtures/monthlyExpenses.fixture';

import {
  getDebtAccounts,
  getMoneyAccounts,
  sumDebtCents,
  sumExpenseCents,
  sumMoneyCents,
  toExpenseLines,
} from './summaryCalculations';

describe('getMoneyAccounts', () => {
  it('keeps only bank accounts and cash', () => {
    expect(getMoneyAccounts(accountBalancesFixture)).toEqual([bankAccountFixture, cashAccountFixture]);
  });
});

describe('getDebtAccounts', () => {
  it('keeps only credit cards and loans', () => {
    expect(getDebtAccounts(accountBalancesFixture)).toEqual([creditCardFixture, loanFixture]);
  });
});

describe('sumMoneyCents', () => {
  it('adds the balances of bank accounts and cash', () => {
    expect(sumMoneyCents(accountBalancesFixture)).toBe(21626);
  });

  it('returns 0 when there are no accounts', () => {
    expect(sumMoneyCents(noAccountBalancesFixture)).toBe(0);
  });
});

describe('sumDebtCents', () => {
  it('adds the balances of credit cards and loans', () => {
    expect(sumDebtCents(accountBalancesFixture)).toBe(210654);
  });
});

describe('sumExpenseCents', () => {
  it('adds every expense, interest and fee of the month', () => {
    expect(sumExpenseCents(monthlyExpensesFixture)).toBe(8265);
  });
});

describe('toExpenseLines', () => {
  it('groups by category, interest and fee from highest to lowest', () => {
    expect(toExpenseLines(monthlyExpensesFixture, categoriesFixture)).toEqual([
      { label: 'Alimentación', totalCents: 4550 },
      { label: 'Interés', totalCents: 2115 },
      { label: 'Transporte', totalCents: 1000 },
      { label: 'Comisión', totalCents: 300 },
      { label: 'Sin categoría', totalCents: 300 },
    ]);
  });
});
