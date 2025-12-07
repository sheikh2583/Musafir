import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';

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

  useEffect(() => {
    fetchMessages();
    fetchUserData();
  }, []);

  // Refresh messages when screen comes into focus (after returning from UserProfile)
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

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>As-salamu alaykum</Text>
      <Text style={styles.subtitle}>Welcome, {userData?.name}</Text>

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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c5f2d',
    marginTop: 40,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
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
