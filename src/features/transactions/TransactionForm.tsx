import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform, StyleSheet, Text } from 'react-native';

import { GroupedSection } from '@/components/ui/GroupedSection';
import { ListRow } from '@/components/ui/ListRow';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { TextField } from '@/components/ui/TextField';
import { useAccountBalances } from '@/features/accounts/useAccountBalances';
import { useCategories } from '@/features/categories/useCategories';
import { useHousehold } from '@/features/household/useHousehold';
import {
  createTransactionFormSchema,
  type TransactionFormInput,
  type TransactionFormValues,
} from '@/features/transactions/transactionSchemas';
import { useCreateTransaction, type TransactionEntryType } from '@/features/transactions/useCreateTransaction';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';
import { Constants, type Enums } from '@/types/database.types';
import { formatIsoDate, toLocalIsoDate } from '@/utils/date';

// Money leaves bank or cash accounts toward cards and loans; interest only accrues on debt accounts.
type AccountType = Enums<'account_type'>;
type SelectionField = 'accountId' | 'destinationAccountId' | 'categoryId';

interface IEntryRules {
  originTypes: readonly AccountType[];
  destinationTypes: readonly AccountType[] | null;
  hasCategory: boolean;
}

interface ISelectionOption {
  id: string;
  name: string;
}

interface ITransactionFormProps {
  type: TransactionEntryType;
}

const ALL_ACCOUNT_TYPES = Constants.public.Enums.account_type;
const MONEY_ACCOUNT_TYPES: readonly AccountType[] = ['bank_account', 'cash'];
const DEBT_ACCOUNT_TYPES: readonly AccountType[] = ['credit_card', 'loan'];

const ENTRY_RULES: Record<TransactionEntryType, IEntryRules> = {
  expense: { originTypes: ALL_ACCOUNT_TYPES, destinationTypes: null, hasCategory: true },
  income: { originTypes: ALL_ACCOUNT_TYPES, destinationTypes: null, hasCategory: true },
  payment: { originTypes: MONEY_ACCOUNT_TYPES, destinationTypes: DEBT_ACCOUNT_TYPES, hasCategory: false },
  transfer: { originTypes: MONEY_ACCOUNT_TYPES, destinationTypes: MONEY_ACCOUNT_TYPES, hasCategory: false },
  interest: { originTypes: DEBT_ACCOUNT_TYPES, destinationTypes: null, hasCategory: false },
  fee: { originTypes: ALL_ACCOUNT_TYPES, destinationTypes: null, hasCategory: false },
};

export const TransactionForm = ({ type }: ITransactionFormProps) => {
  const { colors } = useTheme();
  const household = useHousehold();
  const balances = useAccountBalances(household.data);
  const categories = useCategories(household.data);
  const createTransaction = useCreateTransaction();
  const [today] = useState(() => new Date());
  const [transactionDate, setTransactionDate] = useState(today);
  const rules = ENTRY_RULES[type];
  const hasDestination = rules.destinationTypes !== null;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TransactionFormInput, unknown, TransactionFormValues>({
    resolver: zodResolver(createTransactionFormSchema({ hasCategory: rules.hasCategory, hasDestination })),
    defaultValues: {
      amount: '',
      description: '',
      accountId: '',
      destinationAccountId: '',
      categoryId: '',
    },
  });

  const toAccountOptions = (accountTypes: readonly AccountType[]): ISelectionOption[] =>
    (balances.data ?? [])
      .filter((account) => accountTypes.includes(account.type))
      .map((account) => ({ id: account.accountId, name: account.name }));

  const categoryOptions = (categories.data ?? []).filter((category) => category.type === type);

  const onSubmit = (values: TransactionFormValues) => {
    if (household.data === undefined) {
      return;
    }
    createTransaction.mutate(
      {
        householdId: household.data,
        type,
        accountId: values.accountId,
        destinationAccountId: values.destinationAccountId,
        categoryId: values.categoryId,
        amountCents: values.amount,
        description: values.description,
        transactionDate: toLocalIsoDate(transactionDate),
      },
      { onSuccess: () => router.back() },
    );
  };

  const selectTransactionDate = (_event: DateTimePickerChangeEvent, selectedDate: Date) =>
    setTransactionDate(selectedDate);

  const openAndroidDatePicker = () =>
    DateTimePickerAndroid.open({
      value: transactionDate,
      mode: 'date',
      maximumDate: today,
      onValueChange: selectTransactionDate,
    });

  const renderSelection = (name: SelectionField, header: string, options: ISelectionOption[]) => {
    const errorMessage = errors[name]?.message;

    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <>
            <GroupedSection header={header}>
              {options.map((option) => (
                <ListRow
                  key={option.id}
                  title={option.name}
                  accessory={value === option.id ? 'checkmark' : 'none'}
                  onPress={() => onChange(option.id)}
                />
              ))}
            </GroupedSection>
            {errorMessage === undefined ? null : (
              <Text style={[typography.footnote, styles.error, { color: colors.destructive }]}>
                {errorMessage}
              </Text>
            )}
          </>
        )}
      />
    );
  };

  return (
    <>
      <GroupedSection>
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
        {Platform.OS === 'android' ? (
          <ListRow
            title="Fecha"
            trailing={
              <Text style={[typography.body, { color: colors.secondaryLabel }]}>
                {formatIsoDate(toLocalIsoDate(transactionDate))}
              </Text>
            }
            onPress={openAndroidDatePicker}
          />
        ) : (
          <ListRow
            title="Fecha"
            trailing={
              <DateTimePicker
                value={transactionDate}
                mode="date"
                display="compact"
                maximumDate={today}
                onValueChange={selectTransactionDate}
              />
            }
          />
        )}
      </GroupedSection>

      {renderSelection('accountId', hasDestination ? 'Desde' : 'Cuenta', toAccountOptions(rules.originTypes))}
      {rules.destinationTypes === null
        ? null
        : renderSelection('destinationAccountId', 'Hacia', toAccountOptions(rules.destinationTypes))}
      {rules.hasCategory ? renderSelection('categoryId', 'Categoría', categoryOptions) : null}

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
  );
};

const styles = StyleSheet.create({
  error: { paddingHorizontal: spacing.lg },
});
