import type { ICategory } from '@/features/categories/useCategories';

export const categoriesFixture: ICategory[] = [
  { id: 'category-food', name: 'Alimentación', type: 'expense' },
  { id: 'category-transport', name: 'Transporte', type: 'expense' },
  { id: 'category-salary', name: 'Sueldo', type: 'income' },
];
