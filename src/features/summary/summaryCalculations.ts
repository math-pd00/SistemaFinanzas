import type { IAccountBalance } from '@/features/accounts/useAccountBalances';
import type { ICategory } from '@/features/categories/useCategories';
import { transactionTypeLabels } from '@/features/transactions/transactionTypeLabels';
import type { IMonthlyExpense } from '@/features/transactions/useMonthlyExpenses';
import type { Enums } from '@/types/database.types';

// Expenses are grouped by display label so interest, fees and unknown categories each get a single line.
export interface IExpenseLine {
  label: string;
  totalCents: number;
}

const MONEY_ACCOUNT_TYPES: readonly Enums<'account_type'>[] = ['bank_account', 'cash'];
const DEBT_ACCOUNT_TYPES: readonly Enums<'account_type'>[] = ['credit_card', 'loan'];
const UNCATEGORIZED_LABEL = 'Sin categoría';

const sumBalances = (accounts: IAccountBalance[]): number =>
  accounts.reduce((total, account) => total + account.balanceCents, 0);

export const getMoneyAccounts = (accounts: IAccountBalance[]): IAccountBalance[] =>
  accounts.filter((account) => MONEY_ACCOUNT_TYPES.includes(account.type));

export const getDebtAccounts = (accounts: IAccountBalance[]): IAccountBalance[] =>
  accounts.filter((account) => DEBT_ACCOUNT_TYPES.includes(account.type));

export const sumMoneyCents = (accounts: IAccountBalance[]): number => sumBalances(getMoneyAccounts(accounts));

export const sumDebtCents = (accounts: IAccountBalance[]): number => sumBalances(getDebtAccounts(accounts));

export const sumExpenseCents = (expenses: IMonthlyExpense[]): number =>
  expenses.reduce((total, expense) => total + expense.totalCents, 0);

const toExpenseLabel = (expense: IMonthlyExpense, categoryNames: Map<string, string>): string => {
  if (expense.type !== 'expense') {
    return transactionTypeLabels[expense.type];
  }

  return (expense.categoryId === null ? undefined : categoryNames.get(expense.categoryId)) ?? UNCATEGORIZED_LABEL;
};

export const toExpenseLines = (expenses: IMonthlyExpense[], categories: ICategory[]): IExpenseLine[] => {
  const categoryNames = new Map(categories.map((category) => [category.id, category.name]));
  const totalsByLabel = new Map<string, number>();
  expenses.forEach((expense) => {
    const label = toExpenseLabel(expense, categoryNames);
    totalsByLabel.set(label, (totalsByLabel.get(label) ?? 0) + expense.totalCents);
  });

  return Array.from(totalsByLabel, ([label, totalCents]) => ({ label, totalCents })).sort(
    (first, second) => second.totalCents - first.totalCents,
  );
};
