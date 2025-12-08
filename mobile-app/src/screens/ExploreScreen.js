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
            <Ionicons name="options-outline" size={24} color="#2c5f2d" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search content..."
              placeholderTextColor="#999"
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
                <Ionicons name="trending-up" size={16} color="#2c5f2d" />
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
                  <Ionicons name={item.icon} size={32} color="#2c5f2d" />
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
                      <Ionicons name="person-outline" size={14} color="#999" />
                      <Text style={styles.exploreMetaText}>{item.author}</Text>
                    </View>
                  </View>
                  <View style={styles.exploreFooter}>
                    <View style={styles.exploreMetaItem}>
                      <Ionicons name="eye-outline" size={14} color="#999" />
                      <Text style={styles.exploreMetaText}>{item.views}</Text>
                    </View>
                    <View style={styles.exploreMetaItem}>
                      <Ionicons name="time-outline" size={14} color="#999" />
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
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fff',
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
  categoriesScroll: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryChipActive: {
    backgroundColor: '#2c5f2d',
    borderColor: '#2c5f2d',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c5f2d',
  },
  seeAll: {
    fontSize: 14,
    color: '#2c5f2d',
    fontWeight: '600',
  },
  trendingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  trendingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  trendingContent: {
    gap: 2,
  },
  trendingName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  trendingCount: {
    fontSize: 12,
    color: '#999',
  },
  exploreGrid: {
    marginTop: 15,
    gap: 12,
  },
  exploreCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    gap: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  exploreIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exploreContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 5,
  },
  categoryBadgeText: {
    fontSize: 11,
    color: '#2c5f2d',
    fontWeight: '600',
  },
  exploreTitle: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
    marginBottom: 5,
  },
  exploreMetaRow: {
    marginBottom: 5,
  },
  exploreMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exploreMetaText: {
    fontSize: 12,
    color: '#999',
  },
  exploreFooter: {
    flexDirection: 'row',
    gap: 15,
  },
});

export default ExploreScreen;
