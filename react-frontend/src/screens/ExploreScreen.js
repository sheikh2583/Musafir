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
import { colors, typography, spacing, borderRadius, shadows, responsive } from '../theme';

const { width } = Dimensions.get('window');

const ExploreScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['All', 'Islamic', 'Quran', 'Hadith', 'Articles', 'Videos'];

  const exploreItems = [
    {
      id: 1,
      title: 'Understanding Tawheed',
      category: 'Islamic',
      author: 'Sheikh Ahmad',
      views: '12.5K',
      duration: '45 min',
      icon: 'book',
    },
    {
      id: 2,
      title: 'Quranic Arabic Basics',
      category: 'Quran',
      author: 'Ustadh Ibrahim',
      views: '8.2K',
      duration: '30 min',
      icon: 'language',
    },
    {
      id: 3,
      title: 'Hadith Collection: Sahih Bukhari',
      category: 'Hadith',
      author: 'Dr. Fatima',
      views: '15.3K',
      duration: '1h 20 min',
      icon: 'list',
    },
    {
      id: 4,
      title: 'The Beauty of Ramadan',
      category: 'Articles',
      author: 'Maryam Ali',
      views: '20.1K',
      duration: '15 min',
      icon: 'document-text',
    },
    {
      id: 5,
      title: 'Islamic History Series',
      category: 'Videos',
      author: 'Islamic Channel',
      views: '45.7K',
      duration: '2h 10 min',
      icon: 'play-circle',
    },
    {
      id: 6,
      title: 'Daily Dua and Dhikr',
      category: 'Islamic',
      author: 'Sheikh Yusuf',
      views: '9.8K',
      duration: '20 min',
      icon: 'heart',
    },
  ];

  const trendingTopics = [
    { id: 1, name: 'Ramadan', count: '1.2K posts' },
    { id: 2, name: 'Salah', count: '856 posts' },
    { id: 3, name: 'Quran Recitation', count: '642 posts' },
    { id: 4, name: 'Islamic History', count: '523 posts' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color={colors.text.secondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search content..."
              placeholderTextColor={colors.text.secondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category.toLowerCase() && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category.toLowerCase())}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === category.toLowerCase() && styles.categoryChipTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trending Topics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Topics</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.trendingContainer}>
            {trendingTopics.map((topic) => (
              <TouchableOpacity key={topic.id} style={styles.trendingChip}>
                <Ionicons name="trending-up" size={16} color={colors.primary} />
                <View style={styles.trendingContent}>
                  <Text style={styles.trendingName}>{topic.name}</Text>
                  <Text style={styles.trendingCount}>{topic.count}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Explore Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discover Content</Text>
          <View style={styles.exploreGrid}>
            {exploreItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.exploreCard}>
                <View style={styles.exploreIconContainer}>
                  <Ionicons name={item.icon} size={32} color={colors.primary} />
                </View>
                <View style={styles.exploreContent}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{item.category}</Text>
                  </View>
                  <Text style={styles.exploreTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View style={styles.exploreMetaRow}>
                    <View style={styles.exploreMetaItem}>
                      <Ionicons name="person-outline" size={14} color={colors.text.secondary} />
                      <Text style={styles.exploreMetaText}>{item.author}</Text>
                    </View>
                  </View>
                  <View style={styles.exploreFooter}>
                    <View style={styles.exploreMetaItem}>
                      <Ionicons name="eye-outline" size={14} color={colors.text.secondary} />
                      <Text style={styles.exploreMetaText}>{item.views}</Text>
                    </View>
                    <View style={styles.exploreMetaItem}>
                      <Ionicons name="time-outline" size={14} color={colors.text.secondary} />
                      <Text style={styles.exploreMetaText}>{item.duration}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
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
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  searchSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    ...shadows.small,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary,
  },
  categoriesScroll: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    ...typography.bodySmall,
    color: colors.text.primary,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: colors.text.white,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
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
  seeAll: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  trendingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  trendingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    gap: spacing.xs,
    ...shadows.small,
  },
  trendingContent: {
    gap: 2,
  },
  trendingName: {
    ...typography.bodySmall,
    color: colors.text.primary,
    fontWeight: '600',
  },
  trendingCount: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  exploreGrid: {
    marginTop: spacing.md,
    gap: spacing.md,
  },
  exploreCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.md,
    ...shadows.small,
  },
  exploreIconContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exploreContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  categoryBadgeText: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: '600',
  },
  exploreTitle: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  exploreMetaRow: {
    marginBottom: spacing.xs,
  },
  exploreMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exploreMetaText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  exploreFooter: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});

export default ExploreScreen;
