// Integer-cent arithmetic and a fixed output format keep amounts identical on every device (no Intl).
const THOUSANDS_PATTERN = /\B(?=(\d{3})+(?!\d))/g;
const AMOUNT_PATTERN = /^(\d+)(?:[.,](\d{1,2}))?$/;

export const formatCents = (cents: number): string => {
  const sign = cents < 0 ? '-' : '';
  const absoluteCents = Math.abs(cents);
  const remainder = absoluteCents % 100;
  const dollars = (absoluteCents - remainder) / 100;
  const groupedDollars = String(dollars).replace(THOUSANDS_PATTERN, ',');

  return `${sign}$${groupedDollars}.${String(remainder).padStart(2, '0')}`;
};

export const parseAmountToCents = (input: string): number | null => {
  const match = AMOUNT_PATTERN.exec(input.trim());
  const wholePart = match?.[1];
  if (wholePart === undefined) {
    return null;
  }

  const fractionPart = (match?.[2] ?? '').padEnd(2, '0');
  const cents = Number(wholePart) * 100 + Number(fractionPart);

  return Number.isSafeInteger(cents) ? cents : null;
};
