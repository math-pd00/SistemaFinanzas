import type { IAccountBalance } from '@/features/accounts/useAccountBalances';

const baseAccountFixture: IAccountBalance = {
  accountId: 'account-base',
  name: 'BASE',
  type: 'bank_account',
  institution: null,
  holder: null,
  balanceCents: 0,
  availableCreditCents: null,
  creditLimitCents: null,
  overlimitCents: 0,
  statementDay: null,
  paymentDueDay: null,
};

export const bankAccountFixture: IAccountBalance = {
  ...baseAccountFixture,
  accountId: 'account-bank',
  name: 'EXPENSES',
  balanceCents: 21033,
};

export const cashAccountFixture: IAccountBalance = {
  ...baseAccountFixture,
  accountId: 'account-cash',
  name: 'EFECTIVO',
  type: 'cash',
  balanceCents: 593,
};

export const creditCardFixture: IAccountBalance = {
  ...baseAccountFixture,
  accountId: 'account-card',
  name: 'PACIFICO',
  type: 'credit_card',
  balanceCents: 160654,
  availableCreditCents: 139346,
  creditLimitCents: 200000,
  overlimitCents: 100000,
  statementDay: 24,
  paymentDueDay: 12,
};

export const loanFixture: IAccountBalance = {
  ...baseAccountFixture,
  accountId: 'account-loan',
  name: 'PRESTAMO',
  type: 'loan',
  balanceCents: 50000,
};

export const accountBalancesFixture: IAccountBalance[] = [
  bankAccountFixture,
  cashAccountFixture,
  creditCardFixture,
  loanFixture,
];

export const noAccountBalancesFixture: IAccountBalance[] = [];
