import { Pressable, StyleSheet, Text } from 'react-native';

import { radius } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

// Filled iOS-style button; isDestructive swaps the tint for the destructive color.
interface IPrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  isDestructive?: boolean;
}

export const PrimaryButton = ({ title, onPress, disabled = false, isDestructive = false }: IPrimaryButtonProps) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: isDestructive ? colors.destructive : colors.tint },
        pressed || disabled ? styles.dimmed : null,
      ]}
    >
      <Text style={[typography.headline, styles.title]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: { height: 50, borderRadius: radius.card, alignItems: 'center', justifyContent: 'center' },
  title: { color: '#FFFFFF' },
  dimmed: { opacity: 0.6 },
});
