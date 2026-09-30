import { useColorScheme } from 'react-native';

import { darkColors, lightColors, type IColors } from '@/theme/colors';

// Follows the system scheme (app.json userInterfaceStyle is "automatic").
export interface ITheme {
  colors: IColors;
  isDark: boolean;
}

export const useTheme = (): ITheme => {
  const isDark = useColorScheme() === 'dark';

  return { colors: isDark ? darkColors : lightColors, isDark };
};
