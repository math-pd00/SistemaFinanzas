import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Alert, StyleSheet, Text } from 'react-native';

import { AmountText } from '@/components/ui/AmountText';
import { GroupedSection } from '@/components/ui/GroupedSection';
import { ListRow } from '@/components/ui/ListRow';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { useAccountBalances } from '@/features/accounts/useAccountBalances';
import { useCategories } from '@/features/categories/useCategories';
import { useHousehold } from '@/features/household/useHousehold';
import { toDisplayAmount } from '@/features/transactions/transactionDisplay';
import { transactionTypeLabels } from '@/features/transactions/transactionTypeLabels';
import { useDeleteTransaction } from '@/features/transactions/useDeleteTransaction';
import { useTransactions } from '@/features/transactions/useTransactions';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';
import { formatIsoDate } from '@/utils/date';

// The movement comes from the cached recent list, the only place this screen is opened from.
const TransactionDetail = () => {
  const { colors } = useTheme();
  const { transactionId } = useLocalSearchParams<{ transactionId: string }>();
  const household = useHousehold();
  const transactions = useTransactions(household.data);
  const balances = useAccountBalances(household.data);
  const categories = useCategories(household.data);
  const deleteTransaction = useDeleteTransaction();
  const transaction = transactions.data?.find((item) => item.id === transactionId);

  const deleteNow = () => {
    if (household.data === undefined) {
      return;
    }
    deleteTransaction.mutate({ householdId: household.data, transactionId }, { onSuccess: () => router.back() });
  };

  const confirmDelete = () =>
    Alert.alert('Eliminar movimiento', 'No se puede deshacer y cambiará el saldo de tus cuentas.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: deleteNow },
    ]);

  const renderBody = () => {
    if (household.isError || transactions.isError || balances.isError || categories.isError) {
      return (
        <Text style={[typography.body, styles.message, { color: colors.secondaryLabel }]}>
          No se pudo cargar el movimiento.
        </Text>
      );
    }
    if (transactions.data === undefined || balances.data === undefined || categories.data === undefined) {
      return <ActivityIndicator />;
    }
    if (transaction === undefined) {
      return (
        <Text style={[typography.body, styles.message, { color: colors.secondaryLabel }]}>
          No se encontró el movimiento.
        </Text>
      );
    }

    const display = toDisplayAmount(transaction.type, transaction.amountCents);
    const accountName = balances.data.find((account) => account.accountId === transaction.accountId)?.name;
    const destinationName = balances.data.find((account) => account.accountId === transaction.destinationAccountId)?.name;
    const categoryName = categories.data.find((category) => category.id === transaction.categoryId)?.name;
    const detailTextStyle = [typography.body, { color: colors.secondaryLabel }];

    return (
      <>
        <GroupedSection>
          <ListRow title="Monto" trailing={<AmountText cents={display.cents} tone={display.tone} />} />
          <ListRow
            title="Fecha"
            trailing={<Text style={detailTextStyle}>{formatIsoDate(transaction.transactionDate)}</Text>}
          />
          {accountName === undefined ? null : (
            <ListRow
              title={transaction.destinationAccountId === null ? 'Cuenta' : 'Desde'}
              trailing={<Text style={detailTextStyle}>{accountName}</Text>}
            />
          )}
          {destinationName === undefined ? null : (
            <ListRow title="Hacia" trailing={<Text style={detailTextStyle}>{destinationName}</Text>} />
          )}
          {categoryName === undefined ? null : (
            <ListRow title="Categoría" trailing={<Text style={detailTextStyle}>{categoryName}</Text>} />
          )}
          {transaction.description === null ? null : (
            <ListRow title="Descripción" subtitle={transaction.description} />
          )}
        </GroupedSection>

        <PrimaryButton
          title="Eliminar"
          isDestructive
          onPress={confirmDelete}
          disabled={deleteTransaction.isPending || household.data === undefined}
        />

        {deleteTransaction.isError ? (
          <Text style={[typography.footnote, styles.feedback, { color: colors.destructive }]}>
            No se pudo eliminar el movimiento.
          </Text>
        ) : null}
      </>
    );
  };

  return (
    <Screen title={transaction === undefined ? 'Movimiento' : transactionTypeLabels[transaction.type]}>
      {renderBody()}
    </Screen>
  );
};

const styles = StyleSheet.create({
  message: { textAlign: 'center' },
  feedback: { paddingHorizontal: spacing.lg },
});

export default TransactionDetail;
