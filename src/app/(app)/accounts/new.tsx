import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, type KeyboardTypeOptions } from 'react-native';

import { GroupedSection } from '@/components/ui/GroupedSection';
import { ListRow } from '@/components/ui/ListRow';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import {
  accountFormSchema,
  toAccountInsert,
  type AccountFormInput,
  type AccountFormValues,
} from '@/features/accounts/accountSchemas';
import { accountTypeLabels } from '@/features/accounts/accountTypeLabels';
import { useCreateAccount } from '@/features/accounts/useCreateAccount';
import { useHousehold } from '@/features/household/useHousehold';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';
import { Constants, type Enums } from '@/types/database.types';

// Fields per type mirror toAccountInsert so the form never collects values it will not save.
type AccountField = keyof AccountFormInput;

const TYPE_FIELDS: Record<Enums<'account_type'>, AccountField[]> = {
  credit_card: [
    'name',
    'holder',
    'institution',
    'creditLimit',
    'overlimit',
    'statementDay',
    'paymentDueDay',
    'annualRate',
  ],
  loan: ['name', 'institution', 'annualRate'],
  bank_account: ['name', 'institution'],
  cash: ['name', 'institution'],
};

const FIELD_PROPS: Record<AccountField, { label: string; placeholder: string; keyboardType?: KeyboardTypeOptions }> = {
  name: { label: 'Nombre', placeholder: 'Obligatorio' },
  holder: { label: 'Titular', placeholder: 'Opcional' },
  institution: { label: 'Institución', placeholder: 'Opcional' },
  creditLimit: { label: 'Cupo', placeholder: 'Opcional', keyboardType: 'decimal-pad' },
  overlimit: { label: 'Sobregiro', placeholder: 'Opcional', keyboardType: 'decimal-pad' },
  statementDay: { label: 'Día de corte', placeholder: 'Opcional', keyboardType: 'number-pad' },
  paymentDueDay: { label: 'Día de pago', placeholder: 'Opcional', keyboardType: 'number-pad' },
  annualRate: { label: 'Tasa anual (%)', placeholder: 'Opcional', keyboardType: 'decimal-pad' },
};

const NewAccount = () => {
  const { colors } = useTheme();
  const household = useHousehold();
  const createAccount = useCreateAccount();
  const [selectedType, setSelectedType] = useState<Enums<'account_type'> | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountFormInput, unknown, AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: '',
      institution: '',
      holder: '',
      creditLimit: '',
      overlimit: '',
      statementDay: '',
      paymentDueDay: '',
      annualRate: '',
    },
  });

  const handleChangeType = () => {
    reset();
    createAccount.reset();
    setSelectedType(null);
  };

  const onSubmit = (values: AccountFormValues) => {
    if (selectedType === null || household.data === undefined) {
      return;
    }
    createAccount.mutate(toAccountInsert(values, selectedType, household.data), {
      onSuccess: () => router.back(),
    });
  };

  return (
    <Screen title="Nueva cuenta">
      {selectedType === null ? (
        <GroupedSection header="Tipo de cuenta">
          {Constants.public.Enums.account_type.map((type) => (
            <ListRow key={type} title={accountTypeLabels[type]} onPress={() => setSelectedType(type)} />
          ))}
        </GroupedSection>
      ) : (
        <>
          <GroupedSection>
            <ListRow title={accountTypeLabels[selectedType]} subtitle="Tipo de cuenta" onPress={handleChangeType} />
          </GroupedSection>

          <GroupedSection>
            {TYPE_FIELDS[selectedType].map((fieldName) => (
              <Controller
                key={fieldName}
                control={control}
                name={fieldName}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    label={FIELD_PROPS[fieldName].label}
                    placeholder={FIELD_PROPS[fieldName].placeholder}
                    keyboardType={FIELD_PROPS[fieldName].keyboardType}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors[fieldName]?.message}
                  />
                )}
              />
            ))}
          </GroupedSection>

          {createAccount.isError ? (
            <Text style={[typography.footnote, styles.error, { color: colors.destructive }]}>
              No se pudo crear la cuenta.
            </Text>
          ) : null}

          <PrimaryButton
            title="Crear cuenta"
            onPress={handleSubmit(onSubmit)}
            disabled={createAccount.isPending || household.data === undefined}
          />
        </>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  error: { paddingHorizontal: spacing.lg },
});

export default NewAccount;
