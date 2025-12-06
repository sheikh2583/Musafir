import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { fetchDestinations } from '../services/api';

// Fallback data in case API is not available
const fallbackDestinations = [
  { id: 1, name: 'Paris', country: 'France', description: 'The City of Light' },
  { id: 2, name: 'Tokyo', country: 'Japan', description: 'A blend of traditional and modern' },
  { id: 3, name: 'New York', country: 'USA', description: 'The City That Never Sleeps' },
  { id: 4, name: 'Dubai', country: 'UAE', description: 'City of Gold' },
  { id: 5, name: 'London', country: 'UK', description: 'Historic and vibrant capital' },
];

export default function DestinationsScreen({ navigation }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadDestinations = async () => {
    try {
      setError(null);
      const data = await fetchDestinations();
      setDestinations(data);
    } catch (err) {
      setError('Unable to connect to server. Showing sample data.');
      setDestinations(fallbackDestinations);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDestinations();
  };

  const renderDestination = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DestinationDetail', { destination: item })}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardIcon}>
          <Text style={styles.cardIconText}>🗺️</Text>
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>{item.country}</Text>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading destinations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      <FlatList
        data={destinations}
        renderItem={renderDestination}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2196F3']} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorBanner: {
    backgroundColor: '#FFF3E0',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFB74D',
  },
  errorText: {
    color: '#E65100',
    textAlign: 'center',
    fontSize: 14,
  },
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardIconText: {
    fontSize: 28,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#2196F3',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  arrow: {
    fontSize: 30,
    color: '#ccc',
    marginLeft: 10,
  },
});
