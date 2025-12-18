import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Platform
} from 'react-native';
import { getAllSurahs } from '../services/quranService';

/**
 * QuranScreen - Main Quran browsing screen
 * 
 * Features:
 * - List of all 114 surahs
 * - Search functionality
 * - Offline-first (data from local DB)
 * - Fast virtualized list
 */
export default function QuranScreen({ navigation }) {
  const [surahs, setSurahs] = useState([]);
  const [filteredSurahs, setFilteredSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSurahs();
  }, []);

  useEffect(() => {
    filterSurahs();
  }, [searchQuery, surahs]);

  const loadSurahs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllSurahs();
      
      if (response.success) {
        setSurahs(response.data);
        setFilteredSurahs(response.data);
      }
    } catch (err) {
      console.error('Error loading surahs:', err);
      setError('Failed to load Quran. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterSurahs = () => {
    if (!searchQuery.trim()) {
      setFilteredSurahs(surahs);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = surahs.filter(
      (surah) =>
        surah.nameTransliteration.toLowerCase().includes(query) ||
        surah.nameTranslation.toLowerCase().includes(query) ||
        surah.surahNumber.toString().includes(query)
    );
    setFilteredSurahs(filtered);
  };

  const handleSurahPress = (surah) => {
    navigation.navigate('Surah', {
      surahNumber: surah.surahNumber,
      surahName: surah.nameTransliteration,
      surahNameArabic: surah.nameArabic
    });
  };

  const renderSurahItem = ({ item }) => (
    <TouchableOpacity
      style={styles.surahCard}
      onPress={() => handleSurahPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.surahNumber}>
        <Text style={styles.surahNumberText}>{item.surahNumber}</Text>
      </View>
      
      <View style={styles.surahInfo}>
        <Text style={styles.surahNameTransliteration}>
          {item.nameTransliteration}
        </Text>
        <Text style={styles.surahNameTranslation}>
          {item.nameTranslation}
        </Text>
        <View style={styles.surahMeta}>
          <Text style={styles.metaText}>{item.revelationType}</Text>
          <Text style={styles.metaText}> • </Text>
          <Text style={styles.metaText}>{item.ayahCount} Ayahs</Text>
        </View>
      </View>
      
      <View style={styles.surahArabic}>
        <Text style={styles.arabicText}>{item.nameArabic}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading Quran...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadSurahs}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>القرآن الكريم</Text>
        <Text style={styles.headerSubtitle}>The Noble Quran</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search surah..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      {/* Surah List */}
      <FlatList
        data={filteredSurahs}
        renderItem={renderSurahItem}
        keyExtractor={(item) => item.surahNumber.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={20}
        maxToRenderPerBatch={10}
        windowSize={10}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No surahs found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5'
  },
  header: {
    backgroundColor: '#2E7D32',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E8F5E9'
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    fontSize: 16
  },
  listContent: {
    padding: 15
  },
  surahCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center'
  },
  surahNumber: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  surahNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32'
  },
  surahInfo: {
    flex: 1
  },
  surahNameTransliteration: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3
  },
  surahNameTranslation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5
  },
  surahMeta: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  metaText: {
    fontSize: 12,
    color: '#999'
  },
  surahArabic: {
    marginLeft: 10
  },
  arabicText: {
    fontSize: 22,
    color: '#2E7D32',
    fontWeight: 'bold'
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666'
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginHorizontal: 30,
    marginBottom: 20
  },
  retryButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600'
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: '#999'
  }
});
