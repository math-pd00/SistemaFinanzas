import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';

import { AmountText } from '@/components/ui/AmountText';
import { GroupedSection } from '@/components/ui/GroupedSection';
import { ListRow } from '@/components/ui/ListRow';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import {
  adjustBalanceSchema,
  type AdjustBalanceInput,
  type AdjustBalanceValues,
} from '@/features/accounts/accountSchemas';
import { isDebt, useAccountBalances } from '@/features/accounts/useAccountBalances';
import { useAdjustBalance } from '@/features/accounts/useAdjustBalance';
import { useHousehold } from '@/features/household/useHousehold';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

// The account comes from the cached balances list, so opening it from the list needs no extra request.
const AccountDetail = () => {
  const { colors } = useTheme();
  const { accountId } = useLocalSearchParams<{ accountId: string }>();
  const household = useHousehold();
  const balances = useAccountBalances(household.data);
  const adjustBalance = useAdjustBalance();
  const account = balances.data?.find((balance) => balance.accountId === accountId);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdjustBalanceInput, unknown, AdjustBalanceValues>({
    resolver: zodResolver(adjustBalanceSchema),
    defaultValues: { targetBalance: '' },
  });

  const onSubmit = ({ targetBalance }: AdjustBalanceValues) => {
    if (household.data === undefined) {
      return;
    }
    adjustBalance.mutate(
      { householdId: household.data, accountId, targetCents: targetBalance },
      {
        onSuccess: (deltaCents) => {
          if (deltaCents !== 0) {
            reset();
          }
        },
      },
    );
  };

  const renderBody = () => {
    if (household.isError || balances.isError) {
      return (
        <Text style={[typography.body, styles.message, { color: colors.secondaryLabel }]}>
          No se pudo cargar la cuenta.
        </Text>
      );
    }
    if (balances.data === undefined) {
      return <ActivityIndicator />;
    }
    if (account === undefined) {
      return (
        <Text style={[typography.body, styles.message, { color: colors.secondaryLabel }]}>
          No se encontró la cuenta.
        </Text>
      );
    }

    const isLiability = account.type === 'credit_card' || account.type === 'loan';
    const balanceTone = isDebt(account) ? 'destructive' : 'label';
    const detailTextStyle = [typography.body, { color: colors.secondaryLabel }];

    return (
      <>
        <GroupedSection>
          <ListRow
            title={isLiability ? 'Deuda actual' : 'Saldo'}
            trailing={<AmountText cents={account.balanceCents} tone={balanceTone} />}
          />
          {account.type === 'credit_card' && account.availableCreditCents !== null ? (
            <ListRow title="Disponible" trailing={<AmountText cents={account.availableCreditCents} />} />
          ) : null}
        </GroupedSection>

        <GroupedSection header="Ajustar saldo" footer="Se registrará un ajuste por la diferencia.">
          <Controller
            control={control}
            name="targetBalance"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label={isLiability ? 'Deuda real' : 'Saldo real'}
                placeholder="0.00"
                keyboardType="decimal-pad"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.targetBalance?.message}
              />
            )}
          />
        </GroupedSection>

        <PrimaryButton
          title="Ajustar saldo"
          onPress={handleSubmit(onSubmit)}
          disabled={adjustBalance.isPending || household.data === undefined}
        />

        {adjustBalance.isSuccess && adjustBalance.data === 0 ? (
          <Text style={[typography.footnote, styles.feedback, { color: colors.secondaryLabel }]}>
            Ese ya es el saldo actual.
          </Text>
        ) : null}
        {adjustBalance.isError ? (
          <Text style={[typography.footnote, styles.feedback, { color: colors.destructive }]}>
            No se pudo ajustar el saldo.
          </Text>
        ) : null}

        <GroupedSection header="Detalles">
          {account.institution !== null ? (
            <ListRow title="Institución" trailing={<Text style={detailTextStyle}>{account.institution}</Text>} />
          ) : null}
          {account.holder !== null ? (
            <ListRow title="Titular" trailing={<Text style={detailTextStyle}>{account.holder}</Text>} />
          ) : null}
          {account.creditLimitCents !== null ? (
            <ListRow title="Cupo" trailing={<AmountText cents={account.creditLimitCents} />} />
          ) : null}
          {account.type === 'credit_card' ? (
            <ListRow title="Sobregiro" trailing={<AmountText cents={account.overlimitCents} />} />
          ) : null}
          {account.statementDay !== null ? (
            <ListRow title="Día de corte" trailing={<Text style={detailTextStyle}>{account.statementDay}</Text>} />
          ) : null}
          {account.paymentDueDay !== null ? (
            <ListRow title="Día de pago" trailing={<Text style={detailTextStyle}>{account.paymentDueDay}</Text>} />
          ) : null}
        </GroupedSection>
      </>
    );
  };

  return <Screen title={account?.name ?? 'Cuenta'}>{renderBody()}</Screen>;
};

const styles = StyleSheet.create({
  message: { textAlign: 'center' },
  feedback: { paddingHorizontal: spacing.lg },
});

export default AccountDetail;
