import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';

import { GroupedSection } from '@/components/ui/GroupedSection';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { getAuthErrorMessage } from '@/features/auth/authErrorMessages';
import { signInSchema, type SignInValues } from '@/features/auth/schemas';
import { supabase } from '@/lib/supabase';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

// No manual redirect on success: Stack.Protected swaps screens when the session appears.
const SignIn = () => {
  const { colors } = useTheme();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async ({ email, password }: SignInValues) => {
    setServerError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setServerError(getAuthErrorMessage(error));
    }
  };

  return (
    <Screen title="Iniciar sesión">
      <GroupedSection>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              placeholder="Correo"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              placeholder="Contraseña"
              autoComplete="current-password"
              secureTextEntry
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.password?.message}
            />
          )}
        />
      </GroupedSection>

      {serverError !== null ? (
        <Text style={[typography.footnote, styles.serverError, { color: colors.destructive }]}>{serverError}</Text>
      ) : null}

      <PrimaryButton
        title={isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      />
      <Link href="/sign-up" style={[typography.body, styles.link, { color: colors.tint }]}>
        ¿No tienes cuenta? Regístrate
      </Link>
    </Screen>
  );
};

const styles = StyleSheet.create({
  serverError: { paddingHorizontal: spacing.lg },
  link: { textAlign: 'center' },
});

export default SignIn;
