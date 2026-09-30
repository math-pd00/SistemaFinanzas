import { formatCents, parseAmountToCents } from './money';

// Exact strings are asserted because formatting is deterministic by design.
describe('formatCents', () => {
  it.each([
    [160039, '$1,600.39'],
    [-5, '-$0.05'],
    [0, '$0.00'],
    [99, '$0.99'],
    [100000000, '$1,000,000.00'],
  ])('formats %p as %p', (cents, expected) => {
    expect(formatCents(cents)).toBe(expected);
  });
});

describe('parseAmountToCents', () => {
  it.each([
    ['1600', 160000],
    ['1600.5', 160050],
    ['1600,50', 160050],
    ['0.05', 5],
    ['0', 0],
    ['  1600  ', 160000],
  ])('parses %p as %p', (input, expected) => {
    expect(parseAmountToCents(input)).toBe(expected);
  });

  it.each(['1,600', '1.600.00', '1600.123', '-5', 'abc', '', '.', '1600.', '.5', '99999999999999999'])(
    'rejects %p',
    (input) => {
      expect(parseAmountToCents(input)).toBeNull();
    },
  );
});
