import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useSession } from '@/features/auth/useSession';

// Separate from _layout.tsx because useSession must run inside SessionProvider.
interface IRootNavigatorProps {
  areFontsReady: boolean;
}

export const RootNavigator = ({ areFontsReady }: IRootNavigatorProps) => {
  const { session, isLoading } = useSession();
  const isReady = areFontsReady && !isLoading;

  useEffect(() => {
    if (isReady) {
      SplashScreen.hide();
    }
  }, [isReady]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={session !== null}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={session === null}>
        <Stack.Screen name="(auth)/sign-in" />
        <Stack.Screen name="(auth)/sign-up" />
      </Stack.Protected>
    </Stack>
  );
};
