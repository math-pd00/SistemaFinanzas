import { formatIsoDate, toLocalIsoDate } from './date';

describe('toLocalIsoDate', () => {
  it('uses the local day even late at night', () => {
    expect(toLocalIsoDate(new Date(2026, 9, 1, 23, 30))).toBe('2026-10-01');
  });

  it('zero-pads month and day', () => {
    expect(toLocalIsoDate(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('formatIsoDate', () => {
  it('formats YYYY-MM-DD as DD/MM/YYYY', () => {
    expect(formatIsoDate('2026-10-01')).toBe('01/10/2026');
  });
});
