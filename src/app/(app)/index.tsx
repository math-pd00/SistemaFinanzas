import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { supabase } from '@/lib/supabase';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

// Placeholder until accounts/transactions land; signing out lets Stack.Protected return to sign-in.
const Summary = () => {
  const { colors } = useTheme();
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setSignOutError(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setSignOutError('No se pudo cerrar sesión. Inténtalo de nuevo.');
    }
  };

  return (
    <Screen title="Resumen">
      {signOutError !== null ? (
        <Text style={[typography.footnote, styles.error, { color: colors.destructive }]}>{signOutError}</Text>
      ) : null}
      <PrimaryButton title="Cerrar sesión" onPress={handleSignOut} isDestructive />
    </Screen>
  );
};

const styles = StyleSheet.create({
  error: { paddingHorizontal: spacing.lg },
});

export default Summary;
