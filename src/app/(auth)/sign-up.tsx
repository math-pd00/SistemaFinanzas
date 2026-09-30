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
import { signUpSchema, type SignUpValues } from '@/features/auth/schemas';
import { supabase } from '@/lib/supabase';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

// With email confirmation enabled signUp returns no session, so the user is told to check their inbox.
const SignUp = () => {
  const { colors } = useTheme();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isConfirmationPending, setIsConfirmationPending] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async ({ email, password }: SignUpValues) => {
    setServerError(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setServerError(getAuthErrorMessage(error));
      return;
    }
    if (!data.session) {
      setIsConfirmationPending(true);
    }
  };

  if (isConfirmationPending) {
    return (
      <Screen title="Registro">
        <Text style={[typography.body, { color: colors.label }]}>Te enviamos un correo para confirmar tu cuenta.</Text>
        <Link href="/sign-in" style={[typography.body, styles.link, { color: colors.tint }]}>
          Volver a iniciar sesión
        </Link>
      </Screen>
    );
  }

  return (
    <Screen title="Registro">
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
              autoComplete="new-password"
              secureTextEntry
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.password?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              placeholder="Confirmar contraseña"
              autoComplete="new-password"
              secureTextEntry
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.confirmPassword?.message}
            />
          )}
        />
      </GroupedSection>

      {serverError !== null ? (
        <Text style={[typography.footnote, styles.serverError, { color: colors.destructive }]}>{serverError}</Text>
      ) : null}

      <PrimaryButton
        title={isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      />
      <Link href="/sign-in" style={[typography.body, styles.link, { color: colors.tint }]}>
        ¿Ya tienes cuenta? Inicia sesión
      </Link>
    </Screen>
  );
};

const styles = StyleSheet.create({
  serverError: { paddingHorizontal: spacing.lg },
  link: { textAlign: 'center' },
});

export default SignUp;
