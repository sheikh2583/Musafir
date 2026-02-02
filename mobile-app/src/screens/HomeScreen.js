import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import SalatService from '../services/SalatService';
import IslamicCalendarService from '../services/IslamicCalendarService';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(user);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Salat state
  const [hijriDate, setHijriDate] = useState(null);
  const [todayPrayers, setTodayPrayers] = useState([]);
  const [salatStats, setSalatStats] = useState({ completed: 0, total: 5 });
  
  // Islamic calendar state
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [dailyQuote, setDailyQuote] = useState(null);
  const [todayEvent, setTodayEvent] = useState(null);
  const [calendarLoading, setCalendarLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
    fetchUserData();
    loadSalatData();
    loadIslamicCalendar();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchMessages();
      fetchUserData();
      loadSalatData();
    }, [])
  );

  const loadSalatData = async () => {
    const hijri = SalatService.getHijriDate();
    setHijriDate(hijri);
    
    const prayers = await SalatService.getTodayPrayers();
    setTodayPrayers(prayers);
    
    const stats = await SalatService.getTodayStats();
    setSalatStats(stats);
  };

  const loadIslamicCalendar = async () => {
    setCalendarLoading(true);
    try {
      // Get Hijri date (online)
      const hijri = await IslamicCalendarService.getHijriDateOnline();
      setHijriDate(hijri);
      
      // Get upcoming events
      const events = await IslamicCalendarService.getUpcomingEvents(3);
      setUpcomingEvents(events);
      
      // Check if today is special
      const today = await IslamicCalendarService.getTodayEvent();
      setTodayEvent(today);
      
      // Get daily quote
      const quote = IslamicCalendarService.getDailyQuote();
      setDailyQuote(quote);
    } catch (error) {
      console.log('Error loading Islamic calendar:', error.message);
    } finally {
      setCalendarLoading(false);
    }
  };

  const handlePrayerToggle = async (prayerKey, currentlyCompleted) => {
    if (currentlyCompleted) {
      await SalatService.unmarkPrayer(prayerKey);
    } else {
      await SalatService.markPrayerComplete(prayerKey);
    }
    await loadSalatData();
  };

  useEffect(() => {
    setUserData(user);
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Fetch messages error:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await api.get('/auth/me');
      setUserData(response.data);
    } catch (error) {
      console.error('Fetch user error:', error);
    }
  };

  const performSearch = async (query) => {
    if (!query || query.trim().length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
      setSearchResults(response.data);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handlePostMessage = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please write a message');
      return;
    }

    setLoading(true);
    try {
      await api.post('/messages', { content: message });
      setMessage('');
      await fetchMessages();
      Alert.alert('Success', 'Message posted!');
    } catch (error) {
      Alert.alert('Error', 'Failed to post message');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/messages/${messageId}`);
              await fetchMessages();
              Alert.alert('Success', 'Message deleted!');
            } catch (error) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to delete message');
            }
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchMessages(), fetchUserData(), loadSalatData(), loadIslamicCalendar()]);
    setRefreshing(false);
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim().length > 0) {
      setShowSearchResults(true);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Hijri Date Header */}
      {hijriDate && (
        <View style={styles.hijriContainer}>
          <Text style={styles.hijriDateAr}>{hijriDate.formattedAr}</Text>
          <Text style={styles.hijriDate}>{hijriDate.formatted}</Text>
          {hijriDate.dayNameAr && (
            <Text style={styles.hijriDay}>{hijriDate.dayName}</Text>
          )}
        </View>
      )}

      <Text style={styles.title}>As-salamu alaykum</Text>
      <Text style={styles.subtitle}>Welcome, {userData?.name}</Text>

      {/* Today's Special Event Banner */}
      {todayEvent && (
        <View style={[styles.todayEventBanner, { backgroundColor: IslamicCalendarService.getEventColor(todayEvent.type) }]}>
          <Text style={styles.todayEventEmoji}>{todayEvent.emoji}</Text>
          <View style={styles.todayEventInfo}>
            <Text style={styles.todayEventTitle}>Today: {todayEvent.name}</Text>
            <Text style={styles.todayEventNameAr}>{todayEvent.nameAr}</Text>
          </View>
        </View>
      )}

      {/* Daily Quran Quote Card */}
      {dailyQuote && (
        <View style={styles.quoteCard}>
          <View style={styles.quoteHeader}>
            <Ionicons name="book-outline" size={18} color="#2c5f2d" />
            <Text style={styles.quoteLabel}>Verse of the Day</Text>
          </View>
          <Text style={styles.quoteText}>"{dailyQuote.text}"</Text>
          <Text style={styles.quoteRef}>— {dailyQuote.ref}</Text>
        </View>
      )}

      {/* Salat Tracking Card */}
      <View style={styles.salatCard}>
        <View style={styles.salatHeader}>
          <Text style={styles.salatTitle}>🕌 Today's Prayers</Text>
          <Text style={styles.salatStats}>{salatStats.completed}/5</Text>
        </View>
        
        <View style={styles.prayerGrid}>
          {todayPrayers.map((prayer) => {
            let iconName = 'ellipse-outline';
            let iconColor = '#BDBDBD';
            let bgStyle = styles.prayerUpcoming;
            
            if (prayer.completed) {
              iconName = 'checkmark-circle';
              iconColor = '#4CAF50';
              bgStyle = styles.prayerCompleted;
            } else if (prayer.status === 'missed') {
              iconName = 'close-circle';
              iconColor = '#F44336';
              bgStyle = styles.prayerMissed;
            } else if (prayer.status === 'pending') {
              iconName = 'time';
              iconColor = '#FF9800';
              bgStyle = styles.prayerPending;
            }
            
            return (
              <TouchableOpacity
                key={prayer.key}
                style={[styles.prayerItem, bgStyle]}
                onPress={() => handlePrayerToggle(prayer.key, prayer.completed)}
              >
                <Ionicons name={iconName} size={26} color={iconColor} />
                <Text style={[
                  styles.prayerName,
                  prayer.completed && styles.prayerNameCompleted,
                  prayer.status === 'missed' && !prayer.completed && styles.prayerNameMissed,
                  prayer.status === 'pending' && styles.prayerNamePending,
                ]}>
                  {prayer.name}
                </Text>
                <Text style={[
                  styles.prayerNameAr,
                  prayer.completed && styles.prayerNameArCompleted,
                ]}>
                  {prayer.nameAr}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        
        {/* Leaderboard Button */}
        <TouchableOpacity 
          style={styles.leaderboardButton}
          onPress={() => navigation.navigate('SalatLeaderboard')}
        >
          <Ionicons name="trophy" size={18} color="#FFD700" />
          <Text style={styles.leaderboardButtonText}>View Global Leaderboard</Text>
          <Ionicons name="chevron-forward" size={18} color="#2c5f2d" />
        </TouchableOpacity>
      </View>

      {/* Upcoming Islamic Events Card */}
      {calendarLoading ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator size="small" color="#2c5f2d" />
          <Text style={styles.loadingText}>Loading Islamic calendar...</Text>
        </View>
      ) : upcomingEvents.length > 0 && (
        <View style={styles.eventsCard}>
          <View style={styles.eventsHeader}>
            <Ionicons name="calendar" size={20} color="#2c5f2d" />
            <Text style={styles.eventsTitle}>Upcoming Events</Text>
          </View>
          
          {upcomingEvents.map((event, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.eventItem, index === upcomingEvents.length - 1 && { borderBottomWidth: 0 }]}
              onPress={() => Alert.alert(
                `${event.emoji} ${event.name}`,
                `${event.importance}\n\n📖 "${event.quranRef?.text || ''}"\n— Quran ${event.quranRef?.surah || ''}:${event.quranRef?.ayah || ''}`,
                [{ text: 'OK' }]
              )}
            >
              <View style={[styles.eventBadge, { backgroundColor: IslamicCalendarService.getEventColor(event.type) }]}>
                <Text style={styles.eventEmoji}>{event.emoji}</Text>
              </View>
              <View style={styles.eventInfo}>
                <Text style={styles.eventName}>{event.name}</Text>
                <Text style={styles.eventDate}>{event.hijriDate}</Text>
              </View>
              <View style={styles.eventDays}>
                <Text style={styles.eventDaysNumber}>{event.daysUntil}</Text>
                <Text style={styles.eventDaysLabel}>{event.daysUntil === 1 ? 'day' : 'days'}</Text>
              </View>
            </TouchableOpacity>
          ))}
          
          <Text style={styles.eventsTip}>Tap an event to learn more</Text>
        </View>
      )}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Search users by name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={handleSearchFocus}
          autoCapitalize="none"
        />

        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <View style={styles.searchResultsDropdown} pointerEvents="box-none">
            {searchResults.map((resultUser) => (
              <TouchableOpacity
                key={resultUser._id}
                style={styles.searchResultItem}
                activeOpacity={0.7}
                onPressIn={() => {
                  setShowSearchResults(false);
                  setSearchQuery('');
                  navigation.navigate('UserProfile', { userId: resultUser._id });
                }}
              >
                <View style={styles.searchResultAvatar}>
                  <Text style={styles.searchResultAvatarText}>
                    {resultUser.name?.[0]?.toUpperCase() || 'U'}
                  </Text>
                </View>
                <View style={styles.searchResultInfo}>
                  <Text style={styles.searchResultName}>{resultUser.name}</Text>
                  <Text style={styles.searchResultEmail}>{resultUser.email}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {showSearchResults && searchResults.length === 0 && searchQuery.trim().length > 0 && (
          <View style={styles.searchResultsDropdown}>
            <Text style={styles.noSearchResults}>No users found</Text>
          </View>
        )}
      </View>

      <View style={styles.messageInputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Share your thoughts..."
          value={message}
          onChangeText={setMessage}
          multiline={true}
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.postButton, loading && styles.postButtonDisabled]}
          onPress={handlePostMessage}
          disabled={loading}
        >
          <Text style={styles.postButtonText}>{loading ? 'Posting...' : 'Post'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.messagesTitle}>Community Messages</Text>

      <View style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <Text style={styles.noMessages}>No messages yet. Search and subscribe to users to see their messages!</Text>
        ) : (
          messages.map((msg) => (
            <View key={msg._id} style={styles.messageCard}>
              <View style={styles.messageHeader}>
                <TouchableOpacity
                  onPress={() => {
                    if (msg.user?._id && msg.user._id !== userData?._id) {
                      navigation.navigate('UserProfile', { userId: msg.user._id });
                    }
                  }}
                  disabled={!msg.user?._id || msg.user._id === userData?._id}
                >
                  <Text style={[
                    styles.messageName,
                    msg.user?._id && msg.user._id !== userData?._id && styles.messageNameClickable
                  ]}>
                    {msg.user?.name || 'Unknown'}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.messageTime}>{formatTime(msg.createdAt)}</Text>
              </View>
              <Text style={styles.messageContent}>{msg.content}</Text>

              {/* Show delete button only for user's own messages */}
              {msg.user?._id === userData?._id && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteMessage(msg._id)}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  hijriContainer: {
    backgroundColor: '#2c5f2d',
    marginHorizontal: -20,
    marginTop: -20,
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  hijriDateAr: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  hijriDate: {
    fontSize: 14,
    color: '#E8F5E9',
  },
  hijriDay: {
    fontSize: 12,
    color: '#A5D6A7',
    marginTop: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c5f2d',
    marginTop: 20,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  // Today's Special Event Banner
  todayEventBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  todayEventEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  todayEventInfo: {
    flex: 1,
  },
  todayEventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  todayEventNameAr: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  // Daily Quote Card
  quoteCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2c5f2d',
  },
  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  quoteLabel: {
    fontSize: 12,
    color: '#2c5f2d',
    fontWeight: '600',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  quoteText: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  quoteRef: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'right',
  },
  // Loading card
  loadingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    marginBottom: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  salatCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  salatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  salatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  salatStats: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5f2d',
  },
  prayerGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  prayerItem: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    minWidth: 60,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  prayerUpcoming: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  prayerCompleted: {
    backgroundColor: '#E8F5E9',
    borderColor: '#81C784',
  },
  prayerMissed: {
    backgroundColor: '#FFEBEE',
    borderColor: '#EF9A9A',
  },
  prayerPending: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFB74D',
  },
  prayerName: {
    fontSize: 11,
    color: '#757575',
    marginTop: 4,
    fontWeight: '600',
  },
  prayerNameCompleted: {
    color: '#388E3C',
  },
  prayerNameMissed: {
    color: '#D32F2F',
  },
  prayerNamePending: {
    color: '#F57C00',
  },
  prayerNameAr: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 2,
  },
  prayerNameArCompleted: {
    color: '#66BB6A',
  },
  leaderboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  leaderboardButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c5f2d',
    marginHorizontal: 8,
  },
  // Islamic Events Card
  eventsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  eventBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  eventEmoji: {
    fontSize: 22,
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  eventDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  eventDays: {
    alignItems: 'center',
    minWidth: 55,
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  eventDaysNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c5f2d',
  },
  eventDaysLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: -2,
  },
  eventsTip: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  searchContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  hadithTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  refreshHadith: {
    padding: 4,
  },
  hadithContent: {
    paddingTop: 4,
  },
  hadithText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  hadithNarrator: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
    fontWeight: '500',
  },
  hadithReference: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },
  hadithEmpty: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    paddingVertical: 15,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 20,
    zIndex: 1000,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 15,
    paddingLeft: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchResultsDropdown: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    maxHeight: 300,
    zIndex: 1001,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchResultAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#2c5f2d',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  searchResultAvatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  searchResultEmail: {
    fontSize: 14,
    color: '#666',
  },
  noSearchResults: {
    padding: 20,
    textAlign: 'center',
    color: '#999',
    fontSize: 15,
  },
  messageInputContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  postButton: {
    backgroundColor: '#2c5f2d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#95a895',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  messagesTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c5f2d',
    marginBottom: 15,
  },
  messagesContainer: {
    flex: 1,
  },
  noMessages: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
  },
  messageCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    position: 'relative',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c5f2d',
  },
  messageNameClickable: {
    textDecorationLine: 'underline',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
  messageContent: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    paddingRight: 40,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#ffebee',
  },
  deleteButtonText: {
    fontSize: 18,
  },
});
