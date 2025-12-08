import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { colors, typography, spacing, borderRadius, shadows, responsive } from '../theme';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(user);

  useEffect(() => {
    setUserData(user);
  }, [user]);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/auth/me');
      setUserData(response.data);
    } catch (error) {
      console.error('Fetch user error:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone. All your data including messages will be permanently removed.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete('/users/me/delete');
      Alert.alert('Account Deleted', 'Your account has been permanently deleted.');
      logout();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete account. Please try again.');
      console.error('Delete account error:', error);
    } finally {
      setDeleting(false);
    }
  };

  const stats = [
    { id: 1, label: 'Posts', value: '24', icon: 'document-text' },
    { id: 2, label: 'Followers', value: '156', icon: 'people' },
    { id: 3, label: 'Following', value: '89', icon: 'person-add' },
  ];

  const menuSections = [
    {
      id: 1,
      title: 'Account',
      items: [
        { id: 1, label: 'Edit Profile', icon: 'person-outline', action: 'edit' },
        { id: 2, label: 'Privacy Settings', icon: 'lock-closed-outline', action: 'privacy' },
        { id: 3, label: 'Security', icon: 'shield-checkmark-outline', action: 'security' },
      ],
    },
    {
      id: 2,
      title: 'Preferences',
      items: [
        { id: 1, label: 'Notifications', icon: 'notifications-outline', action: 'notifications', toggle: true },
        { id: 2, label: 'Dark Mode', icon: 'moon-outline', action: 'darkMode', toggle: true },
        { id: 3, label: 'Language', icon: 'language-outline', action: 'language' },
      ],
    },
    {
      id: 3,
      title: 'Content',
      items: [
        { id: 1, label: 'Saved Items', icon: 'bookmark-outline', action: 'saved' },
        { id: 2, label: 'Downloads', icon: 'download-outline', action: 'downloads' },
        { id: 3, label: 'My Posts', icon: 'create-outline', action: 'posts' },
      ],
    },
    {
      id: 4,
      title: 'Support',
      items: [
        { id: 1, label: 'Help Center', icon: 'help-circle-outline', action: 'help' },
        { id: 2, label: 'Report a Problem', icon: 'flag-outline', action: 'report' },
        { id: 3, label: 'About', icon: 'information-circle-outline', action: 'about' },
      ],
    },
  ];

  const handleMenuAction = (action) => {
    // Handle different menu actions
    console.log('Menu action:', action);
  };

  const renderToggle = (action) => {
    if (action === 'notifications') {
      return (
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: colors.border, true: colors.primary + '60' }}
          thumbColor={notificationsEnabled ? colors.primary : colors.text.light}
        />
      );
    } else if (action === 'darkMode') {
      return (
        <Switch
          value={darkModeEnabled}
          onValueChange={setDarkModeEnabled}
          trackColor={{ false: colors.border, true: colors.primary + '60' }}
          thumbColor={darkModeEnabled ? colors.primary : colors.text.light}
        />
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Profile Header */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.profileHeader}
        >
          <View style={styles.profileTop}>
            <TouchableOpacity style={styles.settingsButton}>
              <Ionicons name="settings-outline" size={24} color={colors.text.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userData?.name?.[0]?.toUpperCase() || 'U'}
                </Text>
              </View>
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color={colors.text.white} />
              </TouchableOpacity>
            </View>

            <Text style={styles.userName}>{userData?.name || 'User Name'}</Text>
            <Text style={styles.userEmail}>{userData?.email || 'user@example.com'}</Text>

            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            {stats.map((stat) => (
              <View key={stat.id} style={styles.statItem}>
                <Ionicons name={stat.icon} size={20} color={colors.text.white} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Menu Sections */}
        <View style={styles.menuContainer}>
          {menuSections.map((section) => (
            <View key={section.id} style={styles.menuSection}>
              <Text style={styles.menuSectionTitle}>{section.title}</Text>
              <View style={styles.menuItems}>
                {section.items.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.menuItem,
                      index !== section.items.length - 1 && styles.menuItemBorder,
                    ]}
                    onPress={() => handleMenuAction(item.action)}
                  >
                    <View style={styles.menuItemLeft}>
                      <View style={styles.menuIconContainer}>
                        <Ionicons name={item.icon} size={22} color={colors.primary} />
                      </View>
                      <Text style={styles.menuItemText}>{item.label}</Text>
                    </View>
                    {item.toggle ? (
                      renderToggle(item.action)
                    ) : (
                      <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Delete Account Button */}
          <TouchableOpacity 
            style={[styles.deleteAccountButton, deleting && styles.buttonDisabled]} 
            onPress={handleDeleteAccount}
            disabled={deleting}
          >
            {deleting ? (
              <ActivityIndicator color={colors.text.white} />
            ) : (
              <>
                <Ionicons name="trash-outline" size={22} color={colors.text.white} />
                <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.warningText}>
            Deleting your account will remove all your data permanently.
          </Text>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={colors.error} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>

          {/* Version */}
          <Text style={styles.versionText}>Version 1.0.0</Text>
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
  profileHeader: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
  },
  profileTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.text.white,
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
    marginBottom: spacing.md,
  },
  editProfileButton: {
    backgroundColor: colors.text.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
  },
  editProfileButtonText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    ...typography.h3,
    color: colors.text.white,
    fontWeight: 'bold',
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.white,
    opacity: 0.9,
  },
  menuContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  menuSection: {
    marginBottom: spacing.lg,
  },
  menuSectionTitle: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  menuItems: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.small,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.warning,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
  },
  deleteAccountButtonText: {
    ...typography.body,
    color: colors.text.white,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  warningText: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.error + '20',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
  },
  logoutButtonText: {
    ...typography.body,
    color: colors.error,
    fontWeight: '600',
  },
  versionText: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});

export default ProfileScreen;
