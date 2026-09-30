// Mirrors the iOS system semantic colors so both platforms share one palette.
export interface IColors {
  background: string;
  card: string;
  label: string;
  secondaryLabel: string;
  separator: string;
  tint: string;
  destructive: string;
  positive: string;
}

export const lightColors: IColors = {
  background: '#F2F2F7',
  card: '#FFFFFF',
  label: '#000000',
  secondaryLabel: 'rgba(60,60,67,0.6)',
  separator: 'rgba(60,60,67,0.29)',
  tint: '#007AFF',
  destructive: '#FF3B30',
  positive: '#34C759',
};

export const darkColors: IColors = {
  background: '#000000',
  card: '#1C1C1E',
  label: '#FFFFFF',
  secondaryLabel: 'rgba(235,235,245,0.6)',
  separator: 'rgba(84,84,88,0.65)',
  tint: '#0A84FF',
  destructive: '#FF453A',
  positive: '#30D158',
};
