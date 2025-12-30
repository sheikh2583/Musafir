import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  I18nManager
} from 'react-native';
import { getSurah } from '../services/quranService';

/**
 * SurahScreen - Display all ayahs for a specific surah
 * 
 * Features:
 * - RTL Arabic text rendering
 * - Translation toggle (English/Bangla)
 * - Virtualized list for performance
 * - Offline-first
 * - Proper Arabic font sizing
 */
export default function SurahScreen({ route, navigation }) {
  const { surahNumber, surahName, surahNameArabic } = route.params;
  
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTranslation, setShowTranslation] = useState(true);
  const [translationLang, setTranslationLang] = useState('en'); // 'en' or 'bn'

  useEffect(() => {
    navigation.setOptions({
      title: surahName,
      headerRight: () => (
        <TouchableOpacity
          onPress={toggleTranslation}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>
            {showTranslation ? 'Hide Translation' : 'Show Translation'}
          </Text>
        </TouchableOpacity>
      )
    });
  }, [showTranslation]);

  useEffect(() => {
    loadSurah();
  }, [surahNumber]);

  const loadSurah = async () => {
    try {
      setLoading(true);
      setError(null);
      const ayahsData = await getSurah(surahNumber, true);
      setAyahs(ayahsData);
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

  const toggleTranslationLanguage = useCallback(() => {
    setTranslationLang(prev => prev === 'en' ? 'bn' : 'en');
  }, []);

  const renderAyah = ({ item }) => {
    const translation = translationLang === 'en' 
      ? item.translationEn 
      : item.translationBn;

    return (
      <View style={styles.ayahCard}>
        {/* Ayah Number Badge */}
        <View style={styles.ayahHeader}>
          <View style={styles.ayahNumberBadge}>
            <Text style={styles.ayahNumberText}>{item.ayah}</Text>
          </View>
          
          {/* Metadata Icons */}
          {item.metadata?.sajda && (
            <View style={styles.sajdaBadge}>
              <Text style={styles.sajdaText}>سجدة</Text>
            </View>
          )}
        </View>

        {/* Arabic Text (RTL) */}
        <View style={styles.arabicContainer}>
          <Text style={styles.arabicText}>
            {item.arabicText}
          </Text>
        </View>

        {/* Translation */}
        {showTranslation && translation && (
          <View style={styles.translationContainer}>
            <Text style={styles.translationText}>{translation}</Text>
            
            {/* Language Toggle for Translation */}
            {item.translationBn && (
              <TouchableOpacity
                onPress={toggleTranslationLanguage}
                style={styles.langToggle}
              >
                <Text style={styles.langToggleText}>
                  {translationLang === 'en' ? 'বাংলা' : 'English'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Metadata */}
        {item.metadata && (
          <View style={styles.metadataContainer}>
            {item.metadata.juz && (
              <Text style={styles.metadataText}>Juz {item.metadata.juz}</Text>
            )}
            {item.metadata.page && (
              <Text style={styles.metadataText}> • Page {item.metadata.page}</Text>
            )}
          </View>
        )}
      </View>
    );
  };

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
      {/* Surah Header */}
      <View style={styles.surahHeader}>
        <Text style={styles.surahNameArabic}>{surahNameArabic}</Text>
        <Text style={styles.surahInfo}>
          {ayahs.length} Ayahs
        </Text>
      </View>

      {/* Bismillah (except for Surah 9) */}
      {surahNumber !== 9 && surahNumber !== 1 && (
        <View style={styles.bismillahContainer}>
          <Text style={styles.bismillahText}>
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </Text>
        </View>
      )}

      {/* Ayah List */}
      <FlatList
        data={ayahs}
        renderItem={renderAyah}
        keyExtractor={(item) => `${item.surah}-${item.ayah}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={Platform.OS === 'android'}
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  surahNameArabic: {
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
    padding: 20,
    margin: 15,
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
    padding: 15
  },
  ayahCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center'
  },
  ayahNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32'
  },
  sajdaBadge: {
    marginLeft: 10,
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5
  },
  sajdaText: {
    color: '#EF6C00',
    fontSize: 14,
    fontWeight: '600'
  },
  arabicContainer: {
    marginBottom: 15,
    paddingVertical: 10
  },
  arabicText: {
    fontSize: 28,
    lineHeight: 50,
    color: '#1B5E20',
    textAlign: 'right',
    writingDirection: 'rtl',
    fontWeight: '500'
  },
  translationContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 15
  },
  translationText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#424242',
    textAlign: 'left'
  },
  langToggle: {
    alignSelf: 'flex-end',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E8F5E9',
    borderRadius: 5
  },
  langToggleText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '600'
  },
  metadataContainer: {
    flexDirection: 'row',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5'
  },
  metadataText: {
    fontSize: 12,
    color: '#999'
  },
  headerButton: {
    marginRight: 15,
    padding: 5
  },
  headerButtonText: {
    color: '#FFF',
    fontSize: 14,
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
  }
});
