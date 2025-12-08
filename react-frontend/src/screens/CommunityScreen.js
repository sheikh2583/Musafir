import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows, responsive } from '../theme';

const { width } = Dimensions.get('window');

const CommunityScreen = () => {
  const [selectedTab, setSelectedTab] = useState('discussions');

  const tabs = [
    { id: 'discussions', label: 'Discussions', icon: 'chatbubbles' },
    { id: 'groups', label: 'Groups', icon: 'people' },
    { id: 'events', label: 'Events', icon: 'calendar' },
  ];

  const discussions = [
    {
      id: 1,
      author: 'Ahmad Khan',
      avatar: null,
      title: 'Benefits of Tahajjud Prayer',
      content: 'Sharing my experience with maintaining regular tahajjud prayers...',
      timestamp: '2h ago',
      likes: 45,
      comments: 12,
      category: 'Prayer',
    },
    {
      id: 2,
      author: 'Fatima Ahmed',
      avatar: null,
      title: 'Quran Memorization Tips',
      content: 'Here are some effective techniques that helped me in my memorization journey...',
      timestamp: '5h ago',
      likes: 78,
      comments: 23,
      category: 'Quran',
    },
    {
      id: 3,
      author: 'Ibrahim Ali',
      avatar: null,
      title: 'Islamic Finance Discussion',
      content: 'Looking for advice on halal investment options...',
      timestamp: '1d ago',
      likes: 34,
      comments: 18,
      category: 'Finance',
    },
  ];

  const groups = [
    {
      id: 1,
      name: 'Quran Study Circle',
      members: 256,
      icon: 'book',
      description: 'Weekly Quran study and tafsir sessions',
    },
    {
      id: 2,
      name: 'Youth Muslim Network',
      members: 512,
      icon: 'people',
      description: 'Connecting young Muslims worldwide',
    },
    {
      id: 3,
      name: 'Islamic History',
      members: 189,
      icon: 'time',
      description: 'Exploring our rich Islamic heritage',
    },
  ];

  const events = [
    {
      id: 1,
      title: 'Friday Jummah Prayer',
      date: 'Dec 8, 2025',
      time: '1:00 PM',
      location: 'Community Masjid',
      attendees: 145,
    },
    {
      id: 2,
      title: 'Islamic Finance Workshop',
      date: 'Dec 12, 2025',
      time: '6:00 PM',
      location: 'Online via Zoom',
      attendees: 78,
    },
    {
      id: 3,
      title: 'Quran Recitation Competition',
      date: 'Dec 15, 2025',
      time: '4:00 PM',
      location: 'Islamic Center',
      attendees: 92,
    },
  ];

  const renderDiscussions = () => (
    <View style={styles.contentContainer}>
      {discussions.map((discussion) => (
        <TouchableOpacity key={discussion.id} style={styles.discussionCard}>
          <View style={styles.discussionHeader}>
            <View style={styles.authorContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={20} color={colors.text.white} />
              </View>
              <View>
                <Text style={styles.authorName}>{discussion.author}</Text>
                <Text style={styles.timestamp}>{discussion.timestamp}</Text>
              </View>
            </View>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>{discussion.category}</Text>
            </View>
          </View>
          <Text style={styles.discussionTitle}>{discussion.title}</Text>
          <Text style={styles.discussionContent} numberOfLines={2}>
            {discussion.content}
          </Text>
          <View style={styles.discussionFooter}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart-outline" size={18} color={colors.text.secondary} />
              <Text style={styles.actionText}>{discussion.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={18} color={colors.text.secondary} />
              <Text style={styles.actionText}>{discussion.comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-social-outline" size={18} color={colors.text.secondary} />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderGroups = () => (
    <View style={styles.contentContainer}>
      {groups.map((group) => (
        <TouchableOpacity key={group.id} style={styles.groupCard}>
          <View style={styles.groupIcon}>
            <Ionicons name={group.icon} size={32} color={colors.primary} />
          </View>
          <View style={styles.groupContent}>
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.groupDescription}>{group.description}</Text>
            <View style={styles.groupMeta}>
              <Ionicons name="people-outline" size={14} color={colors.text.secondary} />
              <Text style={styles.groupMembers}>{group.members} members</Text>
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
          <View style={styles.eventDate}>
            <Text style={styles.eventMonth}>{event.date.split(' ')[0]}</Text>
            <Text style={styles.eventDay}>{event.date.split(' ')[1].replace(',', '')}</Text>
          </View>
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <View style={styles.eventDetail}>
              <Ionicons name="time-outline" size={14} color={colors.text.secondary} />
              <Text style={styles.eventDetailText}>{event.time}</Text>
            </View>
            <View style={styles.eventDetail}>
              <Ionicons name="location-outline" size={14} color={colors.text.secondary} />
              <Text style={styles.eventDetailText}>{event.location}</Text>
            </View>
            <View style={styles.eventDetail}>
              <Ionicons name="people-outline" size={14} color={colors.text.secondary} />
              <Text style={styles.eventDetailText}>{event.attendees} attending</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.attendButton}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          </TouchableOpacity>
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
          <Ionicons name="add" size={24} color={colors.text.white} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, selectedTab === tab.id && styles.tabActive]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <Ionicons
              name={tab.icon}
              size={20}
              color={selectedTab === tab.id ? colors.primary : colors.text.secondary}
            />
            <Text style={[styles.tabText, selectedTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedTab === 'discussions' && renderDiscussions()}
        {selectedTab === 'groups' && renderGroups()}
        {selectedTab === 'events' && renderEvents()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
    ...shadows.small,
  },
  tabActive: {
    backgroundColor: colors.primary + '20',
  },
  tabText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.primary,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  discussionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.small,
  },
  discussionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorName: {
    ...typography.bodySmall,
    color: colors.text.primary,
    fontWeight: '600',
  },
  timestamp: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  categoryTag: {
    backgroundColor: colors.secondary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  categoryTagText: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: '600',
  },
  discussionTitle: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  discussionContent: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  discussionFooter: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  groupCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.small,
  },
  groupIcon: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupContent: {
    flex: 1,
  },
  groupName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  groupDescription: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  groupMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  groupMembers: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  joinButtonText: {
    ...typography.bodySmall,
    color: colors.text.white,
    fontWeight: '600',
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.small,
  },
  eventDate: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventMonth: {
    ...typography.caption,
    color: colors.text.white,
    fontWeight: '600',
  },
  eventDay: {
    ...typography.h3,
    color: colors.text.white,
    fontWeight: 'bold',
  },
  eventContent: {
    flex: 1,
    gap: 4,
  },
  eventTitle: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventDetailText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  attendButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CommunityScreen;
