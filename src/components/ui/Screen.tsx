import type { ReactElement, ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View, type RefreshControlProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

// JS large title instead of the native one so iOS and Android render identically.
interface IScreenProps {
  title: string;
  children?: ReactNode;
  refreshControl?: ReactElement<RefreshControlProps>;
  headerRight?: ReactNode;
}

export const Screen = ({ title, children, refreshControl, headerRight }: IScreenProps) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        refreshControl={refreshControl}
      >
        <View style={styles.titleRow}>
          <Text accessibilityRole="header" style={[typography.largeTitle, styles.title, { color: colors.label }]}>
            {title}
          </Text>
          {headerRight}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.xl },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.sm },
  title: { flex: 1 },
});
