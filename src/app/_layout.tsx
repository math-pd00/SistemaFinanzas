import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { RootNavigator } from '@/components/RootNavigator';
import { SessionProvider } from '@/features/auth/SessionProvider';
import { fontFamily } from '@/theme/typography';

// Keep the native splash up until fonts and the stored session are both ready.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const RootLayout = () => {
  const [fontsLoaded, fontError] = useFonts({
    [fontFamily.regular]: Inter_400Regular,
    [fontFamily.semibold]: Inter_600SemiBold,
    [fontFamily.bold]: Inter_700Bold,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <RootNavigator areFontsReady={fontsLoaded || fontError !== null} />
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
