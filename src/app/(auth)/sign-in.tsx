import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import { getAuthErrorMessage } from '@/features/auth/authErrorMessages';
import { signInSchema, type SignInValues } from '@/features/auth/schemas';
import { supabase } from '@/lib/supabase';

// No manual redirect on success: Stack.Protected swaps screens when the session appears.
const SignIn = () => {
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
            autoComplete="current-password"
            secureTextEntry
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
        )}
      />
      {errors.password ? <Text style={styles.error}>{errors.password.message}</Text> : null}

      {serverError !== null ? <Text style={styles.error}>{serverError}</Text> : null}

      <Button
        title={isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      />
      <Link href="/sign-up" style={styles.link}>
        ¿No tienes cuenta? Regístrate
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

export default SignIn;
