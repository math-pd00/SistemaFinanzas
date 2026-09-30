import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useSession } from '@/features/auth/useSession';

// Separate from _layout.tsx because useSession must run inside SessionProvider.
export const RootNavigator = () => {
  const { session, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hide();
    }
  }, [isLoading]);

  return (
    <Stack>
      <Stack.Protected guard={session !== null}>
        <Stack.Screen name="(app)/index" options={{ title: 'Resumen' }} />
      </Stack.Protected>
      <Stack.Protected guard={session === null}>
        <Stack.Screen name="(auth)/sign-in" options={{ title: 'Iniciar sesión' }} />
        <Stack.Screen name="(auth)/sign-up" options={{ title: 'Registro' }} />
      </Stack.Protected>
    </Stack>
  );
};
