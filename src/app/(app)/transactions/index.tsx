import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, RefreshControl, StyleSheet, Text } from 'react-native';

import { AmountText } from '@/components/ui/AmountText';
import { GroupedSection } from '@/components/ui/GroupedSection';
import { ListRow } from '@/components/ui/ListRow';
import { Screen } from '@/components/ui/Screen';
import { useAccountBalances } from '@/features/accounts/useAccountBalances';
import { useCategories } from '@/features/categories/useCategories';
import { useHousehold } from '@/features/household/useHousehold';
import { toDisplayAmount } from '@/features/transactions/transactionDisplay';
import { transactionTypeLabels } from '@/features/transactions/transactionTypeLabels';
import { useTransactions } from '@/features/transactions/useTransactions';
import { typography } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';
import { formatIsoDate } from '@/utils/date';

const Transactions = () => {
  const { colors } = useTheme();
  const household = useHousehold();
  const transactions = useTransactions(household.data);
  const balances = useAccountBalances(household.data);
  const categories = useCategories(household.data);

  const renderBody = () => {
    if (household.isError || transactions.isError) {
      return (
        <Text style={[typography.body, styles.message, { color: colors.secondaryLabel }]}>
          No se pudieron cargar los movimientos.
        </Text>
      );
    }
    if (transactions.data === undefined) {
      return <ActivityIndicator />;
    }
    if (transactions.data.length === 0) {
      return (
        <Text style={[typography.body, styles.message, { color: colors.secondaryLabel }]}>
          Aún no tienes movimientos.
        </Text>
      );
    }

    const accountNames = new Map(balances.data?.map((account) => [account.accountId, account.name]));
    const categoryNames = new Map(categories.data?.map((category) => [category.id, category.name]));

    return (
      <GroupedSection>
        {transactions.data.map((transaction) => {
          const display = toDisplayAmount(transaction.type, transaction.amountCents);
          const subtitle = [
            transaction.description,
            accountNames.get(transaction.accountId),
            formatIsoDate(transaction.transactionDate),
          ]
            .filter((part) => part)
            .join(' · ');

          return (
            <ListRow
              key={transaction.id}
              title={
                (transaction.categoryId === null ? undefined : categoryNames.get(transaction.categoryId)) ??
                transactionTypeLabels[transaction.type]
              }
              subtitle={subtitle}
              trailing={<AmountText cents={display.cents} tone={display.tone} />}
            />
          );
        })}
      </GroupedSection>
    );
  };

  return (
    <Screen
      title="Movimientos"
      headerRight={
        <Pressable
          onPress={() => router.push('/transactions/new')}
          accessibilityRole="button"
          accessibilityLabel="Agregar movimiento"
          hitSlop={12}
        >
          <Ionicons name="add" size={28} color={colors.tint} />
        </Pressable>
      }
      refreshControl={
        household.data === undefined ? undefined : (
          <RefreshControl refreshing={transactions.isRefetching} onRefresh={transactions.refetch} />
        )
      }
    >
      {renderBody()}
    </Screen>
  );
};

const styles = StyleSheet.create({
  message: { textAlign: 'center' },
});

export default Transactions;
