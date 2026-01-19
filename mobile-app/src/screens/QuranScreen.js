import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import quranService from '../services/quranService';

const QuranScreen = ({ navigation }) => {
  const [surahs, setSurahs] = useState([]);
  const [filteredSurahs, setFilteredSurahs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchMode, setSearchMode] = useState('surah'); // 'surah' or 'verse'

  useEffect(() => {
    fetchSurahs();
  }, []);

  const fetchSurahs = async () => {
    try {
      setLoading(true);
      const data = await quranService.getSurahs();
      setSurahs(data);
      setFilteredSurahs(data);
    } catch (error) {
      console.error('Error fetching surahs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (searchMode === 'surah') {
      // Filter surahs by name
      if (text.trim() === '') {
        setFilteredSurahs(surahs);
      } else {
        const filtered = surahs.filter((surah) =>
          surah.englishName.toLowerCase().includes(text.toLowerCase()) ||
          surah.arabicName.includes(text) ||
          surah.number.toString().includes(text)
        );
        setFilteredSurahs(filtered);
      }
    }
  };

  const handleVerseSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('VerseSearch', { query: searchQuery.trim() });
    }
  };

  const renderSurahItem = ({ item }) => (
    <TouchableOpacity
      style={styles.surahCard}
      onPress={() => navigation.navigate('Surah', { surahNumber: item.number })}
    >
      <View style={styles.surahNumber}>
        <Text style={styles.surahNumberText}>{item.number}</Text>
      </View>
      <View style={styles.surahInfo}>
        <Text style={styles.surahEnglishName}>{item.englishName}</Text>
        <Text style={styles.surahDetails}>
          {item.revelationType} • {item.numberOfAyahs} Ayahs
        </Text>
      </View>
      <Text style={styles.surahArabicName}>{item.arabicName}</Text>
    </TouchableOpacity>
  );

  const renderEmptySearch = () => (
    <View style={styles.emptyContainer}>
      <Icon name="search-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>Enter a question or topic</Text>
      <Text style={styles.emptyText}>
        Search for verses by meaning, topic, or context.{'\n'}
        Example: "What does the Quran say about patience?"
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>القرآن الكريم</Text>
          <Text style={styles.headerSubtitle}>The Holy Quran</Text>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('ArabicWriting')}
          >
            <Icon name="create-outline" size={20} color="#2E7D32" />
            <Text style={styles.actionButtonText}>Write</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('QuranQuiz')}
          >
            <Icon name="school-outline" size={20} color="#2E7D32" />
            <Text style={styles.actionButtonText}>Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Mode Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, searchMode === 'surah' && styles.toggleButtonActive]}
          onPress={() => setSearchMode('surah')}
        >
          <Text style={[styles.toggleText, searchMode === 'surah' && styles.toggleTextActive]}>
            Browse Surahs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, searchMode === 'verse' && styles.toggleButtonActive]}
          onPress={() => setSearchMode('verse')}
        >
          <Text style={[styles.toggleText, searchMode === 'verse' && styles.toggleTextActive]}>
            Search Verses
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={searchMode === 'surah' ? 'Search surahs...' : 'Ask a question or search by meaning...'}
          value={searchQuery}
          onChangeText={handleSearch}
          onSubmitEditing={searchMode === 'verse' ? handleVerseSearch : undefined}
          returnKeyType={searchMode === 'verse' ? 'search' : 'done'}
        />
        {searchMode === 'verse' && searchQuery.trim() && (
          <TouchableOpacity onPress={handleVerseSearch} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Info box for verse search mode */}
      {searchMode === 'verse' && (
        <View style={styles.infoBox}>
          <Icon name="information-circle-outline" size={20} color="#1976D2" />
          <Text style={styles.infoText}>
            Semantic search powered by AI - search by meaning, not just keywords
          </Text>
        </View>
      )}

      {/* Content */}
      {searchMode === 'surah' ? (
        <FlatList
          data={filteredSurahs}
          renderItem={renderSurahItem}
          keyExtractor={(item) => item.number.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptySearch()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#2E7D32',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E8F5E9',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    maxWidth: 160,
  },
  actionButtonText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#2E7D32',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  toggleTextActive: {
    color: '#FFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#1976D2',
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: '#1976D2',
    lineHeight: 18,
  },
  listContainer: {
    padding: 20,
  },
  surahCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  surahNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  surahNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  surahInfo: {
    flex: 1,
  },
  surahEnglishName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  surahDetails: {
    fontSize: 13,
    color: '#666',
  },
  surahArabicName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default QuranScreen;
