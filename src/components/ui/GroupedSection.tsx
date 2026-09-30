import { Children, Fragment, isValidElement, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { radius, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

// Inset-grouped card; hairline separators are inserted between children, inset like iOS.
interface IGroupedSectionProps {
  header?: string;
  footer?: string;
  children: ReactNode;
}

export const GroupedSection = ({ header, footer, children }: IGroupedSectionProps) => {
  const { colors } = useTheme();
  const rows = Children.toArray(children);

  return (
    <View>
      {header ? (
        <Text style={[typography.footnote, styles.caption, { color: colors.secondaryLabel }]}>
          {header.toUpperCase()}
        </Text>
      ) : null}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        {rows.map((row, index) => (
          <Fragment key={isValidElement(row) ? row.key : index}>
            {index > 0 ? <View style={[styles.separator, { backgroundColor: colors.separator }]} /> : null}
            {row}
          </Fragment>
        ))}
      </View>
      {footer ? (
        <Text style={[typography.footnote, styles.caption, { color: colors.secondaryLabel }]}>{footer}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  caption: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  card: { borderRadius: radius.card, overflow: 'hidden' },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: spacing.lg },
});
