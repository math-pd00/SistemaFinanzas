import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, RefreshControl, StyleSheet, Text } from 'react-native';

import { AmountText } from '@/components/ui/AmountText';
import { GroupedSection } from '@/components/ui/GroupedSection';
import { ListRow } from '@/components/ui/ListRow';
import { Screen } from '@/components/ui/Screen';
import { accountTypeLabels } from '@/features/accounts/accountTypeLabels';
import { useAccountBalances, type IAccountBalance } from '@/features/accounts/useAccountBalances';
import { useHousehold } from '@/features/household/useHousehold';
import { typography } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';
import { Constants } from '@/types/database.types';
import { formatCents } from '@/utils/money';

// Credit cards and loans store debt as a positive balance, so positive values render as destructive.
const isDebt = (account: IAccountBalance): boolean =>
  (account.type === 'credit_card' || account.type === 'loan') && account.balanceCents > 0;

const buildSubtitle = (account: IAccountBalance): string | undefined => {
  const parts: string[] = [];
  if (account.institution) {
    parts.push(account.institution);
  }
  if (account.type === 'credit_card' && account.availableCreditCents !== null) {
    parts.push(`Disponible ${formatCents(account.availableCreditCents)}`);
  }

  return parts.length > 0 ? parts.join(' · ') : undefined;
};

const Accounts = () => {
  const { colors } = useTheme();
  const household = useHousehold();
  const balances = useAccountBalances(household.data);
  const accounts = balances.data;

  const renderBody = () => {
    if (household.isError || balances.isError) {
      return (
        <Text style={[typography.body, styles.message, { color: colors.secondaryLabel }]}>
          No se pudieron cargar las cuentas.
        </Text>
      );
    }
    if (accounts === undefined) {
      return <ActivityIndicator />;
    }
    if (accounts.length === 0) {
      return (
        <Text style={[typography.body, styles.message, { color: colors.secondaryLabel }]}>Aún no tienes cuentas.</Text>
      );
    }

    return Constants.public.Enums.account_type.map((type) => {
      const group = accounts.filter((account) => account.type === type);
      if (group.length === 0) {
        return null;
      }

      return (
        <GroupedSection key={type} header={accountTypeLabels[type]}>
          {group.map((account) => (
            <ListRow
              key={account.accountId}
              title={account.name}
              subtitle={buildSubtitle(account)}
              trailing={<AmountText cents={account.balanceCents} tone={isDebt(account) ? 'destructive' : 'label'} />}
            />
          ))}
        </GroupedSection>
      );
    });
  };

  return (
    <Screen
      title="Cuentas"
      headerRight={
        <Pressable
          onPress={() => router.push('/accounts/new')}
          accessibilityRole="button"
          accessibilityLabel="Agregar cuenta"
          hitSlop={12}
        >
          <Ionicons name="add" size={28} color={colors.tint} />
        </Pressable>
      }
      refreshControl={
        household.data === undefined ? undefined : (
          <RefreshControl refreshing={balances.isRefetching} onRefresh={balances.refetch} />
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

export default Accounts;
