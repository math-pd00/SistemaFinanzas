import { StyleSheet } from 'react-native';

// Weight comes from the family name registered in _layout.tsx, so no fontWeight is set.
export const fontFamily = {
  regular: 'Inter_400Regular',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const typography = StyleSheet.create({
  largeTitle: { fontFamily: fontFamily.bold, fontSize: 34, lineHeight: 41 },
  title2: { fontFamily: fontFamily.bold, fontSize: 22, lineHeight: 28 },
  headline: { fontFamily: fontFamily.semibold, fontSize: 17, lineHeight: 22 },
  body: { fontFamily: fontFamily.regular, fontSize: 17, lineHeight: 22 },
  subheadline: { fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 20 },
  footnote: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 18 },
});
