import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import { getAuthErrorMessage } from '@/features/auth/authErrorMessages';
import { signUpSchema, type SignUpValues } from '@/features/auth/schemas';
import { supabase } from '@/lib/supabase';

// With email confirmation enabled signUp returns no session, so the user is told to check their inbox.
const SignUp = () => {
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
      <View style={styles.container}>
        <Text>Te enviamos un correo para confirmar tu cuenta.</Text>
        <Link href="/sign-in" style={styles.link}>
          Volver a iniciar sesión
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Correo"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
        )}
      />
      {errors.email ? <Text style={styles.error}>{errors.email.message}</Text> : null}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            autoComplete="new-password"
            secureTextEntry
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
        )}
      />
      {errors.password ? <Text style={styles.error}>{errors.password.message}</Text> : null}

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            autoComplete="new-password"
            secureTextEntry
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
        )}
      />
      {errors.confirmPassword ? <Text style={styles.error}>{errors.confirmPassword.message}</Text> : null}

      {serverError !== null ? <Text style={styles.error}>{serverError}</Text> : null}

      <Button
        title={isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      />
      <Link href="/sign-in" style={styles.link}>
        ¿Ya tienes cuenta? Inicia sesión
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 },
  error: { color: '#c62828' },
  link: { marginTop: 8, textAlign: 'center', color: '#1565c0' },
});

export default SignUp;
