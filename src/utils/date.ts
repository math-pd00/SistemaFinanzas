// Local-calendar dates without Intl so the stored day matches what the user sees on every device.
const pad = (value: number, length = 2): string => String(value).padStart(length, '0');
const MONTH_NAMES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

export const toLocalIsoDate = (date: Date): string =>
  `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const formatIsoDate = (iso: string): string => {
  const [year, month, day] = iso.split('-');

  return `${day}/${month}/${year}`;
};

export const toMonthStartIsoDate = (date: Date): string =>
  toLocalIsoDate(new Date(date.getFullYear(), date.getMonth(), 1));

export const formatMonthName = (date: Date): string => MONTH_NAMES[date.getMonth()] ?? '';
