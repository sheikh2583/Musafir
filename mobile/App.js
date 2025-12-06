import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import DestinationsScreen from './src/screens/DestinationsScreen';
import DestinationDetailScreen from './src/screens/DestinationDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Musafir' }}
        />
        <Stack.Screen
          name="Destinations"
          component={DestinationsScreen}
          options={{ title: 'Destinations' }}
        />
        <Stack.Screen
          name="DestinationDetail"
          component={DestinationDetailScreen}
          options={{ title: 'Destination Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
