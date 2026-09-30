import { Stack } from 'expo-router';

// Stack so accounts/new (Batch 3) can be presented as a modal over the list.
const AccountsLayout = () => <Stack screenOptions={{ headerShown: false }} />;

export default AccountsLayout;
