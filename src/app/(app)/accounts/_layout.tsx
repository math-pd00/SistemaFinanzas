import { Stack } from 'expo-router';

// Stack so accounts/new is presented as a modal over the list.
const AccountsLayout = () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="index" />
    <Stack.Screen name="new" options={{ presentation: 'modal' }} />
  </Stack>
);

export default AccountsLayout;
