import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';

import { RootNavigator } from '@/components/RootNavigator';
import { SessionProvider } from '@/features/auth/SessionProvider';

// Keep the native splash up until RootNavigator knows whether a stored session exists.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const RootLayout = () => (
  <QueryClientProvider client={queryClient}>
    <SessionProvider>
      <RootNavigator />
    </SessionProvider>
  </QueryClientProvider>
);

export default RootLayout;
