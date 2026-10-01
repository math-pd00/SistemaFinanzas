import type { Enums } from '../../types/database.types';
import {
  accountFormSchema,
  adjustBalanceSchema,
  toAccountInsert,
  type AccountFormInput,
  type AccountFormValues,
} from './accountSchemas';

// Every field is a string in the form, so each case starts from an all-empty input.
const emptyInput: AccountFormInput = {
  name: '',
  institution: '',
  holder: '',
  creditLimit: '',
  overlimit: '',
  statementDay: '',
  paymentDueDay: '',
  annualRate: '',
};

const parse = (overrides: Partial<AccountFormInput>) =>
  accountFormSchema.safeParse({ ...emptyInput, name: 'Visa', ...overrides });

describe('accountFormSchema', () => {
  it('trims the name', () => {
    expect(parse({ name: '  Visa  ' }).data?.name).toBe('Visa');
  });

  it.each(['', '   '])('requires a name (%p)', (name) => {
    const result = parse({ name });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['name']);
  });

  it.each<[string, Partial<AccountFormInput>]>([
    ['name', { name: 'a'.repeat(81) }],
    ['institution', { institution: 'a'.repeat(81) }],
    ['holder', { holder: 'a'.repeat(81) }],
  ])('rejects more than 80 characters in %s', (field, overrides) => {
    const result = parse(overrides);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual([field]);
  });

  it('turns empty optional fields into null', () => {
    expect(parse({}).data).toEqual({
      name: 'Visa',
      institution: null,
      holder: null,
      creditLimit: null,
      overlimit: null,
      statementDay: null,
      paymentDueDay: null,
      annualRate: null,
    });
  });

  it('parses an amount to cents', () => {
    expect(parse({ creditLimit: '1600.50' }).data?.creditLimit).toBe(160050);
  });

  it('rejects an amount with a thousands separator', () => {
    const result = parse({ creditLimit: '1,600' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['creditLimit']);
  });

  it('parses a day', () => {
    expect(parse({ statementDay: '15' }).data?.statementDay).toBe(15);
  });

  it.each(['0', '32', '1.5'])('rejects day %p', (statementDay) => {
    const result = parse({ statementDay });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['statementDay']);
  });

  it('parses a rate with a comma decimal', () => {
    expect(parse({ annualRate: '16,5' }).data?.annualRate).toBe(16.5);
  });

  it('rejects a rate above 100', () => {
    const result = parse({ annualRate: '101' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['annualRate']);
  });
});

describe('toAccountInsert', () => {
  const fullValues: AccountFormValues = {
    name: 'Visa',
    institution: 'Banco Pichincha',
    holder: 'Ana',
    creditLimit: 100000,
    overlimit: 5000,
    statementDay: 15,
    paymentDueDay: 5,
    annualRate: 16.5,
  };

  it.each<[Enums<'account_type'>, string[]]>([
    [
      'credit_card',
      [
        'annual_rate',
        'credit_limit_cents',
        'holder',
        'household_id',
        'institution',
        'name',
        'overlimit_cents',
        'payment_due_day',
        'statement_day',
        'type',
      ],
    ],
    ['loan', ['annual_rate', 'household_id', 'institution', 'name', 'type']],
    ['bank_account', ['household_id', 'institution', 'name', 'type']],
    ['cash', ['household_id', 'institution', 'name', 'type']],
  ])('includes only the %s keys', (type, keys) => {
    expect(Object.keys(toAccountInsert(fullValues, type, 'household-1')).sort()).toEqual(keys);
  });

  it('omits null overlimit and annual rate so the DB defaults apply', () => {
    const insert = toAccountInsert({ ...fullValues, overlimit: null, annualRate: null }, 'credit_card', 'household-1');
    expect(insert).not.toHaveProperty('overlimit_cents');
    expect(insert).not.toHaveProperty('annual_rate');
  });
});

describe('adjustBalanceSchema', () => {
  it.each([
    ['1600', 160000],
    ['1600,50', 160050],
  ])('parses %p to %p cents', (targetBalance, expected) => {
    expect(adjustBalanceSchema.safeParse({ targetBalance }).data?.targetBalance).toBe(expected);
  });

  it.each(['', '1,600', '-5'])('rejects %p', (targetBalance) => {
    const result = adjustBalanceSchema.safeParse({ targetBalance });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['targetBalance']);
  });
});
