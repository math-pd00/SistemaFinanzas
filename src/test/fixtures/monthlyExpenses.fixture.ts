import type { IMonthlyExpense, MonthlyExpenseRow } from '@/features/transactions/useMonthlyExpenses';

export const monthStartFixture = '2026-11-01';

export const expenseRowFixture: MonthlyExpenseRow = {
  category_id: 'category-food',
  type: 'expense',
  total_cents: 4550,
};

export const expenseRowWithoutTypeFixture: MonthlyExpenseRow = { ...expenseRowFixture, type: null };

export const expenseRowWithoutTotalFixture: MonthlyExpenseRow = { ...expenseRowFixture, total_cents: null };

export const monthlyExpensesFixture: IMonthlyExpense[] = [
  { categoryId: 'category-food', type: 'expense', totalCents: 4550 },
  { categoryId: 'category-transport', type: 'expense', totalCents: 1000 },
  { categoryId: null, type: 'interest', totalCents: 2115 },
  { categoryId: null, type: 'fee', totalCents: 300 },
  { categoryId: 'category-inactive', type: 'expense', totalCents: 200 },
  { categoryId: null, type: 'expense', totalCents: 100 },
];
