import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';

import { typography } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';
import { formatCents } from '@/utils/money';

// Tabular figures keep amounts aligned in columns.
interface IAmountTextProps {
  cents: number;
  tone?: 'label' | 'destructive' | 'positive';
  style?: StyleProp<TextStyle>;
}

export const AmountText = ({ cents, tone = 'label', style }: IAmountTextProps) => {
  const { colors } = useTheme();

  return (
    <Text style={[typography.body, styles.tabular, { color: colors[tone] }, style]}>{formatCents(cents)}</Text>
  );
};

const styles = StyleSheet.create({
  tabular: { fontVariant: ['tabular-nums'] },
});
