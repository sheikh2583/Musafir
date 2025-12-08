import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, responsive } from '../theme';

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo/Icon Section */}
          <View style={styles.logoContainer}>
            <Ionicons name="compass" size={responsive.scale(100)} color={colors.text.white} />
            <Text style={styles.title}>Musafir</Text>
            <Text style={styles.subtitle}>Your Islamic Journey Companion</Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              Connect with fellow Muslims, discover Islamic content, and strengthen your faith journey
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={20} color={colors.text.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>I Already Have an Account</Text>
            </TouchableOpacity>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="people-outline" size={24} color={colors.text.white} />
              <Text style={styles.featureText}>Community</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="book-outline" size={24} color={colors.text.white} />
              <Text style={styles.featureText}>Learn</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="heart-outline" size={24} color={colors.text.white} />
              <Text style={styles.featureText}>Connect</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: responsive.verticalScale(40),
  },
  title: {
    ...typography.h1,
    color: colors.text.white,
    marginTop: spacing.md,
    fontWeight: 'bold',
  },
  subtitle: {
    ...typography.body,
    color: colors.text.white,
    marginTop: spacing.sm,
    opacity: 0.9,
  },
  descriptionContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.text.white,
    textAlign: 'center',
    opacity: 0.85,
    lineHeight: 24,
  },
  buttonContainer: {
    gap: spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.text.white,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.text.white,
  },
  primaryButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    ...typography.body,
    color: colors.text.white,
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.lg,
  },
  featureItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  featureText: {
    ...typography.bodySmall,
    color: colors.text.white,
    opacity: 0.9,
  },
});

export default WelcomeScreen;
