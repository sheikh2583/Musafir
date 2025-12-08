import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

const UserProfileScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const { user: currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const isOwnProfile = currentUser?._id === userId;

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await api.get(`/users/${userId}`);
      setUserData(response.data);
      setIsSubscribed(response.data.isSubscribed || false);
    } catch (error) {
      console.error('Fetch user error:', error);
      Alert.alert('Error', 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      if (isSubscribed) {
        await api.delete(`/users/${userId}/subscribe`);
        setIsSubscribed(false);
        Alert.alert('Success', 'Unsubscribed successfully');
      } else {
        await api.post(`/users/${userId}/subscribe`);
        setIsSubscribed(true);
        Alert.alert('Success', 'Subscribed successfully');
      }
      await fetchUserData();
    } catch (error) {
      console.error('Subscribe error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update subscription');
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="person-outline" size={64} color={colors.text.secondary} />
        <Text style={styles.errorText}>User not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.header}
        >
          <TouchableOpacity style={styles.backIconButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text.white} />
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userData?.name?.[0]?.toUpperCase() || 'U'}
                </Text>
              </View>
            </View>

            <Text style={styles.userName}>{userData?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{userData?.email || ''}</Text>

            {!isOwnProfile && (
              <TouchableOpacity
                style={[
                  styles.subscribeButton,
                  isSubscribed && styles.unsubscribeButton,
                  subscribing && styles.buttonDisabled,
                ]}
                onPress={handleSubscribe}
                disabled={subscribing}
              >
                {subscribing ? (
                  <ActivityIndicator color={colors.text.white} size="small" />
                ) : (
                  <>
                    <Ionicons
                      name={isSubscribed ? 'checkmark-circle' : 'person-add'}
                      size={20}
                      color={colors.text.white}
                    />
                    <Text style={styles.subscribeButtonText}>
                      {isSubscribed ? 'Subscribed' : 'Subscribe'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
            <Text style={styles.infoText}>
              {isOwnProfile
                ? 'This is your profile. Other users can subscribe to see your messages.'
                : isSubscribed
                ? "You're subscribed! You'll see this user's messages on your home feed."
                : 'Subscribe to see this user\'s messages on your home feed.'}
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="chatbubbles-outline" size={24} color={colors.primary} />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={24} color={colors.secondary} />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Subscribers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="calendar-outline" size={24} color={colors.info} />
              <Text style={styles.statValue}>
                {new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </Text>
              <Text style={styles.statLabel}>Joined</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  errorText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
  },
  backButtonText: {
    ...typography.body,
    color: colors.text.white,
    fontWeight: '600',
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
  },
  backIconButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.lg,
    marginBottom: spacing.md,
  },
  profileInfo: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.text.white,
  },
  avatarText: {
    ...typography.h1,
    color: colors.text.white,
    fontWeight: 'bold',
  },
  userName: {
    ...typography.h2,
    color: colors.text.white,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.body,
    color: colors.text.white,
    opacity: 0.9,
    marginBottom: spacing.lg,
  },
  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.text.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
  },
  unsubscribeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: colors.text.white,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  subscribeButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: 'bold',
  },
  infoSection: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.small,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.small,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  statValue: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});

export default UserProfileScreen;
