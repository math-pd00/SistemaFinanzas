import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { spacing } from '@/theme/spacing';
import { fontFamily, typography } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

// Row-shaped input for GroupedSection; no lineHeight on TextInput because it misaligns text on iOS.
interface ITextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const TextField = ({ label, error, style, ...inputProps }: ITextFieldProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {label ? <Text style={[typography.body, { color: colors.label }]}>{label}</Text> : null}
        <TextInput
          placeholderTextColor={colors.secondaryLabel}
          style={[styles.input, label ? styles.inputWithLabel : null, { color: colors.label }, style]}
          {...inputProps}
        />
      </View>
      {error ? <Text style={[typography.footnote, { color: colors.destructive }]}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 22 },
  input: { flex: 1, padding: 0, fontFamily: fontFamily.regular, fontSize: 17 },
  inputWithLabel: { textAlign: 'right' },
});
