import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { supabase } from '@/lib/supabase';

// Placeholder until accounts/transactions land; signing out lets Stack.Protected return to sign-in.
const Summary = () => {
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setSignOutError(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setSignOutError('No se pudo cerrar sesión. Inténtalo de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumen</Text>
      {signOutError !== null ? <Text style={styles.error}>{signOutError}</Text> : null}
      <Button title="Cerrar sesión" onPress={handleSignOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  title: { fontSize: 24, fontWeight: '600' },
  error: { color: '#c62828' },
});

export default Summary;
