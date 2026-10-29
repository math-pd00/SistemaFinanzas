import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { fontFamily } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

// Headers are hidden because every screen draws its own large title.
const AppLayout = () => {
  const { colors } = useTheme();
  const tabIconColor = (focused: boolean) => (focused ? colors.tint : colors.secondaryLabel);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.secondaryLabel,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.separator },
        tabBarLabelStyle: { fontFamily: fontFamily.semibold, fontSize: 10 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Resumen',
          tabBarIcon: ({ focused, size }) => <Ionicons name="pie-chart-outline" color={tabIconColor(focused)} size={size} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Movimientos',
          tabBarIcon: ({ focused, size }) => <Ionicons name="receipt-outline" color={tabIconColor(focused)} size={size} />,
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Cuentas',
          tabBarIcon: ({ focused, size }) => <Ionicons name="wallet-outline" color={tabIconColor(focused)} size={size} />,
        }}
      />
    </Tabs>
  );
};

export default AppLayout;
