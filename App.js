// App.js - ACTUALIZADO CON WELCOME Y HOME
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Importar todas las pantallas
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import AttractiveScreen from './screens/AttractiveScreen';

import { Colors } from './constants/Colors';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Welcome" // 👈 Empezamos con Welcome
        screenOptions={{
          headerShown: false, // 👈 Sin headers por defecto
          animation: 'slide_from_right', // 👈 Animación suave
          gestureEnabled: true, // 👈 Gestos de navegación
        }}
      >
        {/* PANTALLA DE BIENVENIDA */}
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen}
          options={{ 
            headerShown: false,
            gestureEnabled: false, // No se puede volver atrás desde Welcome
          }}
        />
        
        {/* HOME PRINCIPAL */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ 
            headerShown: false,
            gestureEnabled: false, // No se puede volver a Welcome
          }}
        />
        
        {/* ATRACTIVOS (ya existe) */}
        <Stack.Screen 
          name="Attractives" 
          component={AttractiveScreen}
          options={{ 
            title: 'Atractivos',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#00add5',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        
        {/* PLACEHOLDER SCREENS - Para que no falle cuando navegue */}
        <Stack.Screen 
          name="Accommodation" 
          component={PlaceholderScreen}
          options={{ 
            title: 'Alojamiento',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#3b82f6',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        
        <Stack.Screen 
          name="Gastronomy" 
          component={PlaceholderScreen}
          options={{ 
            title: 'Gastronomía',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#8b5cf6',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        
        <Stack.Screen 
          name="Activities" 
          component={PlaceholderScreen}
          options={{ 
            title: 'Actividades',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#f59e0b',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// 🔧 COMPONENTE PLACEHOLDER TEMPORAL
// Para las pantallas que aún no creamos
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const PlaceholderScreen = ({ navigation, route }) => {
  const screenName = route.name;
  
  const getGradientColors = () => {
    switch (screenName) {
      case 'Accommodation': return ['#3b82f6', '#1e40af'];
      case 'Gastronomy': return ['#8b5cf6', '#7c3aed'];
      case 'Activities': return ['#f59e0b', '#d97706'];
      default: return ['#6b7280', '#4b5563'];
    }
  };

  const getIcon = () => {
    switch (screenName) {
      case 'Accommodation': return 'home-outline';
      case 'Gastronomy': return 'restaurant-outline';
      case 'Activities': return 'bicycle-outline';
      default: return 'construct-outline';
    }
  };

  const getDescription = () => {
    switch (screenName) {
      case 'Accommodation': return 'Encuentra el lugar perfecto para hospedarte en Potrero de los Funes';
      case 'Gastronomy': return 'Descubre los sabores únicos de la gastronomía serrana';
      case 'Activities': return 'Vive aventuras inolvidables en contacto con la naturaleza';
      default: return 'Próximamente disponible';
    }
  };

  return (
    <LinearGradient colors={getGradientColors()} style={placeholderStyles.container}>
      <View style={placeholderStyles.content}>
        <View style={placeholderStyles.iconContainer}>
          <Ionicons name={getIcon()} size={80} color="#fff" />
        </View>
        
        <Text style={placeholderStyles.title}>{screenName}</Text>
        <Text style={placeholderStyles.subtitle}>Próximamente</Text>
        <Text style={placeholderStyles.description}>{getDescription()}</Text>
        
        <TouchableOpacity 
          style={placeholderStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <View style={placeholderStyles.backButtonContent}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
            <Text style={placeholderStyles.backButtonText}>Volver al inicio</Text>
          </View>
        </TouchableOpacity>
        
        <View style={placeholderStyles.comingSoon}>
          <Ionicons name="time-outline" size={24} color="rgba(255,255,255,0.7)" />
          <Text style={placeholderStyles.comingSoonText}>¡Estamos trabajando en esta sección!</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const placeholderStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  comingSoon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  comingSoonText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
});