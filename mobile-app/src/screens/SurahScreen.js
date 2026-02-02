import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  useWindowDimensions
} from 'react-native';
import { getSurah } from '../services/quranService';

// Helper to strip HTML tags
const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '');
};

const AyahItem = ({ item, showTranslation }) => {
  const [showTafseer, setShowTafseer] = useState(false);

  return (
    <View style={styles.ayahCard}>
      {/* Ayah Number Badge */}
      <View style={styles.ayahHeader}>
        <View style={styles.ayahNumberBadge}>
          <Text style={styles.ayahNumberText}>{item.ayah}</Text>
        </View>
        <View style={{ flex: 1 }} />
      </View>

      {/* Arabic Text (RTL) */}
      <View style={styles.arabicContainer}>
        <Text style={styles.arabicText}>
          {item.arabicText}
        </Text>
      </View>

      {/* Translation */}
      {showTranslation && (
        <View style={styles.translationContainer}>
          <Text style={styles.translationText}>{item.translationEn}</Text>
        </View>
      )}

      {/* Inline Tafseer Action */}
      {item.tafseer ? (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.tafseerToggle}
            onPress={() => setShowTafseer(!showTafseer)}
          >
            <Text style={styles.tafseerToggleText}>
              {showTafseer ? 'Hide Tafseer ▴' : 'Show Tafseer ▾'}
            </Text>
          </TouchableOpacity>

          {/* Collapsible Tafseer Content */}
          {showTafseer && (
            <View style={styles.tafseerContent}>
              <Text style={styles.tafseerTitle}>Tafseer Tazkirul Quran:</Text>
              <Text style={styles.tafseerText}>
                {stripHtml(item.tafseer)}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.actionContainer}>
          <Text style={styles.noTafseerText}>Tafseer not available</Text>
        </View>
      )}
    </View>
  );
};

/**
 * SurahScreen - Display all ayahs for a specific surah
 */
export default function SurahScreen({ route, navigation }) {
  const { surahNumber, surahName, surahNameArabic } = route.params;

  const [data, setData] = useState({ bismillah: null, verses: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTranslation, setShowTranslation] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      title: surahName,
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SurahQuiz', {
              surahNumber,
              surahName,
              surahNameArabic
            })}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleTranslation}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>
              {showTranslation ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>
      )
    });
  }, [showTranslation, surahNumber, surahName, surahNameArabic]);

  useEffect(() => {
    loadSurah();
  }, [surahNumber]);

  const loadSurah = async () => {
    try {
      setLoading(true);
      setError(null);
      // New getSurah returns { bismillah, verses: [...] }
      const result = await getSurah(surahNumber);
      setData(result);
    } catch (err) {
      console.error('Error loading surah:', err);
      setError('Failed to load surah. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTranslation = useCallback(() => {
    setShowTranslation(prev => !prev);
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading Surah {surahName}...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadSurah}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Surah Header + Bismillah handling in ListHeaderComponent */}
      <FlatList
        data={data.verses}
        renderItem={({ item }) => <AyahItem item={item} showTranslation={showTranslation} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={Platform.OS === 'android'}
        ListHeaderComponent={
          <View>
            <View style={styles.surahHeader}>
              <Text style={styles.surahNameArabicHeader}>{surahNameArabic}</Text>
              <Text style={styles.surahInfo}>
                {data.verses.length} Ayahs
              </Text>
            </View>

            {/* Conditional Bismillah Display */}
            {data.bismillah && (
              <View style={styles.bismillahContainer}>
                <Text style={styles.bismillahText}>
                  {data.bismillah}
                </Text>
              </View>
            )}
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
  surahHeader: {
    backgroundColor: '#2E7D32',
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  surahNameArabicHeader: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8
  },
  surahInfo: {
    fontSize: 14,
    color: '#E8F5E9'
  },
  bismillahContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    marginHorizontal: 15,
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  bismillahText: {
    fontSize: 24,
    color: '#2E7D32',
    fontWeight: '600',
    textAlign: 'center'
  },
  listContent: {
    paddingBottom: 20
  },
  ayahCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  ayahHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  ayahNumberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center'
  },
  ayahNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32'
  },
  arabicContainer: {
    marginBottom: 15,
    paddingVertical: 10
  },
  arabicText: {
    fontSize: 26,
    lineHeight: 48,
    color: '#1B5E20',
    textAlign: 'right',
    writingDirection: 'rtl',
    fontWeight: '500'
  },
  translationContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 15,
    marginBottom: 10
  },
  translationText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#424242',
    textAlign: 'left'
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    marginRight: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
  },
  headerButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600'
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
  // Inline Tafseer Styles (Matched to VerseSearchScreen)
  actionContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    marginTop: 10,
    paddingTop: 10
  },
  tafseerToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5
  },
  tafseerToggleText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600'
  },
  tafseerContent: {
    marginTop: 10,
    backgroundColor: '#FAFAFA',
    padding: 10,
    borderRadius: 8
  },
  tafseerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5
  },
  tafseerText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#444'
  },
  noTafseerText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
  }
});
