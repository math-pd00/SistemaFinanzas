import { transactionFormSchema, type TransactionFormInput } from './transactionSchemas';

const validInput: TransactionFormInput = {
  amount: '12.5',
  accountId: 'account-1',
  categoryId: 'category-1',
  description: '',
};

const parse = (overrides: Partial<TransactionFormInput>) =>
  transactionFormSchema.safeParse({ ...validInput, ...overrides });

describe('transactionFormSchema', () => {
  it('parses a valid input to cents with a null description', () => {
    expect(parse({}).data).toEqual({
      amount: 1250,
      accountId: 'account-1',
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
});
