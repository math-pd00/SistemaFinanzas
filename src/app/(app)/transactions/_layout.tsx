import { Stack } from 'expo-router';

// Stack so transactions/new is presented as a modal over the list.
const TransactionsLayout = () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="index" />
    <Stack.Screen name="new" options={{ presentation: 'modal' }} />
  </Stack>
);

export default TransactionsLayout;
