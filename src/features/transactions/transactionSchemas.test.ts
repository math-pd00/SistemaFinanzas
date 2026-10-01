import { createTransactionFormSchema, type TransactionFormInput } from './transactionSchemas';

const expenseSchema = createTransactionFormSchema({ hasCategory: true, hasDestination: false });
const transferSchema = createTransactionFormSchema({ hasCategory: false, hasDestination: true });

const validInput: TransactionFormInput = {
  amount: '12.5',
  accountId: 'account-1',
  destinationAccountId: '',
  categoryId: 'category-1',
  description: '',
};

const parse = (overrides: Partial<TransactionFormInput>) =>
  expenseSchema.safeParse({ ...validInput, ...overrides });

const parseTransfer = (overrides: Partial<TransactionFormInput>) =>
  transferSchema.safeParse({ ...validInput, categoryId: '', destinationAccountId: 'account-2', ...overrides });

describe('createTransactionFormSchema', () => {
  it('parses a valid input to cents with a null description', () => {
    expect(parse({}).data).toEqual({
      amount: 1250,
      accountId: 'account-1',
      destinationAccountId: null,
      categoryId: 'category-1',
      description: null,
    });
  });

  it('rejects a zero amount', () => {
    const result = parse({ amount: '0' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['amount']);
  });

  it('requires an amount', () => {
    const result = parse({ amount: '' });
    expect(result.error?.issues[0]?.message).toBe('Ingresa el monto.');
  });

  it('rejects an amount with a thousands separator', () => {
    const result = parse({ amount: '1,600' });
    expect(result.error?.issues[0]?.path).toEqual(['amount']);
  });

  it.each<[string, Partial<TransactionFormInput>]>([
    ['accountId', { accountId: '' }],
    ['categoryId', { categoryId: '' }],
  ])('requires %s', (field, overrides) => {
    const result = parse(overrides);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual([field]);
  });

  it('trims the description', () => {
    expect(parse({ description: '  Café  ' }).data?.description).toBe('Café');
  });

  it('rejects a description over 200 characters', () => {
    const result = parse({ description: 'a'.repeat(201) });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['description']);
  });

  it('parses a transfer with a destination and no category', () => {
    expect(parseTransfer({}).data).toEqual({
      amount: 1250,
      accountId: 'account-1',
      destinationAccountId: 'account-2',
      categoryId: null,
      description: null,
    });
  });

  it('requires a destination when the type has one', () => {
    const result = parseTransfer({ destinationAccountId: '' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['destinationAccountId']);
  });

  it('rejects a destination equal to the origin', () => {
    const result = parseTransfer({ destinationAccountId: 'account-1' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['destinationAccountId']);
  });
});
