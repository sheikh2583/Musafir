import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform
} from 'react-native';
import { getCollections, getCollectionMetadata } from '../services/hadithService';

/**
 * HadithScreen - Main Hadith browsing screen
 * 
 * Features:
 * - Display all 6 collections (Sihah Sittah)
 * - Color-coded collection cards
 * - Offline-first
 * - Beautiful, respectful UI
 */
export default function HadithScreen({ navigation }) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCollections();
      
      if (response.success) {
        // Enrich with metadata (colors, etc.)
        const enriched = response.data.map(col => ({
          ...col,
          ...getCollectionMetadata(col.id)
        }));
        setCollections(enriched);
      }
    } catch (err) {
      console.error('Error loading collections:', err);
      setError('Failed to load Hadith collections. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionPress = (collection) => {
    navigation.navigate('HadithCollection', {
      collectionId: collection.id,
      collectionName: collection.name,
      collectionNameArabic: collection.nameArabic,
      collectionColor: collection.color
    });
  };

  const renderCollection = ({ item }) => (
    <TouchableOpacity
      style={[styles.collectionCard, { borderLeftColor: item.color }]}
      onPress={() => handleCollectionPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.collectionHeader}>
          <Text style={styles.collectionName}>{item.name}</Text>
          <Text style={styles.collectionNameArabic}>{item.nameArabic}</Text>
        </View>
        
        <Text style={styles.compiler}>{item.compiler}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statBadge}>
            <Text style={styles.statNumber}>{item.actualCount || 0}</Text>
            <Text style={styles.statLabel}>Hadiths Available</Text>
          </View>
        </View>
        
        <View style={styles.arrow}>
          <Text style={styles.arrowText}>→</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading Hadith Collections...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadCollections}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الصحاح الستة</Text>
        <Text style={styles.headerSubtitle}>Sihah Sittah - The Six Authentic Books</Text>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          These are the six most authentic hadith collections in Islam, 
          compiled by renowned scholars.
        </Text>
      </View>

      {/* Collections List */}
      <FlatList
        data={collections}
        renderItem={renderCollection}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    backgroundColor: '#1565C0',
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
    fontSize: 14,
    color: '#E3F2FD',
    textAlign: 'center'
  },
  infoCard: {
    backgroundColor: '#FFF',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#1565C0'
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22
  },
  listContent: {
    padding: 15,
    paddingTop: 0
  },
  collectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardContent: {
    position: 'relative'
  },
  collectionHeader: {
    marginBottom: 10
  },
  collectionName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5
  },
  collectionNameArabic: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600'
  },
  compiler: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 15
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 10
  },
  statBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    textTransform: 'uppercase'
  },
  arrow: {
    position: 'absolute',
    right: 0,
    top: '50%',
    marginTop: -15
  },
  arrowText: {
    fontSize: 30,
    color: '#DDD'
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
    backgroundColor: '#1565C0',
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
