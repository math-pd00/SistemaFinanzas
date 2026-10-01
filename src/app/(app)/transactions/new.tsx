import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';

import { GroupedSection } from '@/components/ui/GroupedSection';
import { ListRow } from '@/components/ui/ListRow';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { useAccountBalances } from '@/features/accounts/useAccountBalances';
import { useCategories } from '@/features/categories/useCategories';
import { useHousehold } from '@/features/household/useHousehold';
import {
  transactionFormSchema,
  type TransactionFormInput,
  type TransactionFormValues,
} from '@/features/transactions/transactionSchemas';
import { transactionTypeLabels } from '@/features/transactions/transactionTypeLabels';
import { useCreateTransaction } from '@/features/transactions/useCreateTransaction';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

type EntryType = 'expense' | 'income';

const ENTRY_TYPES: EntryType[] = ['expense', 'income'];

const NewTransaction = () => {
  const { colors } = useTheme();
  const household = useHousehold();
  const balances = useAccountBalances(household.data);
  const categories = useCategories(household.data);
  const createTransaction = useCreateTransaction();
  const [selectedType, setSelectedType] = useState<EntryType | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormInput, unknown, TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      amount: '',
      description: '',
      accountId: '',
      categoryId: '',
    },
  });

  const handleChangeType = () => {
    reset();
    createTransaction.reset();
    setSelectedType(null);
  };

  const onSubmit = (values: TransactionFormValues) => {
    if (selectedType === null || household.data === undefined) {
      return;
    }
    createTransaction.mutate(
      {
        householdId: household.data,
        type: selectedType,
        accountId: values.accountId,
        categoryId: values.categoryId,
        amountCents: values.amount,
        description: values.description,
      },
      { onSuccess: () => router.back() },
    );
  };

  return (
    <Screen title="Nuevo movimiento">
      {selectedType === null ? (
        <GroupedSection header="Tipo de movimiento">
          {ENTRY_TYPES.map((type) => (
            <ListRow key={type} title={transactionTypeLabels[type]} onPress={() => setSelectedType(type)} />
          ))}
        </GroupedSection>
      ) : (
        <>
          <GroupedSection>
            <ListRow
              title={transactionTypeLabels[selectedType]}
              subtitle="Tipo de movimiento"
              onPress={handleChangeType}
            />
          </GroupedSection>

          <GroupedSection footer="Fecha: hoy">
            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  label="Monto"
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.amount?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  label="Descripción"
                  placeholder="Opcional"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.description?.message}
                />
              )}
            />
          </GroupedSection>

          <Controller
            control={control}
            name="accountId"
            render={({ field: { onChange, value } }) => (
              <>
                <GroupedSection header="Cuenta">
                  {(balances.data ?? []).map((account) => (
                    <ListRow
                      key={account.accountId}
                      title={account.name}
                      accessory={value === account.accountId ? 'checkmark' : 'none'}
                      onPress={() => onChange(account.accountId)}
                    />
                  ))}
                </GroupedSection>
                {errors.accountId ? (
                  <Text style={[typography.footnote, styles.error, { color: colors.destructive }]}>
                    {errors.accountId.message}
                  </Text>
                ) : null}
              </>
            )}
          />

          <Controller
            control={control}
            name="categoryId"
            render={({ field: { onChange, value } }) => (
              <>
                <GroupedSection header="Categoría">
                  {(categories.data ?? [])
                    .filter((category) => category.type === selectedType)
                    .map((category) => (
                      <ListRow
                        key={category.id}
                        title={category.name}
                        accessory={value === category.id ? 'checkmark' : 'none'}
                        onPress={() => onChange(category.id)}
                      />
                    ))}
                </GroupedSection>
                {errors.categoryId ? (
                  <Text style={[typography.footnote, styles.error, { color: colors.destructive }]}>
                    {errors.categoryId.message}
                  </Text>
                ) : null}
              </>
            )}
          />

          {createTransaction.isError ? (
            <Text style={[typography.footnote, styles.error, { color: colors.destructive }]}>
              No se pudo guardar el movimiento.
            </Text>
          ) : null}

          <PrimaryButton
            title="Guardar"
            onPress={handleSubmit(onSubmit)}
            disabled={createTransaction.isPending || household.data === undefined}
          />
        </>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  error: { paddingHorizontal: spacing.lg },
});

export default NewTransaction;
