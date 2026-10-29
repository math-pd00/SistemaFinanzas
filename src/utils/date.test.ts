import { lastDayOfDecemberLateNightFixture, midNovemberFixture } from '@/test/fixtures/dates.fixture';

import { formatIsoDate, formatMonthName, toLocalIsoDate, toMonthStartIsoDate } from './date';

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

describe('toMonthStartIsoDate', () => {
  it('returns the first local day of the month', () => {
    expect(toMonthStartIsoDate(midNovemberFixture)).toBe('2026-11-01');
  });

  it('keeps the local month late at night on its last day', () => {
    expect(toMonthStartIsoDate(lastDayOfDecemberLateNightFixture)).toBe('2026-12-01');
  });
});

describe('formatMonthName', () => {
  it('returns the Spanish month name', () => {
    expect(formatMonthName(midNovemberFixture)).toBe('noviembre');
  });
});
