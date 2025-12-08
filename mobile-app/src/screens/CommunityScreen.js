import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CommunityScreen = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [searchQuery, setSearchQuery] = useState('');

  const discussions = [
    {
      id: 1,
      title: 'Best practices for Tahajjud prayer',
      author: 'Ahmad Khan',
      replies: 24,
      views: '1.2K',
      time: '2h ago',
      category: 'Prayer',
    },
    {
      id: 2,
      title: 'Understanding the importance of Zakat',
      author: 'Fatima Ahmed',
      replies: 18,
      views: '856',
      time: '5h ago',
      category: 'Fiqh',
    },
    {
      id: 3,
      title: 'Memorization tips for Quran',
      author: 'Yusuf Ibrahim',
      replies: 42,
      views: '2.1K',
      time: '1d ago',
      category: 'Quran',
    },
    {
      id: 4,
      title: 'Islamic history: The Golden Age',
      author: 'Aisha Muhammad',
      replies: 15,
      views: '642',
      time: '2d ago',
      category: 'History',
    },
  ];

  const groups = [
    {
      id: 1,
      name: 'Quran Study Circle',
      members: '2.5K',
      posts: '145',
      icon: 'book',
      color: '#2c5f2d',
    },
    {
      id: 2,
      name: 'Islamic History Enthusiasts',
      members: '1.8K',
      posts: '98',
      icon: 'time',
      color: '#4a90e2',
    },
    {
      id: 3,
      name: 'Youth Muslim Network',
      members: '3.2K',
      posts: '220',
      icon: 'people',
      color: '#f39c12',
    },
    {
      id: 4,
      name: 'Daily Hadith Study',
      members: '1.5K',
      posts: '76',
      icon: 'list',
      color: '#9b59b6',
    },
  ];

  const events = [
    {
      id: 1,
      title: 'Jummah Prayer and Khutbah',
      date: 'Friday, Dec 29',
      time: '1:00 PM',
      location: 'Central Masjid',
      attendees: '120+',
      icon: 'calendar',
    },
    {
      id: 2,
      title: 'Islamic Knowledge Workshop',
      date: 'Saturday, Dec 30',
      time: '10:00 AM',
      location: 'Community Hall',
      attendees: '45',
      icon: 'school',
    },
    {
      id: 3,
      title: 'Quran Recitation Competition',
      date: 'Sunday, Dec 31',
      time: '3:00 PM',
      location: 'Masjid Al-Noor',
      attendees: '80+',
      icon: 'trophy',
    },
  ];

  const renderDiscussions = () => (
    <View style={styles.contentContainer}>
      {discussions.map((discussion) => (
        <TouchableOpacity key={discussion.id} style={styles.discussionCard}>
          <View style={styles.discussionHeader}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{discussion.category}</Text>
            </View>
            <Text style={styles.discussionTime}>{discussion.time}</Text>
          </View>
          <Text style={styles.discussionTitle}>{discussion.title}</Text>
          <View style={styles.discussionAuthor}>
            <Ionicons name="person-circle-outline" size={16} color="#999" />
            <Text style={styles.authorText}>{discussion.author}</Text>
          </View>
          <View style={styles.discussionFooter}>
            <View style={styles.discussionStat}>
              <Ionicons name="chatbubble-outline" size={16} color="#2c5f2d" />
              <Text style={styles.statText}>{discussion.replies} replies</Text>
            </View>
            <View style={styles.discussionStat}>
              <Ionicons name="eye-outline" size={16} color="#999" />
              <Text style={styles.statText}>{discussion.views} views</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderGroups = () => (
    <View style={styles.contentContainer}>
      {groups.map((group) => (
        <TouchableOpacity key={group.id} style={styles.groupCard}>
          <View style={[styles.groupIcon, { backgroundColor: `${group.color}20` }]}>
            <Ionicons name={group.icon} size={28} color={group.color} />
          </View>
          <View style={styles.groupContent}>
            <Text style={styles.groupName}>{group.name}</Text>
            <View style={styles.groupStats}>
              <View style={styles.groupStatItem}>
                <Ionicons name="people-outline" size={14} color="#999" />
                <Text style={styles.groupStatText}>{group.members} members</Text>
              </View>
              <View style={styles.groupStatItem}>
                <Ionicons name="document-text-outline" size={14} color="#999" />
                <Text style={styles.groupStatText}>{group.posts} posts</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Join</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderEvents = () => (
    <View style={styles.contentContainer}>
      {events.map((event) => (
        <TouchableOpacity key={event.id} style={styles.eventCard}>
          <View style={styles.eventIconContainer}>
            <Ionicons name={event.icon} size={28} color="#2c5f2d" />
          </View>
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <View style={styles.eventDetails}>
              <View style={styles.eventDetailRow}>
                <Ionicons name="calendar-outline" size={14} color="#999" />
                <Text style={styles.eventDetailText}>{event.date}</Text>
              </View>
              <View style={styles.eventDetailRow}>
                <Ionicons name="time-outline" size={14} color="#999" />
                <Text style={styles.eventDetailText}>{event.time}</Text>
              </View>
            </View>
            <View style={styles.eventDetailRow}>
              <Ionicons name="location-outline" size={14} color="#999" />
              <Text style={styles.eventDetailText}>{event.location}</Text>
            </View>
            <View style={styles.eventFooter}>
              <View style={styles.eventDetailRow}>
                <Ionicons name="people-outline" size={14} color="#2c5f2d" />
                <Text style={[styles.eventDetailText, { color: '#2c5f2d' }]}>
                  {event.attendees} attending
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search community..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'discussions' && styles.activeTab]}
          onPress={() => setActiveTab('discussions')}
        >
          <Ionicons
            name="chatbubbles"
            size={20}
            color={activeTab === 'discussions' ? '#2c5f2d' : '#999'}
          />
          <Text
            style={[styles.tabText, activeTab === 'discussions' && styles.activeTabText]}
          >
            Discussions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'groups' && styles.activeTab]}
          onPress={() => setActiveTab('groups')}
        >
          <Ionicons
            name="people"
            size={20}
            color={activeTab === 'groups' ? '#2c5f2d' : '#999'}
          />
          <Text style={[styles.tabText, activeTab === 'groups' && styles.activeTabText]}>
            Groups
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'events' && styles.activeTab]}
          onPress={() => setActiveTab('events')}
        >
          <Ionicons
            name="calendar"
            size={20}
            color={activeTab === 'events' ? '#2c5f2d' : '#999'}
          />
          <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>
            Events
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {activeTab === 'discussions' && renderDiscussions()}
        {activeTab === 'groups' && renderGroups()}
        {activeTab === 'events' && renderEvents()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c5f2d',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#2c5f2d',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 5,
  },
  activeTab: {
    backgroundColor: '#e8f5e9',
  },
  tabText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#2c5f2d',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  discussionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  discussionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 11,
    color: '#2c5f2d',
    fontWeight: '600',
  },
  discussionTime: {
    fontSize: 12,
    color: '#999',
  },
  discussionTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 8,
  },
  discussionAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },
  authorText: {
    fontSize: 13,
    color: '#999',
  },
  discussionFooter: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 5,
  },
  discussionStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    fontSize: 12,
    color: '#999',
  },
  groupCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  groupIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupContent: {
    flex: 1,
  },
  groupName: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
    marginBottom: 5,
  },
  groupStats: {
    flexDirection: 'row',
    gap: 15,
  },
  groupStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  groupStatText: {
    fontSize: 12,
    color: '#999',
  },
  joinButton: {
    backgroundColor: '#2c5f2d',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  eventIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventContent: {
    flex: 1,
    gap: 5,
  },
  eventTitle: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
    marginBottom: 5,
  },
  eventDetails: {
    flexDirection: 'row',
    gap: 15,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventDetailText: {
    fontSize: 12,
    color: '#999',
  },
  eventFooter: {
    marginTop: 5,
  },
});

export default CommunityScreen;
