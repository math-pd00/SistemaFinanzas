import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

// A pressable row shows a disclosure chevron by default, matching iOS; 'checkmark' marks a selected option.
interface IListRowProps {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  onPress?: () => void;
  accessory?: 'disclosure' | 'checkmark' | 'none';
}

export const ListRow = ({ title, subtitle, trailing, onPress, accessory }: IListRowProps) => {
  const { colors } = useTheme();
  const resolvedAccessory = accessory ?? (onPress ? 'disclosure' : 'none');

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={({ pressed }) => [styles.row, pressed ? { backgroundColor: colors.separator } : null]}
    >
      <View style={styles.texts}>
        <Text numberOfLines={1} style={[typography.body, { color: colors.label }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={2} style={[typography.subheadline, { color: colors.secondaryLabel }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
      {resolvedAccessory === 'disclosure' ? (
        <Ionicons name="chevron-forward" size={18} color={colors.secondaryLabel} />
      ) : null}
      {resolvedAccessory === 'checkmark' ? <Ionicons name="checkmark" size={20} color={colors.tint} /> : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  texts: { flex: 1, gap: 2 },
});
