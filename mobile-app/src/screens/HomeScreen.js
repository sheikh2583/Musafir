import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>As-salamu alaykum</Text>
      <Text style={styles.subtitle}>Welcome, {user?.name || 'User'}</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Prayer Times</Text>
        <Text style={styles.cardText}>Coming soon...</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quran</Text>
        <Text style={styles.cardText}>Coming soon...</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Duas</Text>
        <Text style={styles.cardText}>Coming soon...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c5f2d',
    marginTop: 40,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c5f2d',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: '#999',
  },
});
