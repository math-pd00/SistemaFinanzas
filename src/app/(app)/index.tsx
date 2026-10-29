import { useState } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, Text } from 'react-native';

import { AmountText } from '@/components/ui/AmountText';
import { GroupedSection } from '@/components/ui/GroupedSection';
import { ListRow } from '@/components/ui/ListRow';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { isDebt, useAccountBalances } from '@/features/accounts/useAccountBalances';
import { useCategories } from '@/features/categories/useCategories';
import { useHousehold } from '@/features/household/useHousehold';
import {
  getDebtAccounts,
  sumDebtCents,
  sumExpenseCents,
  sumMoneyCents,
  toExpenseLines,
} from '@/features/summary/summaryCalculations';
import { useMonthlyExpenses } from '@/features/transactions/useMonthlyExpenses';
import { supabase } from '@/lib/supabase';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';
import { formatMonthName, toMonthStartIsoDate } from '@/utils/date';
import { formatCents } from '@/utils/money';

// The month is fixed when the screen mounts; pulling down refreshes that month's totals.
const Summary = () => {
  const { colors } = useTheme();
  const [today] = useState(() => new Date());
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const household = useHousehold();
  const balances = useAccountBalances(household.data);
  const categories = useCategories(household.data);
  const monthlyExpenses = useMonthlyExpenses(household.data, toMonthStartIsoDate(today));

  const refetchAll = async () => {
    await Promise.all([balances.refetch(), categories.refetch(), monthlyExpenses.refetch()]);
  };

  const handleSignOut = async () => {
    setSignOutError(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setSignOutError('No se pudo cerrar sesión. Inténtalo de nuevo.');
    }
  };

  const renderBody = () => {
    if (household.isError || balances.isError || categories.isError || monthlyExpenses.isError) {
      return (
        <Text style={[typography.body, styles.message, { color: colors.secondaryLabel }]}>
          No se pudo cargar el resumen.
        </Text>
      );
    }
    if (balances.data === undefined || categories.data === undefined || monthlyExpenses.data === undefined) {
      return <ActivityIndicator />;
    }

    const debtCents = sumDebtCents(balances.data);

    return (
      <>
        <GroupedSection header="Dinero en cuentas">
          <ListRow title="Total" trailing={<AmountText cents={sumMoneyCents(balances.data)} />} />
        </GroupedSection>

        <GroupedSection header="Deudas">
          <ListRow
            title="Total"
            trailing={<AmountText cents={debtCents} tone={debtCents > 0 ? 'destructive' : 'label'} />}
          />
          {getDebtAccounts(balances.data).map((account) => (
            <ListRow
              key={account.accountId}
              title={account.name}
              subtitle={
                account.availableCreditCents === null
                  ? undefined
                  : `Disponible ${formatCents(account.availableCreditCents)}`
              }
              trailing={<AmountText cents={account.balanceCents} tone={isDebt(account) ? 'destructive' : 'label'} />}
            />
          ))}
        </GroupedSection>

        <GroupedSection header={`Gastos de ${formatMonthName(today)}`}>
          <ListRow title="Total" trailing={<AmountText cents={sumExpenseCents(monthlyExpenses.data)} />} />
          {toExpenseLines(monthlyExpenses.data, categories.data).map((line) => (
            <ListRow key={line.label} title={line.label} trailing={<AmountText cents={line.totalCents} />} />
          ))}
        </GroupedSection>
      </>
    );
  };

  return (
    <Screen
      title="Resumen"
      refreshControl={
        household.data === undefined ? undefined : (
          <RefreshControl refreshing={balances.isRefetching} onRefresh={refetchAll} />
        )
      }
    >
      {renderBody()}
      {signOutError !== null ? (
        <Text style={[typography.footnote, styles.error, { color: colors.destructive }]}>{signOutError}</Text>
      ) : null}
      <PrimaryButton title="Cerrar sesión" onPress={handleSignOut} isDestructive />
    </Screen>
  );
};

const styles = StyleSheet.create({
  message: { textAlign: 'center' },
  error: { paddingHorizontal: spacing.lg },
});

export default Summary;
