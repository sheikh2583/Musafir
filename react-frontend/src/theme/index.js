// Theme colors and responsive utilities
import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Color palette
export const colors = {
  primary: '#4A90E2',
  secondary: '#50C878',
  accent: '#FFD700',
  background: '#F5F7FA',
  card: '#FFFFFF',
  text: {
    primary: '#2C3E50',
    secondary: '#7F8C8D',
    light: '#BDC3C7',
    white: '#FFFFFF',
  },
  border: '#E1E8ED',
  error: '#E74C3C',
  success: '#2ECC71',
  warning: '#F39C12',
  info: '#3498DB',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

// Responsive dimensions
export const responsive = {
  width,
  height,
  isSmallDevice: width < 375,
  isMediumDevice: width >= 375 && width < 768,
  isLargeDevice: width >= 768,
  isTablet: width >= 768,
  
  // Responsive spacing
  scale: (size) => (width / 375) * size,
  verticalScale: (size) => (height / 812) * size,
  moderateScale: (size, factor = 0.5) => size + (responsive.scale(size) - size) * factor,
};

// Typography
export const typography = {
  h1: {
    fontSize: responsive.moderateScale(32),
    fontWeight: 'bold',
    lineHeight: responsive.moderateScale(40),
  },
  h2: {
    fontSize: responsive.moderateScale(28),
    fontWeight: 'bold',
    lineHeight: responsive.moderateScale(36),
  },
  h3: {
    fontSize: responsive.moderateScale(24),
    fontWeight: '600',
    lineHeight: responsive.moderateScale(32),
  },
  h4: {
    fontSize: responsive.moderateScale(20),
    fontWeight: '600',
    lineHeight: responsive.moderateScale(28),
  },
  body: {
    fontSize: responsive.moderateScale(16),
    lineHeight: responsive.moderateScale(24),
  },
  bodySmall: {
    fontSize: responsive.moderateScale(14),
    lineHeight: responsive.moderateScale(20),
  },
  caption: {
    fontSize: responsive.moderateScale(12),
    lineHeight: responsive.moderateScale(16),
  },
};

// Spacing
export const spacing = {
  xs: responsive.scale(4),
  sm: responsive.scale(8),
  md: responsive.scale(16),
  lg: responsive.scale(24),
  xl: responsive.scale(32),
  xxl: responsive.scale(48),
};

// Border radius
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 9999,
};

// Shadows
export const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export default {
  colors,
  responsive,
  typography,
  spacing,
  borderRadius,
  shadows,
};
