import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import { colors, typography, spacing, borderRadius, shadows, responsive } from '../theme';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(user);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
    fetchUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchMessages();
      fetchUserData();
    }, [])
  );

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
    await Promise.all([fetchMessages(), fetchUserData()]);
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

  const categories = [
    { id: 1, name: 'Prayer Times', icon: 'time-outline', color: colors.primary },
    { id: 2, name: 'Quran', icon: 'book-outline', color: colors.secondary },
    { id: 3, name: 'Hadith', icon: 'list-outline', color: colors.warning },
    { id: 4, name: 'Qibla', icon: 'compass-outline', color: colors.info },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
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
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>As-salamu alaykum,</Text>
              <Text style={styles.userName}>{userData?.name || 'User'}</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color={colors.text.white} />
              <View style={styles.badge} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainerWrapper}>
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color={colors.text.secondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search users by name..."
                placeholderTextColor={colors.text.secondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={handleSearchFocus}
                autoCapitalize="none"
              />
            </View>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <View style={styles.searchResultsDropdown}>
                {searchResults.map((resultUser) => (
                  <TouchableOpacity 
                    key={resultUser._id}
                    style={styles.searchResultItem}
                    onPress={() => {
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
            
            {showSearchResults && searchResults.length === 0 && searchQuery.trim().length > 0 && !searchLoading && (
              <View style={styles.searchResultsDropdown}>
                <Text style={styles.noSearchResults}>No users found</Text>
              </View>
            )}
          </View>
        </LinearGradient>

        {/* Message Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Share Your Thoughts</Text>
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="What's on your mind?"
              placeholderTextColor={colors.text.secondary}
              value={message}
              onChangeText={setMessage}
              multiline={true}
              maxLength={500}
            />
            <TouchableOpacity 
              style={[styles.postButton, loading && styles.postButtonDisabled]}
              onPress={handlePostMessage}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={colors.text.white} size="small" />
              ) : (
                <Text style={styles.postButtonText}>Post</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                activeOpacity={0.8}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                  <Ionicons name={category.icon} size={28} color={category.color} />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Community Messages */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Community Messages</Text>
          </View>
          <View style={styles.messagesContainer}>
            {messages.length === 0 ? (
              <View style={styles.noMessagesContainer}>
                <Ionicons name="chatbubbles-outline" size={48} color={colors.text.secondary} />
                <Text style={styles.noMessages}>
                  No messages yet. Search and subscribe to users to see their messages!
                </Text>
              </View>
            ) : (
              messages.map((msg) => (
                <View key={msg._id} style={styles.messageCard}>
                  <View style={styles.messageHeader}>
                    <TouchableOpacity 
                      style={styles.messageAuthorContainer}
                      onPress={() => {
                        if (msg.user?._id && msg.user._id !== userData?._id) {
                          navigation.navigate('UserProfile', { userId: msg.user._id });
                        }
                      }}
                      disabled={!msg.user?._id || msg.user._id === userData?._id}
                    >
                      <View style={styles.messageAvatar}>
                        <Text style={styles.messageAvatarText}>
                          {msg.user?.name?.[0]?.toUpperCase() || 'U'}
                        </Text>
                      </View>
                      <View>
                        <Text style={[
                          styles.messageName,
                          msg.user?._id && msg.user._id !== userData?._id && styles.messageNameClickable
                        ]}>
                          {msg.user?.name || 'Unknown'}
                        </Text>
                        <Text style={styles.messageTime}>{formatTime(msg.createdAt)}</Text>
                      </View>
                    </TouchableOpacity>
                    
                    {/* Show delete button only for user's own messages */}
                    {msg.user?._id === userData?._id && (
                      <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={() => handleDeleteMessage(msg._id)}
                      >
                        <Ionicons name="trash-outline" size={20} color={colors.error} />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.messageContent}>{msg.content}</Text>
                </View>
              ))
            )}
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
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.body,
    color: colors.text.white,
    opacity: 0.9,
  },
  userName: {
    ...typography.h3,
    color: colors.text.white,
    fontWeight: 'bold',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  searchContainerWrapper: {
    position: 'relative',
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary,
  },
  searchResultsDropdown: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    maxHeight: 300,
    ...shadows.large,
    zIndex: 1001,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchResultAvatar: {
    width: 45,
    height: 45,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  searchResultAvatarText: {
    ...typography.body,
    color: colors.text.white,
    fontWeight: 'bold',
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  searchResultEmail: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  noSearchResults: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    padding: spacing.lg,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  messageInputContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.small,
  },
  messageInput: {
    ...typography.body,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: spacing.sm,
  },
  postButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: colors.text.secondary,
    opacity: 0.6,
  },
  postButtonText: {
    ...typography.body,
    color: colors.text.white,
    fontWeight: 'bold',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  categoryCard: {
    width: (width - spacing.lg * 2 - spacing.md) / 2,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.small,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryName: {
    ...typography.bodySmall,
    color: colors.text.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  messagesContainer: {
    gap: spacing.md,
  },
  noMessagesContainer: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  noMessages: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  messageCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.small,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  messageAuthorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  messageAvatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageAvatarText: {
    ...typography.body,
    color: colors.text.white,
    fontWeight: 'bold',
  },
  messageName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  messageNameClickable: {
    color: colors.primary,
  },
  messageTime: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  messageContent: {
    ...typography.body,
    color: colors.text.primary,
    lineHeight: 22,
  },
  deleteButton: {
    padding: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.error + '20',
  },
});

export default HomeScreen;
