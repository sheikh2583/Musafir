import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SalatService from '../services/SalatService';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(user);
  const [salatStreak, setSalatStreak] = useState(0);
  const [todayStats, setTodayStats] = useState({ completed: 0, total: 5, percentage: 0 });

  useEffect(() => {
    setUserData(user);
    loadSalatData();
  }, [user]);

  const loadSalatData = async () => {
    const streak = await SalatService.getStreak();
    setSalatStreak(streak);
    
    const stats = await SalatService.getTodayStats();
    setTodayStats(stats);
  };

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
    await loadSalatData();
    setRefreshing(false);
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

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.profileHeader}>
          <Text style={styles.avatar}>{userData?.name?.[0]?.toUpperCase() || 'U'}</Text>
          <Text style={styles.name}>{userData?.name || 'User'}</Text>
          <Text style={styles.email}>{userData?.email || ''}</Text>
        </View>

        {/* Salat Streak Card */}
        <View style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <Ionicons name="flame" size={28} color="#FF5722" />
            <Text style={styles.streakTitle}>Salat Streak</Text>
          </View>
          
          <View style={styles.streakContent}>
            <View style={styles.streakMain}>
              <Text style={styles.streakNumber}>{salatStreak}</Text>
              <Text style={styles.streakLabel}>{salatStreak === 1 ? 'Day' : 'Days'}</Text>
            </View>
            
            <View style={styles.streakDivider} />
            
            <View style={styles.todayStats}>
              <Text style={styles.todayTitle}>Today</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${todayStats.percentage}%` }]} />
                </View>
                <Text style={styles.progressText}>{todayStats.completed}/5</Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.streakTip}>
            {salatStreak === 0 
              ? '🌟 Complete all 5 prayers today to start your streak!'
              : salatStreak < 7 
                ? '💪 Keep going! Consistency builds strong habits.'
                : salatStreak < 30
                  ? '🔥 Amazing progress! You\'re on fire!'
                  : '🏆 MashaAllah! You\'re a true champion!'}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.deleteButton, deleting && styles.buttonDisabled]} 
          onPress={handleDeleteAccount}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Delete Account</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.warningText}>
          Deleting your account will remove all your data permanently.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2c5f2d',
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 80,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  streakCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  streakMain: {
    alignItems: 'center',
    flex: 1,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  streakLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: -5,
  },
  streakDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#FFE082',
    marginHorizontal: 15,
  },
  todayStats: {
    flex: 1,
    alignItems: 'center',
  },
  todayTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#FFE082',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
  },
  streakTip: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#8b0000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  warningText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 11,
    marginTop: 12,
    paddingHorizontal: 10,
  },
});
